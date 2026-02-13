<p align="center">
  <img src="https://img.shields.io/badge/Cost-$0.00-34d399?style=for-the-badge&labelColor=0f172a" alt="Cost: $0.00" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-00f0ff?style=for-the-badge&logo=google&labelColor=0f172a" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react&labelColor=0f172a" alt="React" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&labelColor=0f172a" alt="FastAPI" />
  <img src="https://img.shields.io/badge/VectorDB-ChromaDB-a78bfa?style=for-the-badge&labelColor=0f172a" alt="ChromaDB" />
</p>

<h1 align="center">◆ RAG-a-Muffin</h1>
<h3 align="center">AI Context Engine — Retrieval-Augmented Generation</h3>

<p align="center">
  An enterprise-grade AI assistant powered by RAG (Retrieval-Augmented Generation),<br/>
  built entirely on free-tier services. Total running cost: <strong>$0.00/month</strong>.
</p>

<p align="center">
  <a href="https://rag-a-muffin.vercel.app"><strong>🌐 Live Demo</strong></a> · 
  <a href="https://rag-a-muffin.onrender.com"><strong>⚡ Backend API</strong></a> · 
  <a href="https://rag-a-muffin.vercel.app/architecture.html"><strong>🏗️ Architecture Diagram</strong></a>
</p>

---

## 📖 About The Project

**RAG-a-Muffin** is a full-stack AI chatbot that answers questions based on **your own documents** — not just pre-trained knowledge. It uses **Retrieval-Augmented Generation (RAG)** to search through uploaded documents, find relevant information, and generate accurate, grounded responses using Google Gemini.

### What is RAG?

Traditional AI chatbots only know what they were trained on. They can't answer questions about YOUR specific products, policies, or data. **RAG solves this:**

1. **Upload** — Your documents are chunked and stored as vector embeddings in ChromaDB
2. **Retrieve** — When a user asks a question, the system finds the most relevant document chunks
3. **Augment** — Those relevant chunks are injected into the AI prompt as context
4. **Generate** — Google Gemini generates an answer grounded in YOUR actual data

> 💡 **The AI doesn't guess — it retrieves.** Every answer is backed by real documents with source citations.

---

## 🌟 Features

### Core AI Features
| Feature | Description |
|---------|-------------|
| 🔍 **RAG Pipeline** | Full retrieval-augmented generation with vector search |
| 🧠 **Conversation Memory** | Maintains context across messages within a session |
| 📄 **Document Upload** | Upload PDFs and text files to build the knowledge base |
| 📎 **Source Citations** | Every AI response shows which documents it referenced |
| 🛡️ **Anti-Hallucination** | AI says "I don't know" when the answer isn't in the knowledge base |

### UI Features (9 Total)
| # | Feature | Description |
|---|---------|-------------|
| 1 | 🎯 **Quick Actions** | Pre-built prompt buttons to guide users |
| 2 | ⏱️ **Response Timer** | Shows generation time (e.g., "2.3s") on each AI response |
| 3 | 🟢 **Live Health Check** | Real-time backend status — pings every 30 seconds |
| 4 | 📝 **Markdown Rendering** | AI responses with bold, lists, code blocks, tables |
| 5 | 👍👎 **Feedback System** | Thumbs up/down on every AI response |
| 6 | 📊 **Real Metrics** | Live document count and backend stats from API |
| 7 | 📋 **Chat Export** | Copy entire conversation to clipboard (Ctrl+E) |
| 8 | ⌨️ **Keyboard Shortcuts** | Ctrl+K (clear), Ctrl+E (export), Enter (send) |
| 9 | 💬 **Session History** | Auto-saved sessions with load/delete functionality |

### Enterprise UI
- 🏢 **3-Column Layout** — Chat + Metrics + AI Core visualization
- 🌙 **Dark Theme** — Professional dark design with glassmorphism
- 📊 **Live Dashboard** — Real-time metrics, subsystem status, activity log
- 🏗️ **Architecture Diagram** — Interactive system architecture page
- ⚙️ **Admin Panel** — Document management and data seeding

---

## 💰 Cost Breakdown

| Component | Service | Cost |
|-----------|---------|------|
| 🤖 LLM | Google Gemini 2.0 Flash | **FREE** (15 RPM) |
| 🗃️ Vector DB | ChromaDB (in-memory) | **FREE** |
| ⚡ Backend | Render | **FREE** (750 hrs/month) |
| 🌐 Frontend | Vercel | **FREE** |
| | **Total** | **$0.00/month** |

> No credit card required for any service.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI framework
- **Vite** — Lightning-fast build tool
- **Tailwind CSS v4** — Utility-first CSS with `@tailwindcss/vite` plugin
- **Zustand** — Lightweight state management with localStorage persistence
- **React-Markdown** — Markdown rendering with `remark-gfm`
- **Axios** — HTTP client with 120s timeout for free-tier cold starts

### Backend
- **FastAPI** — High-performance async Python API framework
- **Google Gemini 2.0 Flash** — Latest free LLM with 1M token context
- **ChromaDB** — Open-source vector embedding database
- **PyPDF2** — PDF document processing
- **python-dotenv** — Environment configuration

### DevOps
- **Vercel** — Frontend auto-deploy from GitHub
- **Render** — Backend hosting with free tier
- **GitHub** — Version control & CI/CD trigger

---

## 📁 Project Structure

```
RAG-a-Muffin/
├── frontend/                    # React frontend
│   ├── public/
│   │   └── architecture.html    # Interactive architecture diagram
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Top bar with status, export, links
│   │   │   │   └── MainLayout.jsx   # 3-column dashboard layout
│   │   │   ├── ui/
│   │   │   │   ├── GlassCard.jsx    # Glassmorphism card component
│   │   │   │   └── StatusDot.jsx    # Animated status indicator
│   │   │   ├── visuals/
│   │   │   │   └── NeuralCore.jsx   # AI core visualization
│   │   │   ├── ChatInterface.jsx    # Main chat with all 9 features
│   │   │   └── ErrorBoundary.jsx    # Error handling wrapper
│   │   ├── hooks/
│   │   │   └── useSystemMetrics.js  # Real backend metrics polling
│   │   ├── pages/
│   │   │   └── AdminPage.jsx        # Document management admin
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── store/
│   │   │   └── chatStore.js         # Zustand state (messages, sessions, feedback)
│   │   ├── index.css                # Global styles + Tailwind theme
│   │   └── App.jsx                  # Router setup
│   ├── .env.example                 # Frontend environment template
│   ├── vite.config.js               # Vite + Tailwind plugin config
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat.py              # POST /api/chat — RAG query endpoint
│   │   │   ├── documents.py         # Document CRUD endpoints
│   │   │   └── admin.py             # Admin dashboard & seed data
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── rag_pipeline.py      # Core RAG orchestrator
│   │   │   ├── gemini_service.py    # Google Gemini LLM with rate limiting
│   │   │   ├── chroma_service.py    # ChromaDB vector store
│   │   │   ├── memory_service.py    # In-memory conversation history
│   │   │   └── document_processor.py # PDF/text chunking
│   │   ├── utils/
│   │   │   └── prompts.py           # Prompt templates
│   │   ├── config.py                # App configuration
│   │   └── main.py                  # FastAPI app entry point
│   ├── .env.example                 # Backend environment template
│   ├── requirements.txt             # Python dependencies
│   └── render.yaml                  # Render deployment config
│
├── DEMO_SPEECH.md               # Demo presentation script
├── RAG-a-Muffin_Presentation.pptx  # PowerPoint presentation
└── README.md                    # This file
```

---

## 🚀 Getting Started — Local Setup

Follow these steps to run the project on your local machine.

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Python** | 3.11 or higher | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Google Gemini API Key** | Free | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

### Step 1: Clone the Repository

```bash
git clone https://github.com/yskhub/RAG-a-Muffin.git
cd RAG-a-Muffin
```

### Step 2: Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3: Configure Backend Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit the `.env` file and add your **Google Gemini API key**:

```env
# Get your FREE key from: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your_api_key_here

# ChromaDB (no changes needed — runs locally)
CHROMA_DB_PATH=./chroma_db

# App Settings
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> 💡 **Getting a Gemini API Key:**
> 1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
> 2. Click **"Create API Key"**
> 3. Copy the key and paste it in your `.env` file
> 4. No credit card required — it's completely free!

### Step 4: Start the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ Google Gemini 2.0 Flash initialized (FREE)
✅ FREE RAG Pipeline initialized!
```

> 📌 Keep this terminal running.  
> 📌 Verify by visiting: [http://localhost:8000](http://localhost:8000) — you should see `{"message": "FREE RAG API Ready", "cost": "$0.00"}`

### Step 5: Set Up the Frontend

Open a **new terminal** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

### Step 6: Configure Frontend Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file:

```env
# Point to your local backend
VITE_API_URL=http://localhost:8000/api
```

### Step 7: Start the Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### Step 8: Open the Application

1. Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**
2. You should see the **AI Operations Dashboard** with the dark theme
3. The header should show **🟢 Online** (meaning the backend is connected)

### Step 9: Seed the Knowledge Base

Before chatting, you need to add some data:

1. Click the **⚙ gear icon** in the header → opens Admin page
2. Click **"Initialize Sample Data"** to seed 3 sample documents:
   - Product listing (Bluetooth Headphones)
   - Return policy (30-day returns)
   - Shipping policy (Free over $50)
3. Go back to the main chat

### Step 10: Start Chatting!

Try these example questions:

```
"What headphones do you sell?"        → Retrieves products from Catalog
"What is your return policy?"         → Retrieves FAQ data
"Can I return those headphones?"      → Uses conversation MEMORY
"Do you sell laptops?"                → Honest "I don't know" response
```

---

## 🌐 Deploying to Production

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** → Import your repository
4. Set the **Root Directory** to `frontend`
5. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
6. Click **Deploy**

### Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - `GOOGLE_API_KEY` = your Gemini API key
6. Click **Create Web Service**

> ⚠️ **Note:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~60 seconds (cold start). The frontend handles this with a 120-second timeout and visual status indicators.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns API status |
| `GET` | `/api/health` | Detailed health with service statuses |
| `POST` | `/api/chat` | Send a message through the RAG pipeline |
| `GET` | `/api/stats` | Get pipeline statistics |
| `DELETE` | `/api/session/{id}` | Clear session history |
| `POST` | `/api/documents/upload` | Upload a PDF/text document |
| `GET` | `/api/documents/stats` | Document count and stats |
| `GET` | `/api/documents/sources` | List all document sources |
| `DELETE` | `/api/documents/source/{name}` | Delete a document |
| `DELETE` | `/api/documents/clear` | Clear all documents |
| `GET` | `/api/admin/dashboard` | Admin dashboard data |
| `POST` | `/api/admin/seed-sample-data` | Seed sample data |
| `POST` | `/api/admin/faqs/bulk` | Bulk upload FAQs |

### Example API Call

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What products do you have?", "session_id": "test-123"}'
```

Response:
```json
{
  "answer": "We have Wireless Bluetooth Headphones Pro for $79.99...",
  "sources": [
    {"source": "Catalog", "page": null, "relevance": 85.2}
  ],
  "session_id": "test-123"
}
```

---

## 🔧 Configuration

### Rate Limiting

The free Gemini API has limits. The backend handles this automatically:

| Setting | Value | Purpose |
|---------|-------|---------|
| Self-limit | 10 RPM | Stays under Google's 15 RPM limit |
| Min gap | 4 seconds | Between consecutive requests |
| Retry backoff | 15s → 30s → 60s | Exponential on rate-limit errors |
| Max retries | 4 | Before returning error to user |

### Environment Variables

#### Backend (`.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `CHROMA_DB_PATH` | No | `./chroma_db` | ChromaDB storage path |
| `ENVIRONMENT` | No | `development` | App environment |
| `ALLOWED_ORIGINS` | No | `*` | CORS allowed origins |

#### Frontend (`.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000/api` | Backend API URL |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Ctrl + K` | Clear chat (saves to history) |
| `Ctrl + E` | Export chat to clipboard |

---

## 🧪 Testing

### Test the Backend

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run the test script
python test_api.py
```

### Test the Frontend Build

```bash
cd frontend
npm run build
```

### Manual Testing Flow

1. Start both backend and frontend servers
2. Open `http://localhost:5173`
3. Wait for header to show **🟢 Online**
4. Go to Admin (⚙) → Click **"Initialize Sample Data"**
5. Return to chat → Ask: _"What headphones do you sell?"_
6. Verify: Response mentions headphones + shows source badge "Catalog"
7. Ask: _"What's the return policy?"_ → Should show "FAQ" source
8. Ask: _"Can I return those headphones?"_ → Should combine both contexts (memory test)

---

## ❓ Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **"Connection failed"** | Backend not running | Start backend with `uvicorn app.main:app --reload` |
| **Header shows 🔴 Offline** | Backend server is down | Check terminal for errors, restart backend |
| **"Rate-limited by Google"** | Too many requests in 1 minute | Wait 60 seconds, then try again |
| **No styles showing** | Tailwind not processing | Ensure `@tailwindcss/vite` is in `vite.config.js` |
| **"No context sources yet"** | Knowledge base empty | Go to Admin → Initialize Sample Data |
| **Backend takes 60s to respond** | Render free tier cold start | Normal — wait for it to wake up |
| **Python venv not activating** | Wrong activation command | Windows: `.\venv\Scripts\activate`, Mac: `source venv/bin/activate` |
| **npm install fails** | Node.js version too old | Update to Node.js 18+ |

---

## 📦 How RAG Pipeline Works (Technical)

```
User Query: "What headphones do you sell?"
         │
         ▼
┌─────────────────────────────┐
│  1. ChromaDB Vector Search  │  ← Finds top-5 matching document chunks
│     (Semantic Similarity)   │     using embedding distance
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  2. Context Assembly        │  ← Builds context string from relevant
│     (Relevance Filter >0.5) │     chunks with source metadata
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  3. Memory Injection        │  ← Adds last 5 messages from session
│     (Conversation History)  │     for contextual continuity
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  4. Prompt Construction     │  ← Combines: System prompt + Context
│     (Structured Template)   │     + History + User question
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  5. Gemini LLM Generation   │  ← Generates grounded response
│     (gemini-2.0-flash)      │     with anti-hallucination rules
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  6. Source Citation          │  ← Attaches source metadata + relevance
│     (Response Formatting)   │     scores for transparency
└─────────────────────────────┘
               │
               ▼
         AI Response: "We have Wireless Bluetooth Headphones Pro
                       for $79.99 with 30-hour battery life."
                       [Source: Catalog · 85.2%]
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[Google Gemini](https://ai.google.dev/)** — Free LLM API
- **[ChromaDB](https://www.trychroma.com/)** — Open-source vector database
- **[FastAPI](https://fastapi.tiangolo.com/)** — Modern Python web framework
- **[React](https://react.dev/)** — UI component library
- **[Vercel](https://vercel.com/)** — Frontend hosting
- **[Render](https://render.com/)** — Backend hosting

---

<p align="center">
  Built with ❤️ using 100% free-tier services<br/>
  <strong>Total cost: $0.00</strong>
</p>
