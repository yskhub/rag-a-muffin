"""
Document Management API Endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.chroma_service import get_chroma_service
from app.utils.document_processor import DocumentProcessor
from app.models.schemas import DocumentUploadResponse, DocumentStats
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
doc_processor = DocumentProcessor(chunk_size=1000, chunk_overlap=200)

def get_chroma():
    return get_chroma_service()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a PDF document"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    try:
        chunks = doc_processor.process_pdf(content, file.filename)
        if not chunks:
            raise HTTPException(status_code=400, detail="Could not extract text")
        
        texts = [c["text"] for c in chunks]
        metadatas = [{"source": c["source"], "page": c.get("page", 0), "chunk_index": c.get("chunk_index", 0)} for c in chunks]
        ids = [f"{file.filename}_c{i}_{uuid.uuid4().hex[:8]}" for i in range(len(chunks))]
        
        get_chroma().add_documents(texts, metadatas, ids)
        pages = len(set(c.get("page", 0) for c in chunks))
        
        return DocumentUploadResponse(message="Success", filename=file.filename, pages=pages, chunks=len(chunks))
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats", response_model=DocumentStats)
async def get_document_stats():
    """Get document stats"""
    try:
        stats = get_chroma().get_stats()
        return DocumentStats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sources")
async def get_sources():
    """Get all sources"""
    try:
        sources = get_chroma().get_all_sources()
        return {"sources": sources, "count": len(sources)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/source/{source_name}")
async def delete_source(source_name: str):
    """Delete document by source"""
    try:
        count = get_chroma().delete_by_source(source_name)
        return {"message": f"Deleted {count} chunks", "source": source_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear")
async def clear_all():
    """Clear all documents"""
    try:
        get_chroma().delete_all()
        return {"message": "All documents deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
