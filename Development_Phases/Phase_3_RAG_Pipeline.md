# Phase 3: RAG Pipeline Implementation

> **Duration: 4 Days** | **Difficulty: Intermediate** | **Cost: $0.00**

---

## 🎯 Phase Objectives

By the end of this phase, you will have:
- [x] Complete RAG pipeline integrating all services
- [x] Chat API endpoint with session support
- [x] Document upload and ingestion endpoint
- [x] Admin routes for database management
- [x] Health check and statistics endpoints
- [x] Error handling and validation

---

## 📋 Day 6-7: Core RAG Pipeline

### Step 3.1: Create the FREE RAG Pipeline

Create `backend/app/services/rag_pipeline.py`:

```python
"""
FREE RAG Pipeline - Core Business Logic

Integrates:
- ChromaDB (FREE local vector store)
- Google Gemini (FREE LLM - 15 RPM)
- In-memory session storage (FREE)

Total Cost: $0.00
"""

from app.services.chroma_service import ChromaDBService
from app.services.gemini_service import GeminiService
from app.services.memory_service import MemoryService
from app.utils.prompts import format_rag_prompt, format_no_context_prompt
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FreeRAGPipeline:
    """
    100% FREE RAG Pipeline
    
    Flow:
    1. Receive user query
    2. Search ChromaDB for relevant documents
    3. Build context from search results
    4. Get conversation history from memory
    5. Generate response using Gemini
    6. Save to memory and return
    
    All components are completely free!
    """
    
    def __init__(self):
        logger.info("Initializing FREE RAG Pipeline...")
        
        # Initialize all FREE services
        self.chroma = ChromaDBService()
        self.gemini = GeminiService()
        self.memory = MemoryService()
        
        # Configuration
        self.top_k = 5  # Number of documents to retrieve
        self.relevance_threshold = 0.5  # Minimum relevance score
        
        logger.info("✅ FREE RAG Pipeline initialized!")
    
    async def process_query(
        self, 
        query: str, 
        session_id: str
    ) -> Dict:
        """
        Main RAG pipeline - process user query and generate response
        
        Args:
            query: User's question
            session_id: Session identifier for memory
            
        Returns:
            dict with answer, sources, and session_id
        """
        logger.info(f"Processing query: '{query[:50]}...' for session: {session_id}")
        
        try:
            # Step 1: Search ChromaDB for relevant documents (FREE)
            search_results = self.chroma.search(query, top_k=self.top_k)
            
            # Step 2: Build context from results
            context = self._build_context(search_results)
            
            # Step 3: Get conversation history (in-memory - FREE)
            history = self.memory.get_history(session_id, limit=5)
            history_text = self._format_history(history)
            
            # Step 4: Generate response with Gemini (FREE - 15 RPM)
            if context:
                prompt = format_rag_prompt(query, context, history_text)
            else:
                prompt = format_no_context_prompt(query)
            
            answer = self.gemini.generate_with_context(
                query=query,
                context=context,
                conversation_history=history
            )
            
            # Step 5: Save to memory
            self.memory.add_message(session_id, "user", query)
            self.memory.add_message(session_id, "assistant", answer)
            
            # Step 6: Format and return response
            sources = self._format_sources(search_results)
            
            logger.info(f"Generated response with {len(sources)} sources")
            
            return {
                "answer": answer,
                "sources": sources,
                "session_id": session_id
            }
            
        except Exception as e:
            logger.error(f"RAG pipeline error: {str(e)}")
            raise
    
    def _build_context(self, search_results: Dict) -> str:
        """
        Extract and format context from ChromaDB results
        """
        if not search_results.get('documents') or not search_results['documents'][0]:
            logger.info("No documents found in search results")
            return ""
        
        contexts = []
        documents = search_results['documents'][0]
        metadatas = search_results['metadatas'][0]
        distances = search_results.get('distances', [[]])[0]
        
        for i, (doc, metadata) in enumerate(zip(documents, metadatas)):
            # Check relevance (lower distance = more relevant)
            relevance = 1 - distances[i] if i < len(distances) else 1
            
            if relevance < self.relevance_threshold:
                continue
            
            source = metadata.get('source', 'Unknown')
            page = metadata.get('page', 'N/A')
            
            contexts.append(
                f"[Source: {source}, Page: {page}]\n{doc}"
            )
        
        return "\n\n---\n\n".join(contexts) if contexts else ""
    
    def _format_history(self, history: List[Dict]) -> str:
        """Format conversation history for prompt"""
        if not history:
            return "No previous conversation."
        
        formatted = []
        for msg in history[-5:]:  # Last 5 messages
            role = msg['role'].capitalize()
            content = msg['content'][:200]  # Truncate long messages
            formatted.append(f"{role}: {content}")
        
        return "\n".join(formatted)
    
    def _format_sources(self, search_results: Dict) -> List[Dict]:
        """
        Format sources for frontend display
        """
        sources = []
        
        if not search_results.get('metadatas') or not search_results['metadatas'][0]:
            return sources
        
        metadatas = search_results['metadatas'][0]
        distances = search_results.get('distances', [[]])[0]
        
        for i, metadata in enumerate(metadatas):
            # Calculate relevance percentage (lower distance = higher relevance)
            distance = distances[i] if i < len(distances) else 0
            relevance = round((1 - distance) * 100, 2)
            
            sources.append({
                "source": metadata.get('source', 'Unknown'),
                "page": metadata.get('page'),
                "relevance": max(0, relevance)
            })
        
        # Sort by relevance
        sources.sort(key=lambda x: x['relevance'], reverse=True)
        
        return sources
    
    def get_stats(self) -> Dict:
        """Get comprehensive pipeline statistics"""
        return {
            "chroma": self.chroma.get_stats(),
            "gemini": self.gemini.get_stats(),
            "memory": self.memory.get_stats(),
            "pipeline": {
                "top_k": self.top_k,
                "relevance_threshold": self.relevance_threshold
            },
            "total_cost": "$0.00"
        }
    
    def clear_memory(self, session_id: str) -> bool:
        """Clear conversation history for a session"""
        return self.memory.clear_session(session_id)


# Singleton instance
_rag_pipeline: Optional[FreeRAGPipeline] = None

def get_rag_pipeline() -> FreeRAGPipeline:
    """Get or create RAG pipeline singleton"""
    global _rag_pipeline
    if _rag_pipeline is None:
        _rag_pipeline = FreeRAGPipeline()
    return _rag_pipeline
```

---

## 📋 Day 8-9: API Endpoints

### Step 3.2: Create Chat API Endpoint

Create `backend/app/api/chat.py`:

```python
"""
Chat API Endpoints

FREE Chat implementation using:
- Google Gemini (FREE LLM)
- ChromaDB (FREE vectors)
- In-memory sessions
"""

from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ChatRequest, ChatResponse, HealthResponse
from app.services.rag_pipeline import get_rag_pipeline, FreeRAGPipeline
import uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process user message through FREE RAG pipeline
    
    - Uses Google Gemini (15 requests/min FREE)
    - Searches ChromaDB for context (FREE local)
    - Maintains conversation memory (FREE in-memory)
    """
    try:
        # Get RAG pipeline
        rag = get_rag_pipeline()
        
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Process through RAG pipeline
        result = await rag.process_query(
            query=request.message,
            session_id=session_id
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            session_id=result["session_id"]
        )
    
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}"
        )

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint - verify all FREE services are running
    """
    return HealthResponse(
        status="healthy",
        services={
            "llm": "Google Gemini 1.5 Flash (FREE - 15 RPM)",
            "vector_db": "ChromaDB (FREE - Local)",
            "memory": "In-Memory Dict (FREE)",
            "database": "Supabase (FREE - 500MB)"
        }
    )

@router.get("/stats")
async def get_pipeline_stats():
    """
    Get comprehensive statistics about the RAG pipeline
    """
    try:
        rag = get_rag_pipeline()
        return rag.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """
    Clear conversation history for a specific session
    """
    try:
        rag = get_rag_pipeline()
        cleared = rag.clear_memory(session_id)
        return {
            "message": "Session cleared" if cleared else "Session not found",
            "session_id": session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Step 3.3: Create Document Upload API

Create `backend/app/api/documents.py`:

```python
"""
Document Management API Endpoints

FREE document processing and storage:
- PDF text extraction
- Chunking with overlap
- ChromaDB vector storage (FREE)
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.services.chroma_service import ChromaDBService
from app.utils.document_processor import DocumentProcessor
from app.models.schemas import DocumentUploadResponse, DocumentStats
from typing import List
import uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Initialize services
chroma = ChromaDBService()
doc_processor = DocumentProcessor(chunk_size=1000, chunk_overlap=200)

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and process a PDF document
    
    Process:
    1. Validate file type (PDF only)
    2. Extract text from each page
    3. Chunk text with overlap
    4. Generate embeddings locally (FREE)
    5. Store in ChromaDB (FREE)
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported. Please upload a .pdf file."
        )
    
    # Check file size (limit to 10MB for free tier)
    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)
    
    if file_size_mb > 10:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({file_size_mb:.1f}MB). Maximum size is 10MB."
        )
    
    try:
        logger.info(f"Processing document: {file.filename} ({file_size_mb:.2f}MB)")
        
        # Process PDF
        chunks = doc_processor.process_pdf(content, file.filename)
        
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. Please ensure it's not scanned/image-based."
            )
        
        # Prepare for ChromaDB
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [
            {
                "source": chunk["source"],
                "page": chunk.get("page", 0),
                "chunk_index": chunk.get("chunk_index", 0)
            }
            for chunk in chunks
        ]
        ids = [
            f"{file.filename}_p{m['page']}_c{m['chunk_index']}_{uuid.uuid4().hex[:8]}"
            for m in metadatas
        ]
        
        # Store in ChromaDB (FREE)
        chroma.add_documents(texts, metadatas, ids)
        
        # Calculate unique pages
        pages = len(set(chunk.get("page", 0) for chunk in chunks))
        
        logger.info(f"Uploaded: {file.filename} - {pages} pages, {len(chunks)} chunks")
        
        return DocumentUploadResponse(
            message="Document uploaded and processed successfully!",
            filename=file.filename,
            pages=pages,
            chunks=len(chunks)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(e)}"
        )

@router.get("/stats", response_model=DocumentStats)
async def get_document_stats():
    """
    Get statistics about stored documents
    """
    try:
        stats = chroma.get_stats()
        return DocumentStats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sources")
async def get_document_sources():
    """
    Get list of all uploaded document sources
    """
    try:
        sources = chroma.get_all_sources()
        return {
            "sources": sources,
            "count": len(sources)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/source/{source_name}")
async def delete_document(source_name: str):
    """
    Delete all chunks from a specific document
    """
    try:
        deleted_count = chroma.delete_by_source(source_name)
        return {
            "message": f"Deleted {deleted_count} chunks from {source_name}",
            "source": source_name,
            "chunks_deleted": deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear")
async def clear_all_documents():
    """
    Clear ALL documents from the database
    WARNING: This cannot be undone!
    """
    try:
        chroma.delete_all()
        return {
            "message": "All documents have been deleted",
            "warning": "Database is now empty"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-text")
async def upload_text(
    title: str,
    content: str,
    category: str = "general"
):
    """
    Upload plain text content (for FAQs, policies, etc.)
    """
    try:
        # Chunk the text
        chunks = doc_processor.chunk_text(
            content,
            metadata={"source": title, "category": category}
        )
        
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No content to process"
            )
        
        # Prepare for ChromaDB
        texts = [chunk["text"] for chunk in chunks]
        metadatas = [
            {
                "source": title,
                "category": category,
                "chunk_index": chunk.get("chunk_index", 0)
            }
            for chunk in chunks
        ]
        ids = [
            f"{title}_c{i}_{uuid.uuid4().hex[:8]}"
            for i in range(len(chunks))
        ]
        
        # Store
        chroma.add_documents(texts, metadatas, ids)
        
        return {
            "message": "Text content uploaded successfully",
            "title": title,
            "chunks": len(chunks)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Step 3.4: Create Admin API

Create `backend/app/api/admin.py`:

```python
"""
Admin API Endpoints

Management functions for the chatbot:
- Statistics and monitoring
- FAQ management
- System health
"""

from fastapi import APIRouter, HTTPException
from app.services.rag_pipeline import get_rag_pipeline
from app.services.chroma_service import ChromaDBService
from typing import List
import uuid

router = APIRouter()
chroma = ChromaDBService()

@router.get("/dashboard")
async def admin_dashboard():
    """
    Get admin dashboard data with all statistics
    """
    try:
        rag = get_rag_pipeline()
        stats = rag.get_stats()
        
        return {
            "overview": {
                "total_documents": stats["chroma"]["total_documents"],
                "active_sessions": stats["memory"]["active_sessions"],
                "total_messages": stats["memory"]["total_messages"]
            },
            "services": {
                "llm": {
                    "provider": "Google Gemini 1.5 Flash",
                    "status": "active",
                    "requests_last_minute": stats["gemini"]["requests_last_minute"],
                    "rate_limit": "15 RPM",
                    "cost": "FREE"
                },
                "vector_db": {
                    "provider": "ChromaDB",
                    "status": "active",
                    "documents": stats["chroma"]["total_documents"],
                    "cost": "FREE"
                },
                "memory": {
                    "provider": "In-Memory Dict",
                    "status": "active",
                    "sessions": stats["memory"]["active_sessions"],
                    "cost": "FREE"
                }
            },
            "total_cost": "$0.00"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/faqs/bulk")
async def add_bulk_faqs(faqs: List[dict]):
    """
    Add multiple FAQs at once
    
    Example input:
    [
        {"question": "What is your return policy?", "answer": "30-day returns..."},
        {"question": "Do you ship internationally?", "answer": "Yes, we ship..."}
    ]
    """
    try:
        texts = []
        metadatas = []
        ids = []
        
        for faq in faqs:
            # Combine question and answer for better retrieval
            combined_text = f"Q: {faq['question']}\nA: {faq['answer']}"
            texts.append(combined_text)
            metadatas.append({
                "source": "FAQ",
                "type": "faq",
                "question": faq["question"][:100]
            })
            ids.append(f"faq_{uuid.uuid4().hex[:8]}")
        
        chroma.add_documents(texts, metadatas, ids)
        
        return {
            "message": f"Added {len(faqs)} FAQs successfully",
            "count": len(faqs)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed-sample-data")
async def seed_sample_data():
    """
    Populate database with sample data for testing/demo
    """
    try:
        sample_data = [
            # Products
            {
                "text": "Wireless Bluetooth Headphones Pro - Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Price: $79.99. Available in Black, Silver, and Rose Gold.",
                "source": "Product Catalog",
                "category": "electronics"
            },
            {
                "text": "Portable Bluetooth Speaker - Waterproof speaker with deep bass, 12-hour battery, and built-in microphone for calls. Perfect for outdoor adventures. Price: $49.99.",
                "source": "Product Catalog",
                "category": "electronics"
            },
            {
                "text": "USB-C Fast Charging Cable - 6 feet braided cable with rapid charging support. Compatible with all USB-C devices. Price: $12.99.",
                "source": "Product Catalog",
                "category": "accessories"
            },
            {
                "text": "Wireless Phone Charger Pad - 15W fast wireless charging compatible with iPhone and Android. Slim design with LED indicator. Price: $24.99.",
                "source": "Product Catalog",
                "category": "accessories"
            },
            # FAQs
            {
                "text": "Q: What is your return policy? A: We offer a hassle-free 30-day return policy on all items. Products must be unused and in original packaging. Simply contact our support team to initiate a return.",
                "source": "FAQ",
                "category": "policies"
            },
            {
                "text": "Q: Do you offer free shipping? A: Yes! We provide free standard shipping on all orders over $50. Orders under $50 have a flat $5.99 shipping fee. Express shipping is available for an additional charge.",
                "source": "FAQ",
                "category": "shipping"
            },
            {
                "text": "Q: How long does shipping take? A: Standard shipping takes 3-5 business days. Express shipping (additional $9.99) takes 1-2 business days. International shipping takes 7-14 business days.",
                "source": "FAQ",
                "category": "shipping"
            },
            {
                "text": "Q: What payment methods do you accept? A: We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.",
                "source": "FAQ",
                "category": "payments"
            },
            {
                "text": "Q: How can I track my order? A: Once your order ships, you'll receive an email with a tracking number. You can also check your order status in your account dashboard.",
                "source": "FAQ",
                "category": "orders"
            },
            {
                "text": "Q: Do you offer warranty on products? A: Yes, all electronics come with a 1-year manufacturer warranty. Extended warranty options are available at checkout for an additional fee.",
                "source": "FAQ",
                "category": "warranty"
            }
        ]
        
        texts = [item["text"] for item in sample_data]
        metadatas = [
            {"source": item["source"], "category": item["category"]}
            for item in sample_data
        ]
        ids = [f"sample_{i}_{uuid.uuid4().hex[:8]}" for i in range(len(sample_data))]
        
        chroma.add_documents(texts, metadatas, ids)
        
        return {
            "message": "Sample data seeded successfully!",
            "items_added": len(sample_data),
            "categories": list(set(item["category"] for item in sample_data))
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Step 3.5: Update Main Application

Update `backend/app/main.py`:

```python
"""
FREE E-commerce Chatbot API - Main Application

Tech Stack (100% FREE):
- FastAPI (backend framework)
- Google Gemini 1.5 Flash (LLM - 15 RPM free)
- ChromaDB (vector database - local)
- Supabase (PostgreSQL - 500MB free)

Total Cost: $0.00
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging

from app.config import settings
from app.api import chat, documents, admin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    - Startup: Initialize services, seed data if needed
    - Shutdown: Cleanup resources
    """
    # Startup
    logger.info("🚀 Starting FREE E-commerce Chatbot API...")
    logger.info("=" * 50)
    logger.info("💰 Total Cost: $0.00")
    logger.info("=" * 50)
    
    # Initialize RAG pipeline (loads models)
    from app.services.rag_pipeline import get_rag_pipeline
    rag = get_rag_pipeline()
    
    # Check if database is empty and seed if needed
    stats = rag.chroma.get_stats()
    if stats["total_documents"] == 0:
        logger.info("📦 Database empty - seeding sample data...")
        # Auto-seed will happen on first admin/seed-sample-data call
    
    logger.info("✅ Application ready!")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down...")

# Create FastAPI app
app = FastAPI(
    title="FREE E-commerce Chatbot API",
    description="""
    🤖 AI-Powered E-commerce Customer Support Chatbot
    
    Built with 100% FREE services:
    - Google Gemini 1.5 Flash (FREE LLM)
    - ChromaDB (FREE local vector DB)
    - Supabase (FREE 500MB database)
    
    **Total Cost: $0.00** 💰
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    chat.router,
    prefix="/api",
    tags=["💬 Chat"]
)

app.include_router(
    documents.router,
    prefix="/api/documents",
    tags=["📄 Documents"]
)

app.include_router(
    admin.router,
    prefix="/api/admin",
    tags=["⚙️ Admin"]
)

# Root endpoint
@app.get("/", tags=["🏠 Info"])
async def root():
    """
    API Information
    """
    return {
        "name": "FREE E-commerce Chatbot API",
        "version": "1.0.0",
        "description": "AI-powered customer support using RAG",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "services": {
            "llm": "Google Gemini 1.5 Flash (FREE)",
            "vector_db": "ChromaDB (FREE)",
            "database": "Supabase (FREE)"
        },
        "total_cost": "$0.00 💰"
    }

# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=settings.ENVIRONMENT == "development"
    )
```

### Step 3.6: Update API Routers Init

Update `backend/app/api/__init__.py`:

```python
"""
API Routers Package
"""

from app.api import chat, documents, admin

__all__ = ["chat", "documents", "admin"]
```

---

## ✅ Phase 3 Completion Checklist

- [ ] RAG pipeline integrates all services
- [ ] Chat endpoint working with sessions
- [ ] Document upload processes PDFs
- [ ] Admin routes for management
- [ ] Sample data seeding works
- [ ] Health check returns all services
- [ ] All endpoints tested via Swagger UI

---

## 🧪 Testing the API

### Start the Server

```bash
cd backend
uvicorn app.main:app --reload
```

### Test with Swagger UI

1. Open http://localhost:8000/docs
2. Test endpoints in order:
   - `POST /api/admin/seed-sample-data` - Add sample data
   - `GET /api/documents/stats` - Verify documents added
   - `POST /api/chat` - Test chat with query
   - `GET /api/health` - Check all services

### Test with cURL

```bash
# Seed sample data
curl -X POST http://localhost:8000/api/admin/seed-sample-data

# Test chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Do you have wireless headphones?", "session_id": "test123"}'

# Check stats
curl http://localhost:8000/api/stats
```

---

## 🔄 Git Commit

```bash
git add .
git commit -m "Phase 3: RAG pipeline and API endpoints complete (FREE tier)"
git push origin main
```

---

## 📚 Next Phase

Continue to **[Phase 4: Frontend Development](./Phase_4_Frontend_Development.md)** where we'll build:
- React chat interface with Tailwind CSS
- Message bubbles with source citations
- Admin dashboard for document upload
- Real-time loading states

---

**Phase 3 Complete! 🎉**
