"""FastAPI server wrapping the from-scratch transformer chatbot."""

from __future__ import annotations

import os
import pickle
import re
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model.transformer_model import DecoderOnlyTransformers

state: dict = {}


def load_model() -> None:
    here = Path(__file__).parent
    with (here / "vocab.pkl").open("rb") as f:
        vocab = pickle.load(f)

    wrd2idx = vocab["wrd2idx"]
    idx2wrd = vocab["idx2wrd"]
    config = vocab.get("config", {})

    cfg = {
        "vocab_size": config.get("vocab_size", len(wrd2idx)),
        "d_model": config.get("d_model", 256),
        "n_heads": config.get("n_heads", 4),
        "n_layers": config.get("n_layers", 4),
        "d_ff": config.get("d_ff", config.get("d_model", 256) * 4),
        "max_len": config.get("max_len", 64),
    }

    model = DecoderOnlyTransformers(
        tokens=cfg["vocab_size"],
        d_model=cfg["d_model"],
        n_heads=cfg["n_heads"],
        n_layers=cfg["n_layers"],
        d_ff=cfg["d_ff"],
        max_len=cfg["max_len"],
        pad_id=wrd2idx["<PAD>"],
    )
    state_dict = torch.load(here / "transformer_chatbot.pt", map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()

    state.update(
        wrd2idx=wrd2idx,
        idx2wrd=idx2wrd,
        eos_id=wrd2idx["<EOS>"],
        pad_id=wrd2idx["<PAD>"],
        unk_id=wrd2idx.get("<UNK>", wrd2idx["<PAD>"]),
        model=model,
        max_len=cfg["max_len"],
    )


@torch.no_grad()
def generate(text: str, temperature: float = 0.7, max_new_tokens: int = 40) -> str:
    model = state["model"]
    wrd2idx = state["wrd2idx"]
    idx2wrd = state["idx2wrd"]
    eos_id = state["eos_id"]
    pad_id = state["pad_id"]
    unk_id = state["unk_id"]
    max_len = state["max_len"]

    toks = re.sub(r"[^\w\s]", "", text.lower()).split()
    seq = [wrd2idx.get(t, unk_id) for t in toks] + [eos_id]

    for _ in range(max_new_tokens):
        ctx = seq[-max_len:] if len(seq) > max_len else seq
        x = torch.tensor(ctx).unsqueeze(0)
        logits = model(x)
        last_logits = logits[0, -1, :]
        probs = torch.softmax(last_logits / max(temperature, 1e-3), dim=-1)
        next_id = int(torch.multinomial(probs, num_samples=1).item())
        seq.append(next_id)
        if next_id == eos_id:
            break

    if eos_id in seq:
        first_eos = seq.index(eos_id)
        out_ids = seq[first_eos + 1 :]
        if eos_id in out_ids:
            out_ids = out_ids[: out_ids.index(eos_id)]
    else:
        out_ids = seq

    words = [idx2wrd[i] for i in out_ids if i not in (pad_id, eos_id)]
    return " ".join(words).strip()


@asynccontextmanager
async def lifespan(_: FastAPI):
    load_model()
    yield


app = FastAPI(title="Transformer Chatbot API", lifespan=lifespan)

allowed_origins = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,https://cv-website.vercel.app",
    ).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    temperature: float = Field(0.7, ge=0.05, le=2.0)


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def health() -> dict:
    return {"status": "ok", "model_loaded": "model" in state}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    try:
        reply = generate(req.message, temperature=req.temperature)
    except Exception as e:  # noqa: BLE001 — surface to client as 500
        raise HTTPException(status_code=500, detail=f"inference failed: {e}") from e
    if not reply:
        reply = "(model is silent — try rephrasing)"
    return ChatResponse(reply=reply)
