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
