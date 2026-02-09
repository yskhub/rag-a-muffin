# Phase 2: Backend API Development

> **Duration: 3 Days** | **Difficulty: Intermediate** | **Cost: $0.00**

---

## 🎯 Phase Objectives

By the end of this phase, you will have:
- [x] Gemini service for LLM responses (FREE)
- [x] ChromaDB service for vector storage (FREE)
- [x] Embedding service using HuggingFace (FREE)
- [x] Memory service for session management (FREE)
- [x] Document processing utilities
- [x] Pydantic schemas for request/response validation

---

## 📋 Day 3: Core Services Implementation

### Step 2.1: Create Pydantic Schemas

Create `backend/app/models/schemas.py`:

```python
"""
Pydantic models for request/response validation
All FREE services - no paid APIs
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ============================================
# Chat Schemas
# ============================================

class ChatRequest(BaseModel):
    """Incoming chat message request"""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Do you have wireless headphones?",
                "session_id": "user-123-session"
            }
        }

class Source(BaseModel):
    """Document source reference"""
    source: str
    page: Optional[int] = None
    relevance: float

class ChatResponse(BaseModel):
    """Chat response with sources"""
    answer: str
    sources: List[Source]
    session_id: str

# ============================================
# Document Schemas
# ============================================

class DocumentUploadResponse(BaseModel):
    """Response after document upload"""
    message: str
    filename: str
    pages: int
    chunks: int

class DocumentStats(BaseModel):
    """Database statistics"""
    total_documents: int
    collection_name: str
    storage_type: str

# ============================================
# Health Check
# ============================================

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    services: Dict[str, str]

# ============================================
# Memory/Session Schemas
# ============================================

class Message(BaseModel):
    """Single conversation message"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str

class SessionStats(BaseModel):
    """Session statistics"""
    active_sessions: int
    total_messages: int
```

### Step 2.2: Create Google Gemini Service (FREE LLM)

Create `backend/app/services/gemini_service.py`:

```python
"""
Google Gemini Service - 100% FREE
Limits: 15 requests/min, 1500 requests/day
No credit card required!
"""

import google.generativeai as genai
import os
import time
from datetime import datetime, timedelta
from collections import deque
from typing import List, Dict, Optional

class GeminiService:
    """
    FREE Google Gemini API Service
    
    Rate Limits (FREE tier):
    - 15 requests per minute (RPM)
    - 1500 requests per day (RPD)
    - 1 million tokens per minute
    """
    
    def __init__(self):
        # Get API key from environment
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError(
                "GOOGLE_API_KEY not found! "
                "Get your FREE key at: https://makersuite.google.com/app/apikey"
            )
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Use Gemini 1.5 Flash (fastest free model)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Rate limiter: track last 15 requests
        self.request_times: deque = deque(maxlen=15)
        
        print("✅ Google Gemini initialized (100% FREE - 15 RPM)")
    
    def _check_rate_limit(self):
        """
        Ensure we don't exceed 15 requests per minute
        Waits if necessary to avoid rate limit errors
        """
        now = datetime.now()
        
        # Remove requests older than 1 minute
        while self.request_times and (now - self.request_times[0]) > timedelta(minutes=1):
            self.request_times.popleft()
        
        # If at limit, wait
        if len(self.request_times) >= 15:
            oldest_request = self.request_times[0]
            sleep_time = 60 - (now - oldest_request).total_seconds()
            if sleep_time > 0:
                print(f"⏳ Rate limit reached. Waiting {sleep_time:.1f}s...")
                time.sleep(sleep_time)
        
        # Record this request
        self.request_times.append(now)
    
    def generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini
        Includes automatic rate limiting for free tier
        """
        # Check rate limit before making request
        self._check_rate_limit()
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini API Error: {error_msg}")
            
            # Handle specific errors
            if "quota" in error_msg.lower():
                return "I've reached my daily limit. Please try again tomorrow!"
            elif "rate" in error_msg.lower():
                return "Too many requests. Please wait a moment and try again."
            else:
                return "I'm having trouble responding right now. Please try again."
    
    def generate_with_context(
        self, 
        query: str, 
        context: str, 
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate contextual response (RAG-style)
        Uses retrieved context + conversation history
        """
        # Format conversation history
        history_text = ""
        if conversation_history:
            history_text = "\n".join([
                f"{msg['role'].capitalize()}: {msg['content']}" 
                for msg in conversation_history[-5:]  # Last 5 messages
            ])
        
        # Build structured prompt
        prompt = f"""You are a helpful e-commerce customer support assistant.
Use the following product information to answer the customer's question accurately.

PRODUCT INFORMATION:
{context}

CONVERSATION HISTORY:
{history_text}

CUSTOMER QUESTION: {query}

INSTRUCTIONS:
- Answer based ONLY on the provided product information
- If the answer isn't in the context, politely say "I don't have that specific information in our catalog"
- Be concise, friendly, and helpful
- Don't make up information
- If suggesting products, mention their source

ANSWER:"""

        return self.generate_response(prompt)
    
    def get_stats(self) -> Dict:
        """Get service statistics"""
        return {
            "model": "gemini-1.5-flash",
            "requests_last_minute": len(self.request_times),
            "rate_limit": "15 RPM (FREE)",
            "cost": "$0.00"
        }
```

### Step 2.3: Create ChromaDB Service (FREE Vector Database)

Create `backend/app/services/chroma_service.py`:

```python
"""
ChromaDB Service - 100% FREE Local Vector Database
No API limits, completely free!
Stores vectors locally with persistence
"""

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import os

class ChromaDBService:
    """
    FREE Vector Database using ChromaDB
    
    Features:
    - Local persistent storage (no cloud costs)
    - Unlimited vectors (limited by disk space)
    - Fast semantic search
    """
    
    def __init__(self):
        # Initialize ChromaDB with persistent storage
        chroma_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
        
        # Ensure directory exists
        os.makedirs(chroma_path, exist_ok=True)
        
        self.client = chromadb.PersistentClient(
            path=chroma_path,
            settings=Settings(
                anonymized_telemetry=False,  # Disable telemetry
                allow_reset=True
            )
        )
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="ecommerce_docs",
            metadata={"description": "E-commerce product documents and FAQs"}
        )
        
        # Initialize FREE embedding model (runs locally)
        print("📦 Loading embedding model (this may take a minute on first run)...")
        self.embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print("✅ ChromaDB initialized (100% FREE - Local storage)")
    
    def add_documents(
        self, 
        texts: List[str], 
        metadatas: List[Dict], 
        ids: List[str]
    ) -> None:
        """
        Add documents to ChromaDB
        Generates embeddings locally (FREE)
        """
        if not texts:
            return
        
        # Generate embeddings locally (no API costs!)
        embeddings = self.embedder.encode(texts).tolist()
        
        # Upsert to handle duplicates
        self.collection.upsert(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"✅ Added {len(texts)} documents to ChromaDB")
    
    def search(self, query: str, top_k: int = 5) -> Dict:
        """
        Semantic search in ChromaDB
        Returns top-k most similar documents
        """
        # Check if collection is empty
        if self.collection.count() == 0:
            return {
                "documents": [[]],
                "metadatas": [[]],
                "distances": [[]]
            }
        
        # Embed query locally (FREE)
        query_embedding = self.embedder.encode([query]).tolist()
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=min(top_k, self.collection.count()),
            include=["documents", "metadatas", "distances"]
        )
        
        return results
    
    def delete_all(self) -> None:
        """Clear all documents (useful for testing)"""
        self.client.delete_collection("ecommerce_docs")
        self.collection = self.client.create_collection(
            name="ecommerce_docs",
            metadata={"description": "E-commerce product documents and FAQs"}
        )
        print("✅ Database cleared")
    
    def delete_by_source(self, source: str) -> int:
        """Delete all documents from a specific source"""
        # Get all documents with this source
        results = self.collection.get(
            where={"source": source}
        )
        
        if results["ids"]:
            self.collection.delete(ids=results["ids"])
            return len(results["ids"])
        return 0
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        count = self.collection.count()
        return {
            "total_documents": count,
            "collection_name": "ecommerce_docs",
            "storage_type": "local_persistent",
            "embedding_model": "all-MiniLM-L6-v2",
            "embedding_dimensions": 384,
            "cost": "$0.00"
        }
    
    def get_all_sources(self) -> List[str]:
        """Get list of all unique document sources"""
        results = self.collection.get(include=["metadatas"])
        sources = set()
        for metadata in results["metadatas"]:
            if metadata and "source" in metadata:
                sources.add(metadata["source"])
        return list(sources)
```

### Step 2.4: Create Memory Service (FREE Session Storage)

Create `backend/app/services/memory_service.py`:

```python
"""
In-Memory Session Storage - 100% FREE
No Redis needed - uses Python dictionary
Perfect for free tier deployments
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict

class MemoryService:
    """
    FREE in-memory conversation storage
    
    Features:
    - No external service required
    - Automatic session cleanup
    - Configurable history limit
    
    Limitations:
    - Sessions lost on server restart
    - Single server only (no horizontal scaling)
    """
    
    def __init__(self):
        # Store conversations in memory
        self.conversations: Dict[str, List[Dict]] = defaultdict(list)
        self.last_activity: Dict[str, datetime] = {}
        
        # Configuration
        self.TIMEOUT_MINUTES = 60  # Sessions expire after 1 hour
        self.MAX_MESSAGES = 20     # Keep last 20 messages per session
        
        print("✅ Memory service initialized (In-memory - FREE)")
    
    def add_message(
        self, 
        session_id: str, 
        role: str, 
        content: str
    ) -> None:
        """
        Add message to conversation history
        Automatically trims old messages
        """
        self.conversations[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        # Update last activity
        self.last_activity[session_id] = datetime.now()
        
        # Keep only last N messages (memory optimization)
        if len(self.conversations[session_id]) > self.MAX_MESSAGES:
            self.conversations[session_id] = \
                self.conversations[session_id][-self.MAX_MESSAGES:]
    
    def get_history(
        self, 
        session_id: str, 
        limit: int = 10
    ) -> List[Dict]:
        """
        Get conversation history for a session
        Triggers cleanup of old sessions
        """
        # Clean up old sessions
        self._cleanup_old_sessions()
        
        messages = self.conversations.get(session_id, [])
        return messages[-limit:] if messages else []
    
    def clear_session(self, session_id: str) -> bool:
        """Clear specific session"""
        cleared = False
        if session_id in self.conversations:
            del self.conversations[session_id]
            cleared = True
        if session_id in self.last_activity:
            del self.last_activity[session_id]
        return cleared
    
    def _cleanup_old_sessions(self) -> int:
        """
        Remove sessions inactive for > TIMEOUT_MINUTES
        Returns number of sessions cleaned
        """
        now = datetime.now()
        timeout = timedelta(minutes=self.TIMEOUT_MINUTES)
        
        expired_sessions = [
            session_id 
            for session_id, last_time in self.last_activity.items()
            if now - last_time > timeout
        ]
        
        for session_id in expired_sessions:
            self.clear_session(session_id)
        
        return len(expired_sessions)
    
    def get_stats(self) -> Dict:
        """Get memory statistics"""
        total_messages = sum(
            len(msgs) for msgs in self.conversations.values()
        )
        return {
            "active_sessions": len(self.conversations),
            "total_messages": total_messages,
            "timeout_minutes": self.TIMEOUT_MINUTES,
            "max_messages_per_session": self.MAX_MESSAGES,
            "cost": "$0.00"
        }
    
    def get_session_info(self, session_id: str) -> Optional[Dict]:
        """Get info about a specific session"""
        if session_id not in self.conversations:
            return None
        
        return {
            "session_id": session_id,
            "message_count": len(self.conversations[session_id]),
            "last_active": self.last_activity.get(session_id, "unknown")
        }
```

---

## 📋 Day 4: Document Processing & Utilities

### Step 2.5: Create Document Processor

Create `backend/app/utils/document_processor.py`:

```python
"""
Document Processing Utilities
Handles PDF and text extraction with chunking
"""

import PyPDF2
import io
from typing import List, Tuple, Dict
import re

class DocumentProcessor:
    """
    Process documents for RAG pipeline
    
    Supports:
    - PDF files
    - Plain text
    - Automatic chunking with overlap
    """
    
    def __init__(
        self, 
        chunk_size: int = 1000, 
        chunk_overlap: int = 200
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def extract_text_from_pdf(self, content: bytes) -> List[Tuple[int, str]]:
        """
        Extract text from PDF file
        Returns list of (page_number, text) tuples
        """
        pages = []
        
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                text = page.extract_text()
                if text and text.strip():
                    # Clean the text
                    text = self._clean_text(text)
                    pages.append((page_num, text))
            
            return pages
        
        except Exception as e:
            raise ValueError(f"Failed to extract PDF: {str(e)}")
    
    def chunk_text(
        self, 
        text: str, 
        metadata: Dict = None
    ) -> List[Dict]:
        """
        Split text into overlapping chunks
        Returns list of chunk dictionaries
        """
        if not text or not text.strip():
            return []
        
        chunks = []
        start = 0
        chunk_index = 0
        
        while start < len(text):
            # Calculate end position
            end = start + self.chunk_size
            
            # Try to end at a sentence boundary
            if end < len(text):
                # Look for sentence end near chunk boundary
                sentence_end = self._find_sentence_boundary(text, end)
                if sentence_end > start:
                    end = sentence_end
            
            # Extract chunk
            chunk_text = text[start:end].strip()
            
            if chunk_text:
                chunk_data = {
                    "text": chunk_text,
                    "chunk_index": chunk_index,
                    "char_start": start,
                    "char_end": end
                }
                
                # Add metadata if provided
                if metadata:
                    chunk_data.update(metadata)
                
                chunks.append(chunk_data)
                chunk_index += 1
            
            # Move start position (with overlap)
            start = end - self.chunk_overlap
            if start >= len(text):
                break
        
        return chunks
    
    def process_pdf(
        self, 
        content: bytes, 
        filename: str
    ) -> List[Dict]:
        """
        Full PDF processing pipeline
        Extract text → Chunk → Return with metadata
        """
        all_chunks = []
        
        # Extract text from all pages
        pages = self.extract_text_from_pdf(content)
        
        for page_num, page_text in pages:
            # Chunk the page text
            chunks = self.chunk_text(
                page_text,
                metadata={
                    "source": filename,
                    "page": page_num
                }
            )
            all_chunks.extend(chunks)
        
        return all_chunks
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters
        text = re.sub(r'[^\w\s.,;:!?\'"-]', '', text)
        return text.strip()
    
    def _find_sentence_boundary(
        self, 
        text: str, 
        position: int, 
        search_range: int = 100
    ) -> int:
        """Find nearest sentence end near position"""
        # Search backward from position
        search_start = max(0, position - search_range)
        search_text = text[search_start:position]
        
        # Look for sentence endings
        for end_char in ['. ', '! ', '? ', '.\n', '!\n', '?\n']:
            last_pos = search_text.rfind(end_char)
            if last_pos != -1:
                return search_start + last_pos + len(end_char)
        
        return position
```

### Step 2.6: Create Prompt Templates

Create `backend/app/utils/prompts.py`:

```python
"""
Prompt Templates for RAG Chatbot
Optimized for Google Gemini
"""

# Main RAG prompt template
RAG_PROMPT_TEMPLATE = """You are a helpful e-commerce customer support assistant for our online store.
Your goal is to help customers find products and answer their questions accurately.

CONTEXT INFORMATION:
{context}

CONVERSATION HISTORY:
{history}

CUSTOMER QUESTION: {query}

INSTRUCTIONS:
1. Answer based ONLY on the provided context information
2. If the information isn't in the context, say "I don't have that specific information, but I can help you with..."
3. Be friendly, concise, and helpful
4. If mentioning prices or availability, always cite the source
5. Suggest related products when appropriate

YOUR RESPONSE:"""

# Fallback when no context is found
NO_CONTEXT_PROMPT = """You are a helpful e-commerce customer support assistant.

The customer asked: {query}

Unfortunately, I couldn't find specific product information in our catalog for this query.

Please provide a helpful response that:
1. Acknowledges you don't have specific information
2. Suggests they might rephrase their question
3. Offers to help with general questions about shipping, returns, or support

YOUR RESPONSE:"""

# System prompt for Gemini
SYSTEM_PROMPT = """You are an AI customer support assistant for an e-commerce store.

Core responsibilities:
- Help customers find products
- Answer questions about products, shipping, and returns
- Provide accurate information based on our product catalog
- Be friendly and professional

Guidelines:
- Never make up product information
- Always cite sources when possible
- If unsure, ask for clarification
- Keep responses concise (under 200 words)
"""

def format_rag_prompt(
    query: str, 
    context: str, 
    history: str = ""
) -> str:
    """Format the RAG prompt with context and history"""
    return RAG_PROMPT_TEMPLATE.format(
        context=context or "No specific product information found.",
        history=history or "No previous conversation.",
        query=query
    )

def format_no_context_prompt(query: str) -> str:
    """Format fallback prompt when no context is found"""
    return NO_CONTEXT_PROMPT.format(query=query)
```

---

## 📋 Day 5: Service Integration & Testing

### Step 2.7: Create Service Singletons

Create `backend/app/services/__init__.py`:

```python
"""
Service Initialization
Lazy loading of services to avoid startup delays
"""

from typing import Optional

# Service instances (singletons)
_gemini_service: Optional["GeminiService"] = None
_chroma_service: Optional["ChromaDBService"] = None
_memory_service: Optional["MemoryService"] = None

def get_gemini_service():
    """Get or create Gemini service instance"""
    global _gemini_service
    if _gemini_service is None:
        from app.services.gemini_service import GeminiService
        _gemini_service = GeminiService()
    return _gemini_service

def get_chroma_service():
    """Get or create ChromaDB service instance"""
    global _chroma_service
    if _chroma_service is None:
        from app.services.chroma_service import ChromaDBService
        _chroma_service = ChromaDBService()
    return _chroma_service

def get_memory_service():
    """Get or create Memory service instance"""
    global _memory_service
    if _memory_service is None:
        from app.services.memory_service import MemoryService
        _memory_service = MemoryService()
    return _memory_service
```

### Step 2.8: Test Services

Create `backend/test_services.py`:

```python
"""
Test script for all services
Run: python test_services.py
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini():
    """Test Google Gemini service"""
    print("\n" + "="*50)
    print("Testing Google Gemini Service (FREE)")
    print("="*50)
    
    from app.services.gemini_service import GeminiService
    
    gemini = GeminiService()
    
    # Test basic response
    response = gemini.generate_response("Say 'Hello, I am working!' in exactly those words.")
    print(f"Response: {response}")
    
    # Test stats
    stats = gemini.get_stats()
    print(f"Stats: {stats}")
    
    print("✅ Gemini test passed!")

def test_chromadb():
    """Test ChromaDB service"""
    print("\n" + "="*50)
    print("Testing ChromaDB Service (FREE)")
    print("="*50)
    
    from app.services.chroma_service import ChromaDBService
    
    chroma = ChromaDBService()
    
    # Add test documents
    chroma.add_documents(
        texts=[
            "Wireless Bluetooth headphones with 30-hour battery life, priced at $79.99",
            "Waterproof speaker with bass boost, perfect for outdoor use, $49.99",
            "USB-C fast charging cable, 6 feet long, $12.99"
        ],
        metadatas=[
            {"source": "test_catalog.pdf", "page": 1},
            {"source": "test_catalog.pdf", "page": 2},
            {"source": "test_catalog.pdf", "page": 3}
        ],
        ids=["test_1", "test_2", "test_3"]
    )
    
    # Test search
    results = chroma.search("headphones with long battery", top_k=2)
    print(f"Search results: {results['documents'][0]}")
    
    # Test stats
    stats = chroma.get_stats()
    print(f"Stats: {stats}")
    
    print("✅ ChromaDB test passed!")

def test_memory():
    """Test Memory service"""
    print("\n" + "="*50)
    print("Testing Memory Service (FREE)")
    print("="*50)
    
    from app.services.memory_service import MemoryService
    
    memory = MemoryService()
    
    # Add messages
    session_id = "test_session_123"
    memory.add_message(session_id, "user", "Hello!")
    memory.add_message(session_id, "assistant", "Hi there! How can I help?")
    
    # Get history
    history = memory.get_history(session_id)
    print(f"History: {history}")
    
    # Test stats
    stats = memory.get_stats()
    print(f"Stats: {stats}")
    
    # Cleanup
    memory.clear_session(session_id)
    
    print("✅ Memory test passed!")

if __name__ == "__main__":
    print("\n🧪 Testing FREE Services\n")
    
    try:
        test_chromadb()
        test_memory()
        test_gemini()  # Test last (has rate limits)
        
        print("\n" + "="*50)
        print("✅ ALL TESTS PASSED!")
        print("="*50)
        print("\nAll services are working correctly and are 100% FREE!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        raise
```

Run the tests:

```bash
cd backend
python test_services.py
```

---

## ✅ Phase 2 Completion Checklist

- [ ] Pydantic schemas created (`models/schemas.py`)
- [ ] Gemini service implemented with rate limiting
- [ ] ChromaDB service implemented with local persistence
- [ ] Memory service implemented with auto-cleanup
- [ ] Document processor created for PDF handling
- [ ] Prompt templates created
- [ ] Service singletons configured
- [ ] All services tested successfully

---

## 🔄 Git Commit

```bash
git add .
git commit -m "Phase 2: Backend services complete (Gemini, ChromaDB, Memory)"
git push origin main
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Gemini API key invalid"
```bash
# Solution: Get a new key from https://makersuite.google.com/app/apikey
# Make sure there are no extra spaces in .env
```

### Issue 2: "ChromaDB sqlite3 error"
```bash
# Solution: Install pysqlite3 binary
pip install pysqlite3-binary

# On Linux, add to chroma_service.py:
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
```

### Issue 3: "sentence-transformers download slow"
```bash
# Solution: Pre-download the model
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

---

## 📚 Next Phase

Continue to **[Phase 3: RAG Pipeline Implementation](./Phase_3_RAG_Pipeline.md)** where we'll:
- Build the complete RAG pipeline
- Create API endpoints for chat
- Implement document upload functionality
- Add admin routes for management

---

**Phase 2 Complete! 🎉**
