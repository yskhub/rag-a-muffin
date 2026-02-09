# Phase 6: Deployment & Documentation

> **Duration: 3 Days** | **Difficulty: Intermediate** | **Cost: $0.00**

---

## 🎯 Phase Objectives

- ✅ Deploy backend to Render (FREE)
- ✅ Deploy frontend to Vercel (FREE)
- ✅ Configure environment variables
- ✅ Create comprehensive README
- ✅ Record demo video

---

## 📋 Day 17: Backend Deployment (Render)

### Step 6.1: Create Render Configuration

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: ecommerce-chatbot-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GOOGLE_API_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
      - key: CHROMA_DB_PATH
        value: /opt/render/project/src/chroma_db
      - key: ALLOWED_ORIGINS
        value: https://your-app.vercel.app
    plan: free
```

### Step 6.2: Deploy to Render

1. Go to https://render.com and sign up (FREE)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `backend` folder as root
5. Add environment variables:
   - `GOOGLE_API_KEY` = your Gemini key
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_KEY` = your Supabase anon key
6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. Your API: `https://your-app.onrender.com`

**FREE Tier Limits:**
- ✅ 750 hours/month
- ✅ Sleeps after 15min inactivity
- ✅ No credit card required

---

## 📋 Day 18: Frontend Deployment (Vercel)

### Step 6.3: Create Vercel Configuration

Create `frontend/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Step 6.4: Deploy to Vercel

1. Go to https://vercel.com and sign up (FREE)
2. Click **"Import Project"**
3. Connect your GitHub repository
4. Set root directory to `frontend`
5. Add environment variable:
   - `VITE_API_URL` = `https://your-app.onrender.com/api`
6. Click **"Deploy"**
7. Your app: `https://your-app.vercel.app`

**FREE Forever!** No credit card required.

---

## 📋 Day 19: Documentation & Demo

### Step 6.5: Create Final README.md

Create `README.md` in project root:

```markdown
# 🤖 AI-Powered E-Commerce Chatbot (100% FREE)

RAG-powered customer support chatbot using Google Gemini and ChromaDB.

## 💰 Total Cost: $0.00

| Component | Service | Cost |
|-----------|---------|------|
| LLM | Google Gemini 1.5 Flash | FREE |
| Vector DB | ChromaDB | FREE |
| Backend | Render | FREE |
| Frontend | Vercel | FREE |
| Database | Supabase | FREE |

## 🔗 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.onrender.com
- **Demo Video**: [Loom/YouTube Link]

## ✨ Features

- 💬 Natural language chat interface
- 🔍 Semantic search with RAG
- 📄 PDF document upload
- 🧠 Conversation memory
- 📊 Source citations
- ⚙️ Admin dashboard

## 🛠️ Tech Stack

**Frontend**: React + Vite + Tailwind CSS
**Backend**: FastAPI + Python
**AI**: Google Gemini 1.5 Flash (FREE)
**Vector DB**: ChromaDB (Local)
**Database**: Supabase (FREE 500MB)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Google Gemini API Key](https://makersuite.google.com/app/apikey) (FREE)
- [Supabase Account](https://supabase.com) (FREE)

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ecommerce-chatbot.git
cd ecommerce-chatbot

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Add VITE_API_URL=http://localhost:8000/api

# Run
# Terminal 1: cd backend && uvicorn app.main:app --reload
# Terminal 2: cd frontend && npm run dev

# Open http://localhost:5173
```

## 📊 Free Tier Limits

- 15 chat requests/minute (Gemini)
- 1500 requests/day (Gemini)
- 750 server hours/month (Render)
- 500MB database (Supabase)

## 👨‍💻 Author

**Your Name** - [GitHub](https://github.com/yourusername)

## 📝 License

MIT License
```

### Step 6.6: Record Demo Video

**Using OBS Studio (FREE):**

1. Download from https://obsproject.com
2. Add "Display Capture" source
3. Record 7-10 minutes covering:
   - 0:00-1:00 - Project overview
   - 1:00-2:30 - Admin: Upload document
   - 2:30-5:00 - Chat demo (3-4 queries)
   - 5:00-6:00 - Show source citations
   - 6:00-7:00 - Code walkthrough
4. Upload to YouTube (unlisted)

---

## ✅ Final Submission Checklist

- [ ] GitHub repo is PUBLIC
- [ ] 20+ meaningful commits
- [ ] README.md complete with all sections
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Demo video recorded and uploaded
- [ ] All features working in production

---

## 🎉 Congratulations!

You've built a complete AI-powered chatbot using **100% FREE** services!

**Total development time:** ~3-4 weeks
**Total cost:** **$0.00** 💰

---

## 🔗 Useful Links

- [Google Gemini API](https://makersuite.google.com/app/apikey)
- [Supabase](https://supabase.com)
- [Render](https://render.com)
- [Vercel](https://vercel.com)
- [ChromaDB Docs](https://docs.trychroma.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
