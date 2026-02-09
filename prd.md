OnlyAI Academy – Capstone Project (LLMs & RAG Systems)
Assignment Category: Custom AI-Based Full-Stack Application Domain: Large Language Models (LLMs) & Retrieval-Augmented Generation (RAG)
📌 General Project Guidelines
Students must adhere to the following mandatory requirements:
● Selection of any one project from the options below.
● Mandatory use of GitHub for version control with meaningful commits.
● Final submission must include:
○ Public GitHub Repository URL
○ Deployed Application URL
○ Demo Video (Loom or tella.tv)
○ Proper README.md documentation
● Deployment using approved platforms:
○ Frontend: Vercel / Netlify
○ Backend & Database: Supabase / Firebase
All projects must demonstrate real-world applicability, backend integration, and AI-driven functionality.
✅ Project 1: Contextual Website Chatbot Using RAG
Project Title
AI-Powered Contextual Website Chatbot with Memory
Description
Develop an intelligent chatbot integrated into a website (e-commerce or educational platform) that uses Retrieval-Augmented Generation (RAG) to provide accurate, personalized, and context-aware responses. The chatbot should retrieve information from internal documents, FAQs, and databases, while maintaining conversational memory.
Core Features
● Website-integrated chat interface
● Document and FAQ ingestion
● Vector-based semantic search
● Conversational memory management
● Context-aware response generation
● Admin panel for document upload
Key Technologies / Tools
● Pinecone (Vector Store)
● Hugging Face Embeddings
● OpenAI / LLM APIs
● Streamlit / Gradio (UI)
● Supabase / Firebase (Backend)
Difficulty Level
Intermediate
Example Use Case
Customer support chatbot for an online store that answers product-related queries using internal documents and live inventory data.
Source / Inspiration
GitHub: umbertogriffo/rag-chatbot

Complete Project Blueprint: AI-Powered Contextual Website Chatbot with RAG
📋 Table of Contents

Project Overview
System Architecture
Technology Stack
Database Schema
RAG Pipeline Design
Implementation Plan
Code Structure
Sample Code
Deployment Strategy
README Template


🎯 Project Overview
What We're Building
An intelligent e-commerce chatbot that answers customer queries using:

Product catalogs (uploaded documents)
FAQs (knowledge base)
Order history (user-specific data)
Conversational memory (maintains context across messages)

Real-World Application
Imagine a customer asking: "I bought running shoes last month. Do you have matching socks?"
The chatbot will:

Remember the previous purchase (conversation memory)
Retrieve relevant product information (RAG)
Suggest matching accessories (contextual recommendations)


🏗️ System Architecture
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React.js + Tailwind CSS - Deployed on Vercel)            │
│  - Chat Interface                                           │
│  - Admin Dashboard (Document Upload)                        │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND API                           │
│     (FastAPI - Deployed on Railway/Render)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Chat       │  │   Document   │  │    Admin     │     │
│  │  Endpoint    │  │   Ingestion  │  │   Routes     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │  1. Query Embedding (Hugging Face)               │      │
│  │  2. Vector Search (Pinecone)                     │      │
│  │  3. Context Retrieval                            │      │
│  │  4. Prompt Construction                          │      │
│  │  5. LLM Response (OpenAI GPT-4)                  │      │
│  └──────────────────────────────────────────────────┘      │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pinecone   │  │   Supabase   │  │    Redis     │     │
│  │   (Vectors)  │  │  (Metadata)  │  │   (Memory)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

🛠️ Technology Stack
Frontend

Framework: React.js (with Vite)
Styling: Tailwind CSS
State Management: Zustand
HTTP Client: Axios
Deployment: Vercel

Backend

Framework: FastAPI (Python 3.11+)
API Documentation: Auto-generated with Swagger UI
Deployment: Railway / Render

AI & RAG Pipeline

LLM: OpenAI GPT-4 / GPT-3.5-turbo
Embeddings: Hugging Face sentence-transformers/all-MiniLM-L6-v2
Vector Database: Pinecone (free tier)
Document Processing: LangChain + PyPDF2

Database & Storage

Metadata Storage: Supabase (PostgreSQL)
Conversational Memory: Redis (Upstash - serverless)
File Storage: Supabase Storage (for uploaded documents)

DevOps

Version Control: GitHub
Environment Management: python-dotenv
API Testing: Postman / Thunder Client


🗄️ Database Schema
Supabase Tables
1. documents
sqlCREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    pinecone_namespace VARCHAR(100),
    chunk_count INTEGER,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
2. conversations
sqlCREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW()
);
3. messages
sqlCREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    sources JSONB, -- Retrieved document chunks
    created_at TIMESTAMP DEFAULT NOW()
);
4. faqs
sqlCREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    pinecone_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
Pinecone Index Structure
python# Index Name: ecommerce-chatbot
# Dimensions: 384 (for all-MiniLM-L6-v2)
# Metric: cosine

# Metadata structure:
{
    "text": "Product description...",
    "source": "product_catalog.pdf",
    "page": 5,
    "category": "electronics",
    "doc_id": "uuid-here"
}

🔄 RAG Pipeline Design
Step-by-Step Flow
python# 1. USER QUERY
user_query = "Do you have waterproof bluetooth speakers?"

# 2. QUERY EMBEDDING
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
query_embedding = model.encode(user_query)

# 3. VECTOR SEARCH (Pinecone)
results = pinecone_index.query(
    vector=query_embedding.tolist(),
    top_k=5,
    include_metadata=True
)

# 4. CONTEXT RETRIEVAL
context = "\n\n".join([match['metadata']['text'] for match in results['matches']])

# 5. RETRIEVE CONVERSATION HISTORY (Redis)
conversation_history = redis_client.lrange(f"session:{session_id}", -5, -1)

# 6. PROMPT CONSTRUCTION
prompt = f"""
You are a helpful e-commerce assistant. Use the following context to answer the question.

Context:
{context}

Conversation History:
{conversation_history}

Question: {user_query}

Answer:
"""

# 7. LLM RESPONSE
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}]
)

# 8. SAVE TO MEMORY
redis_client.rpush(f"session:{session_id}", f"User: {user_query}")
redis_client.rpush(f"session:{session_id}", f"Assistant: {response}")
```

---

## 📅 Implementation Plan (4-Week Milestone)

### **Week 1: Foundation & Document Ingestion**
**Days 1-2: Project Setup**
- [ ] Initialize GitHub repository with proper `.gitignore`
- [ ] Set up FastAPI backend structure
- [ ] Create React frontend with Vite
- [ ] Configure environment variables (`.env` files)
- [ ] Set up Supabase project and create tables

**Days 3-4: Document Processing Pipeline**
- [ ] Implement PDF/DOCX text extraction
- [ ] Create text chunking logic (1000 tokens, 200 overlap)
- [ ] Set up Hugging Face embedding model
- [ ] Initialize Pinecone index

**Days 5-7: Admin Dashboard**
- [ ] Build document upload UI (React)
- [ ] Create FastAPI endpoint for file upload
- [ ] Implement document ingestion to Pinecone
- [ ] Add progress tracking for large files
- [ ] **Milestone 1 Commit**: "Document ingestion pipeline complete"

---

### **Week 2: RAG Pipeline & Chat Interface**
**Days 8-10: Core RAG Implementation**
- [ ] Build query embedding function
- [ ] Implement vector similarity search
- [ ] Create prompt engineering templates
- [ ] Integrate OpenAI API
- [ ] Add source citation to responses

**Days 11-12: Chat UI Development**
- [ ] Design chat interface (Tailwind CSS)
- [ ] Implement real-time message streaming
- [ ] Add typing indicators
- [ ] Display source documents

**Days 13-14: Testing & Refinement**
- [ ] Test with various query types
- [ ] Optimize chunk retrieval (top_k tuning)
- [ ] Handle edge cases (no results, ambiguous queries)
- [ ] **Milestone 2 Commit**: "RAG pipeline and chat interface functional"

---

### **Week 3: Memory & Advanced Features**
**Days 15-17: Conversational Memory**
- [ ] Set up Redis (Upstash)
- [ ] Implement session management
- [ ] Add conversation history to prompts
- [ ] Create memory summarization (for long conversations)

**Days 18-19: FAQ Integration**
- [ ] Populate FAQs table
- [ ] Embed FAQs in Pinecone
- [ ] Implement hybrid search (FAQs + documents)

**Days 20-21: Admin Analytics**
- [ ] Track query patterns (Supabase)
- [ ] Create usage dashboard
- [ ] Add feedback mechanism (thumbs up/down)
- [ ] **Milestone 3 Commit**: "Memory and analytics complete"

---

### **Week 4: Deployment & Documentation**
**Days 22-24: Deployment**
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Configure CORS and environment variables
- [ ] Set up CI/CD with GitHub Actions

**Days 25-26: Documentation**
- [ ] Write comprehensive README.md
- [ ] Create architecture diagrams (draw.io)
- [ ] Document API endpoints (Swagger)
- [ ] Add setup instructions

**Day 27: Demo Video**
- [ ] Record 7-10 min demo (Loom)
- [ ] Show document upload
- [ ] Demonstrate chat queries
- [ ] Explain architecture

**Day 28: Final Review**
- [ ] Test all features end-to-end
- [ ] Fix bugs
- [ ] **Final Commit**: "Production ready - v1.0"

---

## 📁 Code Structure
```
ecommerce-chatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app
│   │   ├── config.py               # Environment config
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py            # Chat endpoints
│   │   │   ├── documents.py       # Document management
│   │   │   └── admin.py           # Admin routes
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── embeddings.py      # Hugging Face embeddings
│   │   │   ├── rag_pipeline.py    # Core RAG logic
│   │   │   ├── pinecone_service.py
│   │   │   └── memory_service.py  # Redis operations
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py         # Pydantic models
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── document_processor.py
│   │       └── prompts.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── DocumentUpload.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios config
│   │   ├── store/
│   │   │   └── chatStore.js       # Zustand state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── docs/
│   ├── architecture.png
│   ├── rag_pipeline.png
│   └── demo_screenshots/
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD
│
├── README.md
├── .gitignore
└── LICENSE

💻 Sample Code
Backend: RAG Pipeline (services/rag_pipeline.py)
pythonfrom sentence_transformers import SentenceTransformer
import pinecone
import openai
from app.config import settings
from app.services.memory_service import MemoryService

class RAGPipeline:
    def __init__(self):
        # Initialize embedding model
        self.embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        # Initialize Pinecone
        pinecone.init(
            api_key=settings.PINECONE_API_KEY,
            environment=settings.PINECONE_ENV
        )
        self.index = pinecone.Index(settings.PINECONE_INDEX)
        
        # Initialize OpenAI
        openai.api_key = settings.OPENAI_API_KEY
        
        # Initialize memory service
        self.memory = MemoryService()
    
    async def process_query(self, query: str, session_id: str) -> dict:
        """
        Main RAG pipeline function
        """
        # Step 1: Embed query
        query_embedding = self.embedder.encode(query).tolist()
        
        # Step 2: Vector search
        search_results = self.index.query(
            vector=query_embedding,
            top_k=5,
            include_metadata=True
        )
        
        # Step 3: Extract context
        context = self._build_context(search_results)
        
        # Step 4: Get conversation history
        history = await self.memory.get_history(session_id, limit=5)
        
        # Step 5: Construct prompt
        prompt = self._build_prompt(query, context, history)
        
        # Step 6: Get LLM response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful e-commerce assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content
        
        # Step 7: Save to memory
        await self.memory.add_message(session_id, "user", query)
        await self.memory.add_message(session_id, "assistant", answer)
        
        # Step 8: Return structured response
        return {
            "answer": answer,
            "sources": [match['metadata'] for match in search_results['matches']],
            "session_id": session_id
        }
    
    def _build_context(self, search_results) -> str:
        """Extract and format context from vector search results"""
        contexts = []
        for match in search_results['matches']:
            text = match['metadata']['text']
            source = match['metadata'].get('source', 'Unknown')
            contexts.append(f"[Source: {source}]\n{text}")
        return "\n\n---\n\n".join(contexts)
    
    def _build_prompt(self, query: str, context: str, history: list) -> str:
        """Construct the final prompt with context and history"""
        history_text = "\n".join([
            f"{msg['role'].capitalize()}: {msg['content']}" 
            for msg in history
        ])
        
        return f"""Use the following context to answer the customer's question. 
If the answer isn't in the context, say so politely and suggest alternatives.

CONTEXT:
{context}

CONVERSATION HISTORY:
{history_text}

CUSTOMER QUESTION: {query}

ANSWER (be concise and helpful):"""

Backend: Chat Endpoint (api/chat.py)
pythonfrom fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_pipeline import RAGPipeline
import uuid

router = APIRouter()
rag = RAGPipeline()

class ChatRequest(BaseModel):
    message: str
    session_id: str = None

class ChatResponse(BaseModel):
    answer: str
    sources: list
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process user query through RAG pipeline
    """
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Process through RAG pipeline
        result = await rag.process_query(request.message, session_id)
        
        return ChatResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

Frontend: Chat Interface (components/ChatInterface.jsx)
jsximport React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate session ID on mount
    setSessionId(crypto.randomUUID());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: input,
        session_id: sessionId
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">E-Commerce Assistant</h1>
        <p className="text-sm opacity-90">Ask me anything about our products!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-100">●</div>
            <div className="animate-bounce delay-200">●</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

🚀 Deployment Strategy
Backend Deployment (Railway)

Create railway.toml:

toml[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"
```

2. **Environment Variables:**
```
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENV=us-east-1-aws
SUPABASE_URL=https://...
SUPABASE_KEY=...
REDIS_URL=redis://...
Frontend Deployment (Vercel)

vercel.json:

json{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

2. **Environment Variables:**
```
VITE_API_URL=https://your-backend.railway.app

📄 README Template
markdown# 🤖 AI-Powered E-Commerce Chatbot with RAG

An intelligent customer support chatbot that uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware responses based on product catalogs, FAQs, and conversational memory.

![Demo](docs/demo.gif)

## 🌟 Features

- ✅ **Semantic Search**: Vector-based retrieval using Pinecone
- ✅ **Conversational Memory**: Remembers chat history via Redis
- ✅ **Document Ingestion**: Admin panel to upload product catalogs
- ✅ **Source Citations**: Shows where information came from
- ✅ **Real-time Chat**: Smooth, responsive interface

## 🏗️ Architecture

![Architecture](docs/architecture.png)

### Tech Stack

**Frontend**
- React.js + Vite
- Tailwind CSS
- Axios

**Backend**
- FastAPI (Python)
- OpenAI GPT-3.5-turbo
- Hugging Face Embeddings

**Databases**
- Pinecone (Vector Store)
- Supabase (Metadata)
- Redis (Session Memory)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API Key
- Pinecone Account
- Supabase Project

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-chatbot.git
cd ecommerce-chatbot/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Add VITE_API_URL
```

3. Start development server:
```bash
npm run dev
```

## 🚀 Deployment

**Backend**: Deployed on [Railway](https://railway.app)  
**Frontend**: Deployed on [Vercel](https://vercel.com)

Live Demo: [https://your-app.vercel.app](https://your-app.vercel.app)

## 📹 Demo Video

Watch the full demo: [Loom Video](https://loom.com/share/...)

## 🧪 Testing
```bash
# Backend tests
pytest

# Frontend tests
npm run test
```

## 📊 Usage Examples

**Example 1**: Product Query
```
User: "Do you have wireless headphones under $100?"
Bot: "Yes! Based on our catalog, we have 3 options:
1. SoundMax Pro - $79.99
2. BeatsBuddy - $89.99
..."
```

**Example 2**: Follow-up Question
```
User: "Which one has the best battery life?"
Bot: "From your previous options, the SoundMax Pro offers 
30 hours of playtime, which is the longest..."
```

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md)

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 👨‍💻 Author

**Your Name**  
[GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- OnlyAI Academy for project guidance
- [umbertogriffo/rag-chatbot](https://github.com/umbertogriffo/rag-chatbot) for inspiration

🎯 Viva/Demo Preparation
Key Points to Explain

Why RAG over Fine-tuning?

Dynamic knowledge updates without retraining
Cost-effective for domain-specific data
Reduces hallucinations


How Vector Search Works

Text → Embeddings (384-dim vectors)
Cosine similarity matching
Top-K retrieval


Memory Management

Redis stores last 10 messages per session
Summarization for long conversations
Session expiry (24 hours)


Challenges Faced

Chunk size optimization (tested 500, 1000, 1500 tokens)
Handling contradictory information in documents
Rate limiting on OpenAI API



Demo Flow (7 minutes)

[0:00-1:00] Project overview + architecture
[1:00-2:30] Admin: Upload product catalog PDF
[2:30-5:00] Chat demo: 3-4 queries showing memory
[5:00-6:00] Show source citations + Pinecone dashboard
[6:00-7:00] Code walkthrough (RAG pipeline)


✅ Final Checklist

 GitHub repo public with 20+ meaningful commits
 README.md with all sections
 Architecture diagram (PNG)
 Frontend deployed (Vercel URL)
 Backend deployed (Railway URL)
 Demo video uploaded (Loom)
 All environment variables documented
 Code commented and clean
 Sample documents included in repo


Ready to build? Start with Week 1, Day 1 and commit daily! 🚀i need to do the above project completely free of cost without spedning any money without any paid limits show me detailed planFeb 7🆓 100% FREE AI Chatbot Project - Complete Blueprint (Zero Cost)
💰 Cost Breakdown Analysis
❌ What We're Replacing (Paid Services)
ServiceOriginalCostFree AlternativeOpenAI APIGPT-3.5$0.002/1K tokensGoogle Gemini (Free)PineconeVector DB$70/monthChromaDB (Local/Free)RedisMemory$10/monthIn-Memory Dict (Free)RailwayBackend Host$5/monthRender (Free tier)
✅ What Stays Free

Frontend: Vercel (Free forever)
Database: Supabase (500MB free)
Embeddings: Hugging Face (Free)
GitHub: Free
Demo Video: Loom (Free 5min limit - we'll use OBS)


🎯 New Tech Stack (100% Free)
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (FREE)                       │
│  React + Vite + Tailwind CSS                            │
│  Deployed on: Vercel (Free Forever)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FREE)                          │
│  FastAPI + Python 3.11                                  │
│  Deployed on: Render (Free tier - 750hrs/month)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AI & RAG PIPELINE (FREE)                    │
│  ✅ Google Gemini 1.5 Flash (Free 15 RPM)               │
│  ✅ ChromaDB (Local Vector Store - Free)                │
│  ✅ Sentence Transformers (Free Embeddings)             │
│  ✅ LangChain (Free Framework)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                DATA LAYER (FREE)                         │
│  ✅ ChromaDB - Persistent Local Storage                 │
│  ✅ Supabase - PostgreSQL (500MB free)                  │
│  ✅ Python Dict - In-memory session storage             │
└─────────────────────────────────────────────────────────┘

🔑 Free API Keys Setup
1. Google Gemini API (Replaces OpenAI)
Why: 15 requests/minute FREE (60x more than OpenAI free tier)
Setup:
bash# Go to: https://makersuite.google.com/app/apikey
# Click "Create API Key"
# Copy the key (starts with "AIza...")

# Free limits:
# ✅ 15 RPM (requests per minute)
# ✅ 1500 RPD (requests per day)
# ✅ 1 million tokens per minute
2. Hugging Face (Free Embeddings)
Why: Unlimited local model usage
Setup:
bash# Go to: https://huggingface.co/settings/tokens
# Create a "Read" token (optional, for model downloads)

# Free models we'll use:
# ✅ sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
# ✅ Runs locally - no API calls needed
3. Supabase (Free Database)
Why: 500MB storage + 2GB bandwidth/month FREE
Setup:
bash# Go to: https://supabase.com
# Create new project
# Copy:
#   - SUPABASE_URL (from Settings > API)
#   - SUPABASE_ANON_KEY (from Settings > API)

# Free limits:
# ✅ 500MB database
# ✅ 2GB bandwidth
# ✅ 50MB file storage
# ✅ No credit card required
```

---

## 📁 Updated Project Structure
```
ecommerce-chatbot-free/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── gemini_service.py      # NEW: Google Gemini
│   │   │   ├── chroma_service.py      # NEW: ChromaDB
│   │   │   ├── embeddings.py
│   │   │   ├── rag_pipeline.py
│   │   │   └── memory_service.py      # In-memory dict
│   │   ├── models/
│   │   │   └── schemas.py
│   │   └── utils/
│   │       ├── document_processor.py
│   │       └── prompts.py
│   ├── chroma_db/                     # NEW: Local vector DB
│   │   └── .gitkeep
│   ├── requirements.txt
│   ├── .env.example
│   └── render.yaml                    # NEW: Render config
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
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
│
├── docs/
│   ├── architecture.png
│   └── screenshots/
│
├── README.md
└── .gitignore

💻 Complete FREE Code Implementation
1. Backend Setup - requirements.txt
txt# Core Framework
fastapi==0.109.0
uvicorn==0.27.0
python-multipart==0.0.6

# FREE AI Services
google-generativeai==0.3.2      # Google Gemini (FREE)
langchain==0.1.6
langchain-google-genai==0.0.6

# FREE Vector Database
chromadb==0.4.22                # Local vector store (FREE)

# Embeddings (Run locally - FREE)
sentence-transformers==2.3.1

# Database
supabase==2.3.4                 # FREE 500MB
python-dotenv==1.0.0

# Document Processing
PyPDF2==3.0.1
python-docx==1.1.0
beautifulsoup4==4.12.3

# Utilities
pydantic==2.5.3
pydantic-settings==2.1.0

2. Environment Variables - .env.example
bash# Google Gemini API (FREE - get from https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=AIzaSy...

# Supabase (FREE - get from https://supabase.com)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# ChromaDB Settings (Local - no API needed)
CHROMA_DB_PATH=./chroma_db

# App Settings
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app

3. ChromaDB Service - services/chroma_service.py
pythonimport chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import os

class ChromaDBService:
    """
    FREE Vector Database using ChromaDB (local storage)
    No API limits, completely free!
    """
    def __init__(self):
        # Initialize ChromaDB with persistent storage
        chroma_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
        
        self.client = chromadb.PersistentClient(
            path=chroma_path,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="ecommerce_docs",
            metadata={"description": "E-commerce product documents"}
        )
        
        # Initialize FREE embedding model (runs locally)
        print("Loading embedding model...")
        self.embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print("✅ Embedding model loaded (100% FREE)")
    
    def add_documents(self, texts: List[str], metadatas: List[Dict], ids: List[str]):
        """
        Add documents to ChromaDB
        """
        # Generate embeddings locally (FREE)
        embeddings = self.embedder.encode(texts).tolist()
        
        # Store in ChromaDB
        self.collection.add(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"✅ Added {len(texts)} documents to ChromaDB")
    
    def search(self, query: str, top_k: int = 5) -> Dict:
        """
        Semantic search in ChromaDB
        """
        # Embed query locally (FREE)
        query_embedding = self.embedder.encode([query]).tolist()
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        return results
    
    def delete_all(self):
        """
        Clear the database (useful for testing)
        """
        self.client.delete_collection("ecommerce_docs")
        self.collection = self.client.create_collection("ecommerce_docs")
        print("✅ Database cleared")
    
    def get_stats(self) -> Dict:
        """
        Get database statistics
        """
        count = self.collection.count()
        return {
            "total_documents": count,
            "collection_name": "ecommerce_docs",
            "storage_type": "local_persistent"
        }

4. Google Gemini Service - services/gemini_service.py
pythonimport google.generativeai as genai
import os
from typing import List, Dict

class GeminiService:
    """
    FREE Google Gemini API Service
    Limits: 15 requests/min, 1500 requests/day (100% FREE)
    """
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        
        genai.configure(api_key=api_key)
        
        # Use Gemini 1.5 Flash (fastest free model)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        print("✅ Google Gemini initialized (100% FREE - 15 RPM)")
    
    def generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            print(f"❌ Gemini API Error: {e}")
            # Fallback to basic response
            return "I apologize, but I'm experiencing technical difficulties. Please try again."
    
    def generate_with_context(
        self, 
        query: str, 
        context: str, 
        conversation_history: List[Dict] = None
    ) -> str:
        """
        Generate contextual response (RAG-style)
        """
        # Build prompt
        history_text = ""
        if conversation_history:
            history_text = "\n".join([
                f"{msg['role'].capitalize()}: {msg['content']}" 
                for msg in conversation_history[-5:]  # Last 5 messages
            ])
        
        prompt = f"""You are a helpful e-commerce customer support assistant.
Use the following product information to answer the customer's question accurately.

PRODUCT INFORMATION:
{context}

CONVERSATION HISTORY:
{history_text}

CUSTOMER QUESTION: {query}

INSTRUCTIONS:
- Answer based ONLY on the provided product information
- If the answer isn't in the context, say "I don't have that information"
- Be concise and helpful
- Don't make up information

ANSWER:"""

        return self.generate_response(prompt)

5. RAG Pipeline (FREE Version) - services/rag_pipeline.py
pythonfrom app.services.chroma_service import ChromaDBService
from app.services.gemini_service import GeminiService
from app.services.memory_service import MemoryService
from typing import Dict, List

class FreeRAGPipeline:
    """
    100% FREE RAG Pipeline using:
    - ChromaDB (local vector store)
    - Google Gemini (free LLM)
    - In-memory session storage
    """
    def __init__(self):
        self.chroma = ChromaDBService()
        self.gemini = GeminiService()
        self.memory = MemoryService()
        
        print("✅ FREE RAG Pipeline initialized!")
    
    async def process_query(self, query: str, session_id: str) -> Dict:
        """
        Main RAG pipeline - completely free!
        """
        # Step 1: Search ChromaDB (FREE local search)
        search_results = self.chroma.search(query, top_k=5)
        
        # Step 2: Build context from results
        context = self._build_context(search_results)
        
        # Step 3: Get conversation history (in-memory)
        history = self.memory.get_history(session_id)
        
        # Step 4: Generate response with Gemini (FREE)
        answer = self.gemini.generate_with_context(
            query=query,
            context=context,
            conversation_history=history
        )
        
        # Step 5: Save to memory
        self.memory.add_message(session_id, "user", query)
        self.memory.add_message(session_id, "assistant", answer)
        
        # Step 6: Return structured response
        return {
            "answer": answer,
            "sources": self._format_sources(search_results),
            "session_id": session_id
        }
    
    def _build_context(self, search_results: Dict) -> str:
        """
        Extract context from ChromaDB results
        """
        if not search_results['documents'][0]:
            return "No relevant product information found."
        
        contexts = []
        for doc, metadata in zip(
            search_results['documents'][0], 
            search_results['metadatas'][0]
        ):
            source = metadata.get('source', 'Unknown')
            contexts.append(f"[Source: {source}]\n{doc}")
        
        return "\n\n---\n\n".join(contexts)
    
    def _format_sources(self, search_results: Dict) -> List[Dict]:
        """
        Format sources for frontend display
        """
        sources = []
        for metadata, distance in zip(
            search_results['metadatas'][0],
            search_results['distances'][0]
        ):
            sources.append({
                "source": metadata.get('source', 'Unknown'),
                "page": metadata.get('page'),
                "relevance": round((1 - distance) * 100, 2)  # Convert distance to %
            })
        return sources

6. In-Memory Session Storage - services/memory_service.py
pythonfrom typing import Dict, List
from datetime import datetime, timedelta
from collections import defaultdict

class MemoryService:
    """
    FREE in-memory conversation storage
    No Redis needed - uses Python dict
    """
    def __init__(self):
        # Store conversations in memory
        self.conversations: Dict[str, List[Dict]] = defaultdict(list)
        self.last_activity: Dict[str, datetime] = {}
        
        # Auto-cleanup after 1 hour of inactivity
        self.TIMEOUT_MINUTES = 60
    
    def add_message(self, session_id: str, role: str, content: str):
        """
        Add message to conversation history
        """
        self.conversations[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update last activity
        self.last_activity[session_id] = datetime.now()
        
        # Keep only last 20 messages (memory optimization)
        if len(self.conversations[session_id]) > 20:
            self.conversations[session_id] = self.conversations[session_id][-20:]
    
    def get_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        """
        Get conversation history
        """
        # Clean up old sessions
        self._cleanup_old_sessions()
        
        messages = self.conversations.get(session_id, [])
        return messages[-limit:] if messages else []
    
    def clear_session(self, session_id: str):
        """
        Clear specific session
        """
        if session_id in self.conversations:
            del self.conversations[session_id]
        if session_id in self.last_activity:
            del self.last_activity[session_id]
    
    def _cleanup_old_sessions(self):
        """
        Remove sessions inactive for > 1 hour
        """
        now = datetime.now()
        timeout = timedelta(minutes=self.TIMEOUT_MINUTES)
        
        expired_sessions = [
            session_id for session_id, last_time in self.last_activity.items()
            if now - last_time > timeout
        ]
        
        for session_id in expired_sessions:
            self.clear_session(session_id)
    
    def get_stats(self) -> Dict:
        """
        Get memory statistics
        """
        return {
            "active_sessions": len(self.conversations),
            "total_messages": sum(len(msgs) for msgs in self.conversations.values())
        }

7. Document Upload Endpoint - api/documents.py
pythonfrom fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.chroma_service import ChromaDBService
import PyPDF2
import io
import uuid
from typing import List

router = APIRouter()
chroma = ChromaDBService()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and process PDF document (FREE)
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(400, "Only PDF files supported")
        
        # Read PDF
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        # Extract text from all pages
        texts = []
        metadatas = []
        ids = []
        
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            
            # Split into chunks (1000 chars each)
            chunks = [text[i:i+1000] for i in range(0, len(text), 800)]
            
            for chunk_idx, chunk in enumerate(chunks):
                texts.append(chunk)
                metadatas.append({
                    "source": file.filename,
                    "page": page_num + 1,
                    "chunk": chunk_idx
                })
                ids.append(f"{file.filename}_p{page_num}_c{chunk_idx}_{uuid.uuid4()}")
        
        # Add to ChromaDB (FREE local storage)
        chroma.add_documents(texts, metadatas, ids)
        
        return {
            "message": "Document uploaded successfully",
            "filename": file.filename,
            "pages": len(pdf_reader.pages),
            "chunks": len(texts)
        }
    
    except Exception as e:
        raise HTTPException(500, f"Upload failed: {str(e)}")

@router.get("/stats")
async def get_stats():
    """
    Get database statistics
    """
    return chroma.get_stats()

@router.delete("/clear")
async def clear_database():
    """
    Clear all documents (for testing)
    """
    chroma.delete_all()
    return {"message": "Database cleared"}

8. Chat Endpoint - api/chat.py
pythonfrom fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_pipeline import FreeRAGPipeline
import uuid

router = APIRouter()
rag = FreeRAGPipeline()

class ChatRequest(BaseModel):
    message: str
    session_id: str = None

class ChatResponse(BaseModel):
    answer: str
    sources: list
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    FREE Chat endpoint using Gemini + ChromaDB
    """
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Process through FREE RAG pipeline
        result = await rag.process_query(request.message, session_id)
        
        return ChatResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "FREE E-commerce Chatbot",
        "llm": "Google Gemini 1.5 Flash",
        "vector_db": "ChromaDB (Local)"
    }

9. Main App - main.py
pythonfrom fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, documents
from app.config import settings
import os

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

# Include routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])

@app.get("/")
async def root():
    return {
        "message": "FREE E-commerce Chatbot API",
        "docs": "/docs",
        "cost": "$0.00 💰"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

🚀 FREE Deployment Guide
Backend: Render.com (FREE Tier)
1. Create render.yaml:
yamlservices:
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
    plan: free  # ✅ 750 hours/month FREE
2. Deploy Steps:
bash# 1. Push code to GitHub
git add .
git commit -m "Initial commit - FREE version"
git push origin main

# 2. Go to https://render.com
# 3. Click "New +" → "Web Service"
# 4. Connect GitHub repo
# 5. Render auto-detects render.yaml
# 6. Add environment variables
# 7. Click "Create Web Service"

# ✅ Your API will be live at: https://your-app.onrender.com
Free Tier Limits:

✅ 750 hours/month (enough for 24/7 uptime)
✅ 512MB RAM
✅ Sleeps after 15min inactivity (wakes on request)
✅ No credit card required


Frontend: Vercel (FREE Forever)
1. Create vercel.json:
json{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
2. Deploy Steps:
bash# 1. Install Vercel CLI (optional)
npm install -g vercel

# 2. Deploy from GitHub (recommended)
# - Go to https://vercel.com
# - Click "Import Project"
# - Connect GitHub repo
# - Select "frontend" folder as root
# - Add environment variable:
#   VITE_API_URL = https://your-app.onrender.com

# 3. Click "Deploy"

# ✅ Live at: https://your-app.vercel.app

📊 FREE Tier Limits Summary
ServiceFree LimitEnough For Project?Google Gemini15 RPM, 1500 RPD✅ Yes (60 users/hour)ChromaDBUnlimited (local)✅ Yes (limited by storage)Supabase500MB database✅ Yes (thousands of docs)Render750 hrs/month✅ Yes (24/7 uptime)VercelUnlimited✅ Yes (100GB bandwidth)Hugging FaceUnlimited (local)✅ Yes (runs on server)

🎥 FREE Demo Video Recording
Option 1: OBS Studio (Recommended)
bash# Download: https://obsproject.com/
# FREE, unlimited recording, no watermark

Steps:
1. Open OBS Studio
2. Add "Display Capture" source
3. Click "Start Recording"
4. Record 7-10 min demo
5. Click "Stop Recording"
6. Upload to YouTube (unlisted)
Option 2: Loom (5 min limit workaround)
bash# Split into 2 videos:
# Video 1 (5 min): Architecture + Document Upload
# Video 2 (5 min): Chat Demo + Code Walkthrough

# Combine using free editor:
# https://www.kapwing.com/ (free tier)

⚠️ Important FREE Tier Considerations
1. ChromaDB Persistence on Render
Render's free tier has ephemeral storage (resets on deploy). Solution:
python# Option A: Use Supabase for vector storage (requires custom implementation)
# Option B: Re-upload documents after each deployment
# Option C: Store chroma_db in GitHub (for small datasets)

# Recommended: Add sample documents to repo
backend/
├── sample_docs/
│   ├── product_catalog.pdf
│   └── faqs.pdf
└── init_db.py  # Script to auto-populate on startup
init_db.py:
pythonimport os
from app.services.chroma_service import ChromaDBService

def initialize_database():
    """
    Auto-populate ChromaDB with sample documents on startup
    """
    chroma = ChromaDBService()
    
    # Check if DB is empty
    stats = chroma.get_stats()
    if stats['total_documents'] == 0:
        print("📦 Initializing database with sample documents...")
        
        # Add sample FAQs
        sample_faqs = [
            "Free shipping on orders over $50",
            "30-day return policy on all items",
            "We accept Visa, Mastercard, and PayPal"
        ]
        # ... add to ChromaDB
        
        print("✅ Database initialized!")

# Call on app startup (in main.py)

2. Handling Gemini Rate Limits
Free tier: 15 requests/minute
Add rate limiting:
python# services/gemini_service.py

from datetime import datetime, timedelta
from collections import deque

class GeminiService:
    def __init__(self):
        # ... existing code ...
        
        # Rate limiter (15 requests/min)
        self.request_times = deque(maxlen=15)
    
    def _check_rate_limit(self):
        """
        Ensure we don't exceed 15 RPM
        """
        now = datetime.now()
        
        # Remove requests older than 1 minute
        while self.request_times and (now - self.request_times[0]) > timedelta(minutes=1):
            self.request_times.popleft()
        
        # If at limit, wait
        if len(self.request_times) >= 15:
            sleep_time = 60 - (now - self.request_times[0]).total_seconds()
            if sleep_time > 0:
                print(f"⏳ Rate limit reached. Waiting {sleep_time:.1f}s...")
                time.sleep(sleep_time)
        
        self.request_times.append(now)
    
    def generate_response(self, prompt: str) -> str:
        self._check_rate_limit()  # Check before API call
        # ... existing code ...

3. Render Free Tier Sleep Mode
Render free apps sleep after 15min inactivity. Solutions:
Option A: Accept it (wakes in ~30 seconds on first request)
Option B: Keep-alive ping (uses your 750 hours faster)
python# Don't do this - wastes free hours
# Instead, show loading message on frontend
Frontend loading state:
jsx// ChatInterface.jsx
const [isWakingUp, setIsWakingUp] = useState(false);

const sendMessage = async () => {
  setIsWakingUp(true);
  try {
    const response = await axios.post('/chat', ...);
    setIsWakingUp(false);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      // Show "Waking up server..." message
    }
  }
};

📋 FREE Implementation Checklist
Week 1: Setup & Core Features

 Create GitHub repo
 Get FREE API keys:

 Google Gemini (https://makersuite.google.com/app/apikey)
 Supabase (https://supabase.com)


 Install dependencies locally
 Implement ChromaDB service
 Implement Gemini service
 Test document upload (PDF processing)
 Test basic RAG query

Week 2: RAG Pipeline

 Build RAG pipeline (query → search → generate)
 Add conversation memory (in-memory dict)
 Create chat API endpoint
 Test with sample documents
 Implement error handling
 Add rate limiting for Gemini

Week 3: Frontend & Integration

 Build React chat interface
 Connect frontend to backend API
 Add admin dashboard for document upload
 Test end-to-end flow
 Add loading states and error messages

Week 4: Deployment & Demo

 Deploy backend to Render (FREE)
 Deploy frontend to Vercel (FREE)
 Upload sample documents to production
 Record demo video (OBS Studio - FREE)
 Write comprehensive README.md
 Submit project!


🎯 Expected Performance (Free Tier)
MetricValueResponse Time2-5 seconds (Gemini API)Concurrent Users5-10 (Render free tier)Document Limit~1000 pages (ChromaDB local)Uptime99% (sleeps after 15min)Total Cost$0.00 ✅

💡 Pro Tips for FREE Version

Pre-populate Database: Include sample documents in repo to avoid re-upload
Optimize Chunks: Use 800-char chunks (balance quality vs. storage)
Cache Common Queries: Store top 10 FAQs in-memory
Monitor Gemini Usage: Log API calls to stay under 1500/day
Use Vercel Analytics: FREE insights into user behavior


🚨 Troubleshooting FREE Tier Issues
Issue 1: "ChromaDB data lost after Render redeploy"
Solution: Add init_db.py to auto-populate on startup
Issue 2: "Gemini rate limit exceeded"
Solution: Implement request queue (see rate limiting code above)
Issue 3: "Render app sleeping too often"
Solution: Accept it, or upgrade to Render paid ($7/mo) for always-on
Issue 4: "Frontend can't connect to backend"
Solution: Check CORS settings in main.py and add Vercel URL

📄 Updated README.md for FREE Version
markdown# 🤖 FREE E-Commerce Chatbot with RAG

100% free AI chatbot using Google Gemini, ChromaDB, and open-source tools. No credit card required!

## 💰 Total Cost: $0.00

| Component | Service | Cost |
|-----------|---------|------|
| LLM | Google Gemini 1.5 Flash | FREE |
| Vector DB | ChromaDB (local) | FREE |
| Backend Host | Render | FREE |
| Frontend Host | Vercel | FREE |
| Database | Supabase | FREE |

## 🚀 Quick Start

### Prerequisites
- Google Gemini API key (free from https://makersuite.google.com)
- Supabase account (free from https://supabase.com)
- GitHub account

### Local Setup

1. Clone and install:
```bash
git clone https://github.com/yourusername/free-ecommerce-chatbot.git
cd free-ecommerce-chatbot

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your FREE API keys to .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

2. Run locally:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

3. Open http://localhost:5173

## 📊 Free Tier Limits

- ✅ 15 chat requests/minute (Gemini)
- ✅ 1500 requests/day (Gemini)
- ✅ 750 server hours/month (Render)
- ✅ Unlimited vector storage (ChromaDB local)

## 🎥 Demo

Watch the demo: [YouTube Link](#)

## 📝 License

MIT License - Free to use and modify!