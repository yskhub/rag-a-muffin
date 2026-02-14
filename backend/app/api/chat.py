"""
Chat API Endpoints
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, HealthResponse
from app.services.rag_pipeline import get_rag_pipeline
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process user message through FREE RAG pipeline"""
    try:
        rag = get_rag_pipeline()
        session_id = request.session_id or str(uuid.uuid4())
        
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
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        services={
            "llm": "Google Gemini 1.5 Flash (FREE)",
            "vector_db": "ChromaDB (FREE)",
            "memory": "In-Memory (FREE)"
        }
    )

@router.get("/stats")
async def get_pipeline_stats():
    """Get statistics about the RAG pipeline"""
    try:
        rag = get_rag_pipeline()
        return rag.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear session memory"""
    try:
        rag = get_rag_pipeline()
        cleared = rag.clear_memory(session_id)
        return {"message": "Session cleared" if cleared else "Session not found", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-gemini")
async def test_gemini():
    """Debug endpoint: test Gemini API directly"""
    import os
    from app.services.gemini_service import GeminiService
    
    api_key = os.getenv("GOOGLE_API_KEY", "NOT_SET")
    key_preview = f"{api_key[:10]}...{api_key[-4:]}" if len(api_key) > 14 else "TOO_SHORT"
    
    svc = GeminiService()
    
    results = []
    for model_name, model in svc.models:
        try:
            import asyncio
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda m=model: m.generate_content("Say hello in 3 words")
            )
            results.append({"model": model_name, "status": "OK", "response": response.text[:100]})
        except Exception as e:
            results.append({"model": model_name, "status": "ERROR", "error": str(e)[:300]})
    
    return {
        "api_key_preview": key_preview,
        "models_available": len(svc.models),
        "results": results
    }
