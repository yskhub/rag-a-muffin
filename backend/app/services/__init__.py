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
