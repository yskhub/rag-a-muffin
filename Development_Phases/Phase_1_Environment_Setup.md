# Phase 1: Environment Setup & Foundation

> **Duration: 2 Days** | **Difficulty: Beginner** | **Cost: $0.00**

---

## 🎯 Phase Objectives

By the end of this phase, you will have:
- [x] GitHub repository initialized with proper structure
- [x] All FREE API keys obtained
- [x] Local development environment configured
- [x] Python backend environment ready
- [x] React frontend initialized
- [x] Supabase database tables created

---

## 📋 Day 1: Project Initialization

### Step 1.1: Create GitHub Repository

```bash
# 1. Create new repository on GitHub
# Name: ecommerce-rag-chatbot
# Description: AI-Powered E-commerce Chatbot with RAG (100% Free)
# Visibility: Public
# Initialize with README: No

# 2. Clone locally
git clone https://github.com/YOUR_USERNAME/ecommerce-rag-chatbot.git
cd ecommerce-rag-chatbot
```

### Step 1.2: Create Project Structure

```bash
# Create all directories
mkdir -p backend/app/api
mkdir -p backend/app/services
mkdir -p backend/app/models
mkdir -p backend/app/utils
mkdir -p backend/chroma_db
mkdir -p backend/sample_docs
mkdir -p frontend/src/components
mkdir -p frontend/src/services
mkdir -p frontend/src/store
mkdir -p docs/screenshots

# Create placeholder files
touch backend/app/__init__.py
touch backend/app/api/__init__.py
touch backend/app/services/__init__.py
touch backend/app/models/__init__.py
touch backend/app/utils/__init__.py
touch backend/chroma_db/.gitkeep
```

### Step 1.3: Create .gitignore

Create `/.gitignore`:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
.venv/
ENV/
env/
.env
*.env

# ChromaDB local storage
chroma_db/
!chroma_db/.gitkeep

# Node
node_modules/
dist/
.cache/
*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Build
build/
*.egg-info/
```

### Step 1.4: Obtain FREE API Keys

#### A) Google Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"**
5. Copy the key (starts with `AIza...`)

**Free Limits:**
- ✅ 15 requests/minute
- ✅ 1500 requests/day
- ✅ 1 million tokens/minute
- ❌ No credit card required

#### B) Supabase Project

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New Project"**
5. Fill in:
   - Organization: Create new or use existing
   - Project name: `ecommerce-chatbot`
   - Database Password: Generate strong password (save it!)
   - Region: Choose closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for provisioning
8. Go to **Settings → API**
9. Copy:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **anon/public key** (safe for frontend)

**Free Limits:**
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50MB file storage
- ❌ No credit card required

---

## 📋 Day 2: Development Environment Setup

### Step 2.1: Setup Python Backend

#### A) Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

#### B) Create requirements.txt

Create `backend/requirements.txt`:

```txt
# Core Framework
fastapi==0.109.0
uvicorn==0.27.0
python-multipart==0.0.6

# FREE AI Services
google-generativeai==0.3.2
langchain==0.1.6
langchain-google-genai==0.0.6

# FREE Vector Database
chromadb==0.4.22

# Embeddings (Runs locally - FREE)
sentence-transformers==2.3.1

# Database (FREE 500MB)
supabase==2.3.4

# Environment & Config
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0

# Document Processing
PyPDF2==3.0.1
python-docx==1.1.0

# CORS
starlette==0.35.1
```

#### C) Install Dependencies

```bash
# Make sure venv is activated
pip install -r requirements.txt
```

**Note:** First install takes ~5 minutes as sentence-transformers downloads models.

#### D) Create Environment File

Create `backend/.env.example`:

```bash
# ============================================
# FREE API KEYS - No Credit Card Required!
# ============================================

# Google Gemini API (FREE)
# Get from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=AIzaSy...

# Supabase (FREE - 500MB)
# Get from: https://supabase.com -> Settings -> API
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# ============================================
# ChromaDB Settings (Local - No API needed)
# ============================================
CHROMA_DB_PATH=./chroma_db

# ============================================
# App Settings
# ============================================
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Now create `.env` with your actual keys:

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### Step 2.2: Create Configuration Module

Create `backend/app/config.py`:

```python
"""
Configuration module for FREE E-commerce Chatbot
All services used are 100% FREE with no credit card required
"""

from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Google Gemini (FREE - 15 RPM)
    GOOGLE_API_KEY: str
    
    # Supabase (FREE - 500MB)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # ChromaDB (FREE - Local storage)
    CHROMA_DB_PATH: str = "./chroma_db"
    
    # Application
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Create settings instance
settings = get_settings()
```

### Step 2.3: Setup React Frontend

#### A) Create Vite + React App

```bash
cd ../frontend

# Create Vite app with React template
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install additional packages
npm install axios zustand react-router-dom
npm install -D tailwindcss postcss autoprefixer
```

#### B) Configure Tailwind CSS

```bash
# Initialize Tailwind
npx tailwindcss init -p
```

Update `frontend/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

Update `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

#### C) Create Frontend Environment

Create `frontend/.env.example`:

```bash
# Backend API URL
# Local: http://localhost:8000
# Production: https://your-app.onrender.com
VITE_API_URL=http://localhost:8000/api
```

Copy to `.env`:

```bash
cp .env.example .env
```

### Step 2.4: Setup Supabase Database

Go to your Supabase project dashboard → SQL Editor, and run:

```sql
-- ============================================
-- Database Schema for E-commerce RAG Chatbot
-- 100% FREE on Supabase (500MB limit)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Documents Table
-- Stores metadata about uploaded documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    file_url TEXT,
    file_type VARCHAR(50),
    chunk_count INTEGER DEFAULT 0,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Conversations Table
-- Tracks chat sessions
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Messages Table
-- Stores chat history
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FAQs Table
-- Pre-defined Q&A pairs
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_documents_created ON documents(created_at);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category) VALUES
('What is your return policy?', 'We offer a 30-day return policy for all unused items in original packaging.', 'Returns'),
('Do you offer free shipping?', 'Yes! We offer free shipping on all orders over $50.', 'Shipping'),
('How can I track my order?', 'Once your order ships, you will receive a tracking number via email.', 'Orders'),
('What payment methods do you accept?', 'We accept Visa, Mastercard, PayPal, and Apple Pay.', 'Payments'),
('How do I contact customer support?', 'You can reach us via chat, email at support@example.com, or call 1-800-EXAMPLE.', 'Support');
```

### Step 2.5: Verify Installation

#### Test Backend

Create `backend/app/main.py`:

```python
"""
FREE E-commerce Chatbot API
100% Free using Google Gemini + ChromaDB
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title="FREE E-commerce Chatbot API",
    description="100% Free RAG chatbot using Gemini + ChromaDB",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - API info"""
    return {
        "message": "FREE E-commerce Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "cost": "$0.00 💰"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "llm": "Google Gemini 1.5 Flash (FREE)",
            "vector_db": "ChromaDB (LOCAL)",
            "database": "Supabase (FREE)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Run the server:

```bash
cd backend
# Activate venv first
uvicorn app.main:app --reload
```

Visit http://localhost:8000 - you should see the API info JSON.

#### Test Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 - you should see the Vite + React default page.

---

## ✅ Phase 1 Completion Checklist

- [ ] GitHub repo created and cloned
- [ ] Project folder structure created
- [ ] .gitignore configured
- [ ] Google Gemini API key obtained (FREE)
- [ ] Supabase project created (FREE)
- [ ] Python virtual environment created
- [ ] Backend dependencies installed
- [ ] .env file configured with API keys
- [ ] React frontend initialized with Vite
- [ ] Tailwind CSS configured
- [ ] Supabase database tables created
- [ ] Backend server running at localhost:8000
- [ ] Frontend running at localhost:5173

---

## 🔄 Git Commit

```bash
git add .
git commit -m "Phase 1: Environment setup and project foundation complete"
git push origin main
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "sentence-transformers installation fails"
```bash
# Solution: Install with specific torch version
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu
pip install sentence-transformers
```

### Issue 2: "ChromaDB SQLite error"
```bash
# Solution: Upgrade pysqlite3
pip install pysqlite3-binary
```

### Issue 3: "CORS error in browser"
```python
# Ensure ALLOWED_ORIGINS includes your frontend URL
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📚 Next Phase

Continue to **[Phase 2: Backend Development](./Phase_2_Backend_Development.md)** where we'll implement:
- Gemini service for LLM responses
- ChromaDB service for vector storage
- Document processing utilities
- Memory service for conversation history

---

**Phase 1 Complete! 🎉**
