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
            answer = self.gemini.generate_with_context(
                query=query,
                context=context if context else "No relevant context found.",
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
        """Extract and format context from ChromaDB results"""
        if not search_results.get('documents') or not search_results['documents'][0]:
            logger.info("No documents found in search results")
            return ""
        
        contexts = []
        documents = search_results['documents'][0]
        metadatas = search_results['metadatas'][0]
        distances = search_results.get('distances', [[]])[0]
        
        for i, (doc, metadata) in enumerate(zip(documents, metadatas)):
            # Check relevance (lower distance = more relevant)
            distance = distances[i] if i < len(distances) else 1
            relevance = 1 - distance
            
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
            content = msg['content'][:200]
            formatted.append(f"{role}: {content}")
        
        return "\n".join(formatted)
    
    def _format_sources(self, search_results: Dict) -> List[Dict]:
        """Format sources for frontend display"""
        sources = []
        
        if not search_results.get('metadatas') or not search_results['metadatas'][0]:
            return sources
        
        metadatas = search_results['metadatas'][0]
        distances = search_results.get('distances', [[]])[0]
        
        for i, metadata in enumerate(metadatas):
            distance = distances[i] if i < len(distances) else 0
            relevance = round((1 - distance) * 100, 2)
            
            sources.append({
                "source": metadata.get('source', 'Unknown'),
                "page": metadata.get('page'),
                "relevance": max(0, relevance)
            })
        
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

_rag_pipeline: Optional[FreeRAGPipeline] = None

def get_rag_pipeline() -> FreeRAGPipeline:
    """Get or create RAG pipeline singleton"""
    global _rag_pipeline
    if _rag_pipeline is None:
        _rag_pipeline = FreeRAGPipeline()
    return _rag_pipeline
