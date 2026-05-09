---
title: Transformer Chatbot API
emoji: 🤖
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Transformer Chatbot API

A decoder-only transformer built from scratch in PyTorch + Lightning, trained on a Q&A dataset about Huy's CV. Serves as the chatbot widget on the portfolio site.

## Architecture

Stacked decoder blocks with multi-head self-attention, layer norm, GELU FFN, weight tying.

| Hyperparameter | Default |
|----------------|---------|
| `d_model`      | 256     |
| `n_heads`      | 4       |
| `n_layers`     | 4       |
| `d_ff`         | 1024    |
| `max_len`      | 64      |
| Vocab          | word-level, built from training data |

## Training

The model **must be trained before serving** — there are no pre-trained weights checked in.

```bash
cd cv-website/llm-api
pip install -r requirements.txt
python train.py                 # 80 epochs, ~3-10 min on CPU
```

Outputs:
- `vocab.pkl` — `wrd2idx`, `idx2wrd`, and architecture config
- `transformer_chatbot.pt` — model state dict

To customise training data, edit `data_huy.json` (intent format with `patterns` and `responses`) and re-run `python train.py`.

## Local serving

```bash
uvicorn app_api:app --host 0.0.0.0 --port 7860 --reload

# Test
curl -X POST http://localhost:7860/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"who are you?"}'
# → {"reply":"my name is quoc huy dinh you can call me ryan"}
```

## Endpoints

- `GET /` — health check, returns `{status, model_loaded}`
- `POST /chat` — body `{"message": str, "temperature": float}` → `{"reply": str}`

## Files

```
llm-api/
├── app_api.py              # FastAPI server (loads model + vocab on startup)
├── train.py                # Training script (run after editing data_huy.json)
├── data_huy.json           # Q&A intents about Huy — edit this to update bot knowledge
├── model/
│   └── transformer_model.py  # Multi-head, multi-layer decoder transformer
├── transformer_chatbot.pt  # Model weights (created by train.py)
├── vocab.pkl               # Tokenizer + config (created by train.py)
├── Dockerfile              # Python 3.11-slim, exposes 7860
├── requirements.txt        # torch, fastapi, uvicorn, lightning, pydantic
└── README.md               # This file (with HF Spaces YAML header)
```

## Deploy to Hugging Face Spaces

The frontend deploys to Vercel; this LLM service deploys to HF Spaces (free Docker tier).

```bash
# 1. Train locally
python train.py

# 2. Create a new HF Space (Docker SDK) at https://huggingface.co/new-space

# 3. Push this folder to the Space
git clone https://huggingface.co/spaces/<username>/transformer-chatbot-api /tmp/space
cp -r ./* /tmp/space/
cd /tmp/space
git lfs install
git lfs track "*.pt" "*.pkl"
git add .gitattributes .
git commit -m "deploy fastapi chatbot"
git push
```

In Space **Settings → Variables**:
```
ALLOWED_ORIGINS = https://<your-vercel-domain>.vercel.app,http://localhost:3000
```

Set the Space URL into the Vercel project's `HF_SPACE_URL` env var.
