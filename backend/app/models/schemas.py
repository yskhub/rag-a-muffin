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
