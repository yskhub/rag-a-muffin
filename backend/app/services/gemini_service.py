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
        max_retries = 3
        retry_delay = 2 # Seconds
        
        for attempt in range(max_retries):
            # Check rate limit before making request
            await self._check_rate_limit()
            
            try:
                # generate_content is synchronous in the SDK normally, but we wrap it
                import asyncio
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(None, lambda: self.model.generate_content(prompt))
                return response.text
            
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                
                # If it's a rate limit error, wait and retry
                if "rate" in error_msg.lower() or "429" in error_msg:
                    if attempt < max_retries - 1:
                        wait_time = retry_delay * (attempt + 1)
                        print(f"⏳ External Rate Limit (Google). Retrying in {wait_time}s...")
                        import asyncio
                        await asyncio.sleep(wait_time)
                        continue
                    return f"Google Gemini is currently rate-limited (Attempt {attempt+1}). Please wait a minute."
                
                # If it's a quota error, return immediately
                if "quota" in error_msg.lower():
                    return "I've reached my daily limit. Please try again tomorrow!"
                
                # Other errors
                if attempt < max_retries - 1:
                    import asyncio
                    await asyncio.sleep(retry_delay)
                    continue
                return "I'm having trouble responding right now. Please try again."
        
        return "System timeout. Please try again."
    
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
            "model": "gemini-1.5-flash",
            "requests_last_minute": len(self.request_times),
            "rate_limit": "15 RPM (FREE)",
            "cost": "$0.00"
        }
