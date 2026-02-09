# AI-Powered RAG Chatbot - Development Phases Overview

> **100% FREE Implementation - No Credit Card Required**

This folder contains comprehensive phase-by-phase development documentation for building an AI-Powered Contextual Website Chatbot with Retrieval-Augmented Generation (RAG).

## 📋 Quick Reference

| Phase | Duration | Focus Area |
|-------|----------|------------|
| [Phase 1](./Phase_1_Environment_Setup.md) | 2 Days | Environment Setup & Foundation |
| [Phase 2](./Phase_2_Backend_Development.md) | 3 Days | Backend API Development |
| [Phase 3](./Phase_3_RAG_Pipeline.md) | 4 Days | RAG Pipeline Implementation |
| [Phase 4](./Phase_4_Frontend_Development.md) | 4 Days | Frontend Development |
| [Phase 5](./Phase_5_Integration_Testing.md) | 3 Days | Integration & Testing |
| [Phase 6](./Phase_6_Deployment.md) | 3 Days | Deployment & Documentation |

**Total Duration: ~3-4 Weeks**

---

## 💰 Tech Stack (100% FREE)

### Frontend
| Component | Technology | Cost | Limit |
|-----------|------------|------|-------|
| Framework | React + Vite | FREE | Unlimited |
| Styling | Tailwind CSS | FREE | Unlimited |
| State Mgmt | Zustand | FREE | Unlimited |
| Hosting | **Vercel** | FREE | 100GB bandwidth |

### Backend
| Component | Technology | Cost | Limit |
|-----------|------------|------|-------|
| Framework | FastAPI (Python) | FREE | Unlimited |
| Hosting | **Render** | FREE | 750 hrs/month |
| Database | **Supabase** | FREE | 500MB storage |

### AI & RAG Pipeline
| Component | Technology | Cost | Limit |
|-----------|------------|------|-------|
| LLM | **Google Gemini 1.5 Flash** | FREE | 15 RPM, 1500 RPD |
| Vector DB | **ChromaDB** | FREE | Local storage |
| Embeddings | **Hugging Face** | FREE | Runs locally |
| Memory | Python Dict | FREE | In-memory |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (FREE)                           │
│  React + Vite + Tailwind CSS                                │
│  Deployed on: Vercel (Free Forever)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (FREE)                              │
│  FastAPI + Python 3.11                                      │
│  Deployed on: Render (Free tier - 750hrs/month)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              AI & RAG PIPELINE (FREE)                        │
│  ✅ Google Gemini 1.5 Flash (Free 15 RPM)                   │
│  ✅ ChromaDB (Local Vector Store - Free)                    │
│  ✅ Sentence Transformers (Free Embeddings)                 │
│  ✅ LangChain (Free Framework)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                DATA LAYER (FREE)                             │
│  ✅ ChromaDB - Persistent Local Storage                     │
│  ✅ Supabase - PostgreSQL (500MB free)                      │
│  ✅ Python Dict - In-memory session storage                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Required FREE API Keys

Before starting, obtain these FREE API keys:

### 1. Google Gemini API
- **URL**: https://makersuite.google.com/app/apikey
- **Limits**: 15 requests/min, 1500 requests/day
- **No credit card required**

### 2. Supabase
- **URL**: https://supabase.com
- **Limits**: 500MB database, 2GB bandwidth
- **No credit card required**

### 3. Hugging Face (Optional)
- **URL**: https://huggingface.co/settings/tokens
- **Note**: Only needed for private models, public models work without a token

---

## 📁 Project Structure

```
ecommerce-chatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── config.py               # Environment config
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py             # Chat endpoints
│   │   │   ├── documents.py        # Document management
│   │   │   └── admin.py            # Admin routes
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── gemini_service.py   # Google Gemini (FREE)
│   │   │   ├── chroma_service.py   # ChromaDB (FREE)
│   │   │   ├── embeddings.py       # HuggingFace (FREE)
│   │   │   ├── rag_pipeline.py     # Core RAG logic
│   │   │   └── memory_service.py   # In-memory storage
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   └── utils/
│   │       ├── document_processor.py
│   │       └── prompts.py
│   ├── chroma_db/                  # Local vector DB
│   ├── sample_docs/                # Sample PDFs
│   ├── requirements.txt
│   ├── .env.example
│   └── render.yaml                 # Render deployment
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── DocumentUpload.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── chatStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
│
├── docs/
│   └── screenshots/
│
├── Development_Phases/             # This folder
│   ├── README.md
│   ├── Phase_1_Environment_Setup.md
│   ├── Phase_2_Backend_Development.md
│   ├── Phase_3_RAG_Pipeline.md
│   ├── Phase_4_Frontend_Development.md
│   ├── Phase_5_Integration_Testing.md
│   └── Phase_6_Deployment.md
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## ⚠️ Important FREE Tier Considerations

### 1. Render Free Tier Sleep Mode
- Apps sleep after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- **Solution**: Show loading indicator on frontend

### 2. ChromaDB Persistence on Render
- Render's free tier has ephemeral storage
- **Solution**: Include sample docs in repo + auto-populate script

### 3. Gemini Rate Limits
- 15 requests/minute max
- **Solution**: Implement rate limiting in backend

### 4. Supabase Storage Limit
- 500MB database free
- **Solution**: Keep document metadata only, vectors in ChromaDB

---

## 🚀 Quick Start

1. **Read Phase 1** - Set up your development environment
2. **Get API Keys** - All FREE, no credit card needed
3. **Follow phases sequentially** - Each builds on the previous
4. **Test at each phase** - Verification steps included

---

## 📊 Expected Performance

| Metric | Value |
|--------|-------|
| Response Time | 2-5 seconds |
| Concurrent Users | 5-10 |
| Document Limit | ~1000 pages |
| Uptime | 99% (with sleep mode) |
| **Total Cost** | **$0.00** ✅ |

---

## 📹 Demo Recording

Use **OBS Studio** (FREE, unlimited recording):
- Download: https://obsproject.com/
- Record 7-10 minute demo
- Upload to YouTube (unlisted)

---

## ✅ Submission Checklist

- [ ] GitHub repo public with 20+ meaningful commits
- [ ] README.md with all sections
- [ ] Architecture diagram
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Demo video uploaded
- [ ] All environment variables documented

---

**Ready to start? Begin with [Phase 1: Environment Setup](./Phase_1_Environment_Setup.md)! 🚀**
