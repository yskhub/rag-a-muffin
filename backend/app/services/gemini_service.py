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
    
    Uses gemini-1.5-flash (15 RPM free tier).
    Strategy: Send immediately, only throttle on actual 429 errors.
    """
    
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "PLACEHOLDER":
            print("⚠️ GOOGLE_API_KEY not found. Gemini will NOT work.")
            self.model = None
            self.model_name = "NOT_CONFIGURED"
            return
        
        genai.configure(api_key=api_key)
        
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.model_name = 'gemini-1.5-flash'
            print("✅ Gemini 1.5 Flash initialized (FREE - 15 RPM)")
        except Exception as e:
            print(f"❌ Gemini init failed: {e}")
            self.model = None
            self.model_name = "FAILED"
        
        self._rate_limited_until = None
    
    async def _wait_if_rate_limited(self):
        """Only wait if we were recently rate-limited by Google."""
        if self._rate_limited_until:
            now = datetime.now()
            if now < self._rate_limited_until:
                wait = (self._rate_limited_until - now).total_seconds()
                print(f"⏳ Cooling down for {wait:.0f}s after previous rate limit...")
                await asyncio.sleep(wait)
            self._rate_limited_until = None
    
    async def generate_response(self, prompt: str) -> str:
        """Generate response — sends immediately, retries on 429."""
        if self.model is None:
            return "AI engine is not configured. Please set the GOOGLE_API_KEY environment variable on the server."
        
        # If we were recently rate-limited, wait first
        await self._wait_if_rate_limited()
        
        max_retries = 2
        
        for attempt in range(max_retries):
            try:
                response = await asyncio.get_event_loop().run_in_executor(
                    None, lambda: self.model.generate_content(prompt)
                )
                return response.text
            
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Gemini Error (Attempt {attempt+1}): {error_msg[:100]}")
                
                is_rate_limit = any(kw in error_msg.lower() for kw in [
                    "rate", "429", "resource", "exhausted", "quota", "too many"
                ])
                
                if is_rate_limit and attempt < max_retries - 1:
                    # Wait 30 seconds and try once more
                    print("⏳ Rate limited. Waiting 30s...")
                    self._rate_limited_until = datetime.now() + timedelta(seconds=60)
                    await asyncio.sleep(30)
                    continue
                elif is_rate_limit:
                    self._rate_limited_until = datetime.now() + timedelta(seconds=60)
                    return (
                        "The AI is temporarily rate-limited by Google's free tier. "
                        "Please wait about 60 seconds and try again."
                    )
                
                # Non-rate-limit error
                if attempt < max_retries - 1:
                    await asyncio.sleep(3)
                    continue
                return f"AI error: {error_msg[:150]}. Please try again."
        
        return "Request failed. Please try again."
    
    async def generate_with_context(
        self, 
        query: str, 
        context: str, 
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """Generate contextual response (RAG-style)"""
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
- Use markdown formatting (bold, lists) when helpful
- Don't make up information

ANSWER:"""

        return await self.generate_response(prompt)
    
    def get_stats(self) -> Dict:
        return {
            "model": self.model_name,
            "rate_limit": "15 RPM (Google free tier)",
            "cost": "$0.00",
            "status": "ready" if self.model else "no_api_key"
        }
