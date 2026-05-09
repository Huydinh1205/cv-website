"""Decoder-only transformer built from scratch (PyTorch + Lightning).

Scaled up from the original single-head/single-layer demo to a small but
properly-shaped model: multi-head attention, stacked decoder blocks, FFN,
LayerNorm. Still kept small enough to train on CPU in a few minutes.
"""

from __future__ import annotations

import math
import pickle
from pathlib import Path

import lightning as L
import torch
import torch.nn as nn
from torch.optim import Adam


def _load_pad_id() -> int:
    """Load PAD index from vocab.pkl in the current working directory.

    Returns 0 if vocab.pkl is missing — only matters at training time, the
    real value is supplied via the constructor.
    """
    p = Path("vocab.pkl")
    if not p.exists():
        return 0
    with p.open("rb") as f:
        vocab = pickle.load(f)
    return int(vocab["wrd2idx"]["<PAD>"])


class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        pos = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        emb_index = torch.arange(0, d_model, 2, dtype=torch.float)
        div_term = 1 / (10000 ** (emb_index / d_model))
        pe[:, 0::2] = torch.sin(pos * div_term)
        pe[:, 1::2] = torch.cos(pos * div_term)
        self.register_buffer("pe", pe)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        seq_len = x.size(1)
        return x + self.pe[:seq_len, :].unsqueeze(0)


class MultiHeadSelfAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor, mask: torch.Tensor | None = None) -> torch.Tensor:
        b, t, _ = x.shape
        q = self.W_q(x).view(b, t, self.n_heads, self.d_head).transpose(1, 2)
        k = self.W_k(x).view(b, t, self.n_heads, self.d_head).transpose(1, 2)
        v = self.W_v(x).view(b, t, self.n_heads, self.d_head).transpose(1, 2)
        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_head)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float("-inf"))
        attn = torch.softmax(scores, dim=-1)
        attn = self.dropout(attn)
        out = (attn @ v).transpose(1, 2).contiguous().view(b, t, self.d_model)
        return self.W_o(out)


class FeedForward(nn.Module):
    def __init__(self, d_model: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class DecoderBlock(nn.Module):
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.attn = MultiHeadSelfAttention(d_model, n_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.ln1 = nn.LayerNorm(d_model)
        self.ln2 = nn.LayerNorm(d_model)

    def forward(self, x: torch.Tensor, mask: torch.Tensor | None = None) -> torch.Tensor:
        x = x + self.attn(self.ln1(x), mask)
        x = x + self.ff(self.ln2(x))
        return x


class DecoderOnlyTransformers(L.LightningModule):
    """Stacked decoder-only transformer.

    Default config matches the scaled-up architecture: 4 layers, 4 heads,
    d_model=256. Old single-head/single-layer checkpoints are NOT loadable
    with these defaults — train from scratch with `train.py`.
    """

    def __init__(
        self,
        tokens: int = 412,
        d_model: int = 256,
        n_heads: int = 4,
        n_layers: int = 4,
        d_ff: int = 1024,
        max_len: int = 64,
        pad_id: int | None = None,
        dropout: float = 0.1,
        lr: float = 3e-4,
    ):
        super().__init__()
        self.save_hyperparameters()
        if pad_id is None:
            pad_id = _load_pad_id()
        self.pad_id = pad_id
        self.max_len = max_len
        self.lr = lr

        self.we = nn.Embedding(tokens, d_model, padding_idx=pad_id)
        self.pe = PositionalEncoding(d_model, max_len)
        self.dropout = nn.Dropout(dropout)
        self.blocks = nn.ModuleList(
            [DecoderBlock(d_model, n_heads, d_ff, dropout) for _ in range(n_layers)]
        )
        self.ln_f = nn.LayerNorm(d_model)
        self.fc_layer = nn.Linear(d_model, tokens, bias=False)
        # Weight tying — share input embedding and output projection.
        self.fc_layer.weight = self.we.weight

        self.loss = nn.CrossEntropyLoss(ignore_index=pad_id)

    def _build_mask(self, token_ids: torch.Tensor) -> torch.Tensor:
        b, t = token_ids.shape
        device = token_ids.device
        causal = torch.tril(torch.ones(t, t, device=device)).unsqueeze(0).unsqueeze(0)
        pad = (token_ids != self.pad_id).unsqueeze(1).unsqueeze(2)
        return (causal * pad).to(device)

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        x = self.we(token_ids)
        x = self.pe(x)
        x = self.dropout(x)
        mask = self._build_mask(token_ids)
        for block in self.blocks:
            x = block(x, mask)
        x = self.ln_f(x)
        return self.fc_layer(x)

    def configure_optimizers(self):
        return Adam(self.parameters(), lr=self.lr)

    def training_step(self, batch, batch_idx):
        inputs, labels = batch
        logits = self.forward(inputs)
        loss = self.loss(logits.view(-1, logits.size(-1)), labels.view(-1))
        self.log("train_loss", loss, on_step=True, on_epoch=True, prog_bar=True)
        return loss
