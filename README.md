# 🤖 RAG-a-Muffin: AI-Powered E-Commerce Chatbot (100% FREE)

RAG-powered customer support chatbot using Google Gemini and ChromaDB.

## 💰 Total Cost: $0.00

| Component | Service | Cost |
|-----------|---------|------|
| LLM | Google Gemini 1.5 Flash | FREE |
| Vector DB | ChromaDB | FREE |
| Backend | Render | FREE |
| Frontend | Vercel | FREE |
| Database | Supabase | FREE |

## ✨ Features

- 💬 Natural language chat interface
- 🔍 Semantic search with RAG
- 📄 PDF document upload
- 🧠 Conversation memory
- 📊 Source citations
- ⚙️ Admin dashboard

## 🛠️ Tech Stack

**Frontend**: React + Vite + Tailwind CSS + Zustand
**Backend**: FastAPI + Python + ChromaDB
**AI**: Google Gemini 1.5 Flash (FREE)
**Vector DB**: ChromaDB (Local Persistent)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Google Gemini API Key](https://makersuite.google.com/app/apikey) (FREE)

### Setup

```bash
# Clone repository
git clone <your-repo-url>
cd ecommerce-chatbot

# Backend setup
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env and add VITE_API_URL=http://localhost:8000/api

# Run (in two terminals)
# Terminal 1 (Backend)
uvicorn app.main:app --reload

# Terminal 2 (Frontend)
npm run dev
```

## 📊 Free Tier Limits

- 15 chat requests/minute (Gemini)
- 1500 requests/day (Gemini)
- 750 server hours/month (Render)
- 500MB database (Supabase)

## 📝 License

MIT
