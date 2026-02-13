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
    
    def _ensure_collection(self):
        """Ensure collection exists — auto-recover from stale references."""
        try:
            self.collection.count()
        except Exception:
            print("⚠️ Collection stale — recreating...")
            self.collection = self.client.get_or_create_collection(
                name="ecommerce_docs",
                metadata={"description": "E-commerce product documents and FAQs"}
            )
    
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
        
        self._ensure_collection()
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
        self._ensure_collection()
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
        """Clear all documents without destroying the collection."""
        try:
            self._ensure_collection()
            all_ids = self.collection.get()["ids"]
            if all_ids:
                self.collection.delete(ids=all_ids)
            print(f"✅ Database cleared ({len(all_ids)} docs removed)")
        except Exception as e:
            print(f"⚠️ Clear failed, recreating collection: {e}")
            try:
                self.client.delete_collection("ecommerce_docs")
            except Exception:
                pass
            self.collection = self.client.get_or_create_collection(
                name="ecommerce_docs",
                metadata={"description": "E-commerce product documents and FAQs"}
            )
            print("✅ Collection recreated")
    
    def delete_by_source(self, source: str) -> int:
        """Delete all documents from a specific source"""
        self._ensure_collection()
        results = self.collection.get(
            where={"source": source}
        )
        
        if results["ids"]:
            self.collection.delete(ids=results["ids"])
            return len(results["ids"])
        return 0
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        self._ensure_collection()
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
        self._ensure_collection()
        results = self.collection.get(include=["metadatas"])
        sources = set()
        for metadata in results["metadatas"]:
            if metadata and "source" in metadata:
                sources.add(metadata["source"])
        return list(sources)

_chroma_service: Optional[ChromaDBService] = None

def get_chroma_service() -> ChromaDBService:
    """Get or create ChromaDB service singleton"""
    global _chroma_service
    if _chroma_service is None:
        _chroma_service = ChromaDBService()
    return _chroma_service
