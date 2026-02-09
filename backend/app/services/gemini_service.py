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
            # Fallback for initialization during setup if key isn't set yet
            print("⚠️ GOOGLE_API_KEY not found in environment. Service will require it to function.")
            api_key = "PLACEHOLDER"
        
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
