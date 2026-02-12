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
        if not api_key or api_key == "PLACEHOLDER":
            print("⚠️ GOOGLE_API_KEY not found or is PLACEHOLDER. Gemini will NOT work.")
            self.model = None
            self.request_times: deque = deque(maxlen=15)
            return
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Try gemini-2.0-flash first (latest), fall back to 1.5-flash
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            # Quick test to see if model is accessible
            print("✅ Google Gemini 2.0 Flash initialized (FREE)")
        except Exception as e:
            print(f"⚠️ gemini-2.0-flash unavailable ({e}), falling back to gemini-1.5-flash")
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("✅ Google Gemini 1.5 Flash initialized (FREE - 15 RPM)")
        
        # Rate limiter: track last 15 requests
        self.request_times: deque = deque(maxlen=15)
    
    async def _check_rate_limit(self):
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
            wait_seconds = 60 - (now - oldest_request).total_seconds()
            if wait_seconds > 0:
                print(f"⏳ Local rate limit reached. Awaiting {wait_seconds:.1f}s...")
                import asyncio
                await asyncio.sleep(wait_seconds)
        
        # Record this request
        self.request_times.append(datetime.now())
    
    async def generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini
        Includes automatic rate limiting and retries for free tier
        """
        if self.model is None:
            return "AI engine is not configured. Please set the GOOGLE_API_KEY environment variable on the server."
        
        import asyncio
        max_retries = 3
        retry_delay = 5  # Start with 5 seconds
        
        for attempt in range(max_retries):
            # Check rate limit before making request
            await self._check_rate_limit()
            
            try:
                response = await asyncio.get_event_loop().run_in_executor(
                    None, lambda: self.model.generate_content(prompt)
                )
                return response.text
            
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                
                # Rate limit or resource exhausted
                if any(kw in error_msg.lower() for kw in ["rate", "429", "resource", "exhausted", "quota"]):
                    if attempt < max_retries - 1:
                        wait_time = retry_delay * (attempt + 1)
                        print(f"⏳ Rate limited by Google. Waiting {wait_time}s before retry...")
                        await asyncio.sleep(wait_time)
                        continue
                    return "The AI engine is temporarily rate-limited by Google. Please wait 60 seconds and try again."
                
                # Other errors - retry with backoff
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                    continue
                return f"AI engine error: {error_msg[:100]}. Please try again."
        
        return "System timeout after multiple retries. Please try again in a minute."
    
    async def generate_with_context(
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

        return await self.generate_response(prompt)
    
    def get_stats(self) -> Dict:
        """Get service statistics"""
        return {
            "model": "gemini-2.0-flash" if self.model else "NOT_CONFIGURED",
            "requests_last_minute": len(self.request_times),
            "rate_limit": "15 RPM (FREE)",
            "cost": "$0.00",
            "status": "ready" if self.model else "no_api_key"
        }
