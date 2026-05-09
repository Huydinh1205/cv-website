"""Train the from-scratch transformer chatbot on Huy's CV Q&A dataset.

Usage:
    cd cv-website/llm-api
    pip install -r requirements.txt
    python train.py                  # default 80 epochs
    python train.py --epochs 200     # train longer
    python train.py --data data_huy.json --max-len 64

Outputs:
    vocab.pkl                  (with wrd2idx, idx2wrd, and model config)
    transformer_chatbot.pt     (state_dict)

After training, restart the FastAPI server to pick up the new weights.
"""

from __future__ import annotations

import argparse
import json
import pickle
import re
from pathlib import Path

import lightning as L
import torch
from torch.utils.data import DataLoader, TensorDataset

from model.transformer_model import DecoderOnlyTransformers


def tokenize(text: str) -> list[str]:
    return re.sub(r"[^\w\s]", "", text.lower()).split()


def build_pairs(data: dict) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for intent in data["intents"]:
        for pattern in intent["patterns"]:
            for response in intent["responses"]:
                pairs.append((pattern, response))
    return pairs


def build_vocab(pairs: list[tuple[str, str]]) -> dict[str, int]:
    words: set[str] = set()
    for q, a in pairs:
        words.update(tokenize(q))
        words.update(tokenize(a))
    sorted_words = sorted(words)
    sorted_words += ["<EOS>", "<PAD>", "<UNK>"]
    return {w: i for i, w in enumerate(sorted_words)}


def encode_pair(q: str, a: str, wrd2idx: dict[str, int], max_len: int) -> tuple[list[int], list[int]] | None:
    eos = wrd2idx["<EOS>"]
    pad = wrd2idx["<PAD>"]
    unk = wrd2idx["<UNK>"]

    q_ids = [wrd2idx.get(w, unk) for w in tokenize(q)]
    a_ids = [wrd2idx.get(w, unk) for w in tokenize(a)]
    seq = q_ids + [eos] + a_ids + [eos]
    if len(seq) > max_len:
        return None  # skip pairs that exceed max_len
    seq = seq + [pad] * (max_len - len(seq))
    x = seq[:-1]
    y = seq[1:]
    return x, y


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data_huy.json")
    parser.add_argument("--epochs", type=int, default=80)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--max-len", type=int, default=64)
    parser.add_argument("--d-model", type=int, default=256)
    parser.add_argument("--n-heads", type=int, default=4)
    parser.add_argument("--n-layers", type=int, default=4)
    parser.add_argument("--lr", type=float, default=3e-4)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    L.seed_everything(args.seed)

    here = Path(__file__).parent
    with open(here / args.data, encoding="utf-8") as f:
        data = json.load(f)

    pairs = build_pairs(data)
    print(f"Loaded {len(pairs)} (pattern, response) pairs from {args.data}")

    wrd2idx = build_vocab(pairs)
    idx2wrd = {i: w for w, i in wrd2idx.items()}
    print(f"Vocab size: {len(wrd2idx)}")

    encoded = [encode_pair(q, a, wrd2idx, args.max_len) for q, a in pairs]
    encoded = [e for e in encoded if e is not None]
    if len(encoded) < len(pairs):
        print(f"Skipped {len(pairs) - len(encoded)} pairs longer than max_len={args.max_len}")

    inputs = torch.tensor([x for x, _ in encoded], dtype=torch.long)
    labels = torch.tensor([y for _, y in encoded], dtype=torch.long)
    dataset = TensorDataset(inputs, labels)
    loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=True)

    model = DecoderOnlyTransformers(
        tokens=len(wrd2idx),
        d_model=args.d_model,
        n_heads=args.n_heads,
        n_layers=args.n_layers,
        d_ff=args.d_model * 4,
        max_len=args.max_len,
        pad_id=wrd2idx["<PAD>"],
        lr=args.lr,
    )

    n_params = sum(p.numel() for p in model.parameters())
    print(f"Model params: {n_params:,}")

    accelerator = "gpu" if torch.cuda.is_available() else "cpu"
    trainer = L.Trainer(
        max_epochs=args.epochs,
        accelerator=accelerator,
        devices=1,
        log_every_n_steps=5,
        enable_checkpointing=False,
        logger=False,
    )
    trainer.fit(model, loader)

    vocab_payload = {
        "wrd2idx": wrd2idx,
        "idx2wrd": idx2wrd,
        "config": {
            "vocab_size": len(wrd2idx),
            "d_model": args.d_model,
            "n_heads": args.n_heads,
            "n_layers": args.n_layers,
            "d_ff": args.d_model * 4,
            "max_len": args.max_len,
        },
    }
    with (here / "vocab.pkl").open("wb") as f:
        pickle.dump(vocab_payload, f)
    torch.save(model.state_dict(), here / "transformer_chatbot.pt")
    print("Saved vocab.pkl and transformer_chatbot.pt")


if __name__ == "__main__":
    main()
