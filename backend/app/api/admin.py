"""
Admin API Endpoints
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
    """Get admin dashboard info"""
    try:
        rag = get_rag_pipeline()
        stats = rag.get_stats()
        return {
            "overview": {
                "total_documents": stats["chroma"]["total_documents"],
                "active_sessions": stats["memory"]["active_sessions"]
            },
            "cost": "$0.00"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/faqs/bulk")
async def add_faqs(faqs: List[dict]):
    """Add FAQs to vector store"""
    try:
        texts = [f"Q: {f['question']}\nA: {f['answer']}" for f in faqs]
        metadatas = [{"source": "FAQ", "type": "faq"} for _ in faqs]
        ids = [f"faq_{uuid.uuid4().hex[:8]}" for _ in faqs]
        chroma.add_documents(texts, metadatas, ids)
        return {"count": len(faqs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed-sample-data")
async def seed_data():
    """Seed sample data"""
    try:
        sample = [
            {"text": "Wireless Bluetooth Headphones Pro - $79.99. 30h battery.", "source": "Catalog", "category": "electronics"},
            {"text": "Return Policy: 30-day returns on unused items.", "source": "FAQ", "category": "policies"},
            {"text": "Shipping: Free on orders over $50.", "source": "FAQ", "category": "shipping"}
        ]
        texts = [i["text"] for i in sample]
        metadatas = [{"source": i["source"], "category": i["category"]} for i in sample]
        ids = [f"sample_{i}_{uuid.uuid4().hex[:4]}" for i in range(len(sample))]
        chroma.add_documents(texts, metadatas, ids)
        return {"items_added": len(sample)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
