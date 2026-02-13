"""
Google Gemini Service - 100% FREE
Uses gemini-1.5-flash for highest free-tier rate limit (15 RPM)
No credit card required!
"""

import google.generativeai as genai
import os
import asyncio
from datetime import datetime, timedelta
from collections import deque
from typing import List, Dict, Optional

class GeminiService:
    """
    FREE Google Gemini API Service
    
    Uses gemini-1.5-flash for best free-tier limits:
    - 15 requests per minute (RPM)
    - 1500 requests per day (RPD)
    - 1 million tokens per minute
    
    Self-limits to 6 RPM with 8-second gaps for safety.
    """
    
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "PLACEHOLDER":
            print("⚠️ GOOGLE_API_KEY not found or is PLACEHOLDER. Gemini will NOT work.")
            self.model = None
            self.model_name = "NOT_CONFIGURED"
            self.request_times: deque = deque(maxlen=6)
            return
        
        genai.configure(api_key=api_key)
        
        # Use gemini-1.5-flash — it has the HIGHEST free-tier RPM (15 RPM)
        # gemini-2.0-flash only gets 10 RPM on free tier
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.model_name = 'gemini-1.5-flash'
            print("✅ Google Gemini 1.5 Flash initialized (FREE - 15 RPM)")
        except Exception as e:
            print(f"❌ Failed to initialize Gemini: {e}")
            self.model = None
            self.model_name = "FAILED"
        
        # Self-limit to 6 RPM (well under Google's 15 RPM limit)
        self.request_times: deque = deque(maxlen=6)
        self._last_request_time = None
    
    async def _check_rate_limit(self):
        """
        Aggressive rate limiting to prevent 429 errors:
        - Max 6 requests per minute (Google allows 15)
        - Minimum 8-second gap between any two requests
        """
        now = datetime.now()
        
        # Remove requests older than 60 seconds
        while self.request_times and (now - self.request_times[0]) > timedelta(seconds=60):
            self.request_times.popleft()
        
        # If we've made 6+ requests in the last minute, wait
        if len(self.request_times) >= 6:
            oldest = self.request_times[0]
            wait_seconds = 62 - (now - oldest).total_seconds()  # 62s for safety
            if wait_seconds > 0:
                print(f"⏳ Self rate-limiting ({len(self.request_times)} reqs in last min). Waiting {wait_seconds:.0f}s...")
                await asyncio.sleep(wait_seconds)
        
        # Enforce minimum 8-second gap between any two requests
        if self._last_request_time:
            elapsed = (now - self._last_request_time).total_seconds()
            if elapsed < 8:
                gap = 8 - elapsed
                print(f"⏳ Min gap enforced. Waiting {gap:.1f}s...")
                await asyncio.sleep(gap)
        
        # Record this request
        self._last_request_time = datetime.now()
        self.request_times.append(datetime.now())
    
    async def generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini with robust rate-limit handling.
        """
        if self.model is None:
            return "AI engine is not configured. Please set the GOOGLE_API_KEY environment variable on the server."
        
        max_retries = 3
        
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
                print(f"❌ Gemini Error (Attempt {attempt+1}/{max_retries}): {error_msg}")
                
                is_rate_limit = any(kw in error_msg.lower() for kw in [
                    "rate", "429", "resource", "exhausted", "quota", "too many"
                ])
                
                if is_rate_limit:
                    if attempt < max_retries - 1:
                        # Long waits: 30s, then 65s (full rate limit window reset)
                        wait_time = 30 if attempt == 0 else 65
                        print(f"⏳ Rate limited (429). Waiting {wait_time}s for window reset...")
                        await asyncio.sleep(wait_time)
                        # Clear our request tracker since we waited a full window
                        self.request_times.clear()
                        continue
                    return (
                        "The AI is temporarily rate-limited by Google's free tier. "
                        "Please wait about 60 seconds and try again."
                    )
                
                # Non-rate-limit errors
                if attempt < max_retries - 1:
                    await asyncio.sleep(5)
                    continue
                
                return f"AI engine error: {error_msg[:150]}. Please try again."
        
        return "System timeout. Please wait a minute and try again."
    
    async def generate_with_context(
        self, 
        query: str, 
        context: str, 
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Generate contextual response (RAG-style)
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
            "model": self.model_name,
            "requests_last_minute": len(self.request_times),
            "rate_limit": "6 RPM self-limited (Google max: 15 RPM)",
            "cost": "$0.00",
            "status": "ready" if self.model else "no_api_key"
        }
