"""
Google Gemini Service - 100% FREE
Limits: 15 requests/min, 1500 requests/day
No credit card required!
"""

import google.generativeai as genai
import os
import time
import asyncio
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
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "PLACEHOLDER":
            print("⚠️ GOOGLE_API_KEY not found or is PLACEHOLDER. Gemini will NOT work.")
            self.model = None
            self.request_times: deque = deque(maxlen=10)
            return
        
        genai.configure(api_key=api_key)
        
        # Try gemini-2.0-flash first, fall back to 1.5-flash
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            print("✅ Google Gemini 2.0 Flash initialized (FREE)")
        except Exception as e:
            print(f"⚠️ gemini-2.0-flash unavailable ({e}), falling back to gemini-1.5-flash")
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("✅ Google Gemini 1.5 Flash initialized (FREE - 15 RPM)")
        
        # Track requests — keep under 10 RPM to be safe (limit is 15)
        self.request_times: deque = deque(maxlen=10)
    
    async def _check_rate_limit(self):
        """
        Ensure we stay well under 15 RPM.
        We self-limit to ~10 RPM to leave headroom.
        Also enforces a minimum 4-second gap between requests.
        """
        now = datetime.now()
        
        # Remove requests older than 60 seconds
        while self.request_times and (now - self.request_times[0]) > timedelta(seconds=60):
            self.request_times.popleft()
        
        # If we've made 10+ requests in the last minute, wait for the oldest to expire
        if len(self.request_times) >= 10:
            oldest = self.request_times[0]
            wait_seconds = 60 - (now - oldest).total_seconds() + 2  # +2s safety buffer
            if wait_seconds > 0:
                print(f"⏳ Self rate-limiting. Waiting {wait_seconds:.1f}s...")
                await asyncio.sleep(wait_seconds)
        
        # Enforce minimum 4-second gap between requests
        if self.request_times:
            last_request = self.request_times[-1]
            elapsed = (now - last_request).total_seconds()
            if elapsed < 4:
                gap = 4 - elapsed
                print(f"⏳ Minimum gap. Waiting {gap:.1f}s...")
                await asyncio.sleep(gap)
        
        # Record this request
        self.request_times.append(datetime.now())
    
    async def generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini with robust rate-limit handling.
        Retries with exponential backoff + long waits for 429 errors.
        """
        if self.model is None:
            return "AI engine is not configured. Please set the GOOGLE_API_KEY environment variable on the server."
        
        max_retries = 4
        
        for attempt in range(max_retries):
            # Enforce rate limit before each attempt
            await self._check_rate_limit()
            
            try:
                response = await asyncio.get_event_loop().run_in_executor(
                    None, lambda: self.model.generate_content(prompt)
                )
                return response.text
            
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Gemini API Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                
                is_rate_limit = any(kw in error_msg.lower() for kw in [
                    "rate", "429", "resource", "exhausted", "quota", "too many"
                ])
                
                if is_rate_limit:
                    if attempt < max_retries - 1:
                        # Exponential backoff: 15s, 30s, 60s
                        wait_time = 15 * (2 ** attempt)
                        print(f"⏳ Rate limited by Google (429). Waiting {wait_time}s before retry {attempt+2}...")
                        await asyncio.sleep(wait_time)
                        continue
                    # All retries exhausted
                    return (
                        "The AI engine is temporarily rate-limited by Google's free tier (15 requests/minute). "
                        "Please wait about 60 seconds and try again. This is a limitation of the free Gemini API."
                    )
                
                # Non-rate-limit errors — shorter retry
                if attempt < max_retries - 1:
                    wait_time = 5 * (attempt + 1)
                    print(f"⏳ Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                
                return f"AI engine error: {error_msg[:150]}. Please try again."
        
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
        history_text = ""
        if conversation_history:
            history_text = "\n".join([
                f"{msg['role'].capitalize()}: {msg['content']}" 
                for msg in conversation_history[-5:]
            ])
        
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
- Use markdown formatting (bold, lists, etc.) when it improves readability
- Don't make up information
- If suggesting products, mention their source

ANSWER:"""

        return await self.generate_response(prompt)
    
    def get_stats(self) -> Dict:
        """Get service statistics"""
        return {
            "model": "gemini-2.0-flash" if self.model else "NOT_CONFIGURED",
            "requests_last_minute": len(self.request_times),
            "rate_limit": "10 RPM self-limited (Google max: 15 RPM)",
            "cost": "$0.00",
            "status": "ready" if self.model else "no_api_key"
        }
