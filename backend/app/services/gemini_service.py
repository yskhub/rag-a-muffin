"""
Google Gemini Service - 100% FREE
Dual-model fallback: tries 1.5-flash first, falls back to 2.0-flash
Each model has its own separate rate limit quota.
"""

import google.generativeai as genai
import os
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class GeminiService:
    """
    FREE Google Gemini API Service with dual-model fallback.
    
    - gemini-1.5-flash: 15 RPM free tier
    - gemini-2.0-flash: 10 RPM free tier
    
    If one model is rate-limited, automatically tries the other.
    """
    
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "PLACEHOLDER":
            print("⚠️ GOOGLE_API_KEY not found. Gemini will NOT work.")
            self.models = []
            self.model_name = "NOT_CONFIGURED"
            return
        
        genai.configure(api_key=api_key)
        
        # Initialize BOTH models — each has separate rate limits
        self.models = []
        for model_name in ['gemini-1.5-flash', 'gemini-2.0-flash']:
            try:
                model = genai.GenerativeModel(model_name)
                self.models.append((model_name, model))
                print(f"✅ {model_name} initialized")
            except Exception as e:
                print(f"⚠️ {model_name} unavailable: {e}")
        
        if not self.models:
            print("❌ No Gemini models available!")
            self.model_name = "FAILED"
        else:
            self.model_name = self.models[0][0]
            print(f"✅ Primary model: {self.model_name} ({len(self.models)} models available)")
    
    async def generate_response(self, prompt: str) -> str:
        """Generate response — tries each model, falls back on rate limit."""
        if not self.models:
            return "AI engine is not configured. Please set GOOGLE_API_KEY."
        
        last_error = ""
        
        # Try each model
        for model_name, model in self.models:
            try:
                response = await asyncio.get_event_loop().run_in_executor(
                    None, lambda m=model: m.generate_content(prompt)
                )
                self.model_name = model_name
                return response.text
            
            except Exception as e:
                error_msg = str(e)
                last_error = error_msg
                print(f"⚠️ {model_name} failed: {error_msg[:100]}")
                
                is_rate_limit = any(kw in error_msg.lower() for kw in [
                    "rate", "429", "resource", "exhausted", "quota", "too many"
                ])
                
                if is_rate_limit:
                    print(f"↪ {model_name} rate-limited, trying next model...")
                    continue  # Try next model
                else:
                    # Non-rate-limit error — still try next model
                    continue
        
        # All models failed — wait and retry the first model once
        print("⏳ All models rate-limited. Waiting 30s for one final retry...")
        await asyncio.sleep(30)
        
        try:
            first_name, first_model = self.models[0]
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda: first_model.generate_content(prompt)
            )
            self.model_name = first_name
            return response.text
        except Exception as e:
            print(f"❌ Final retry failed: {str(e)[:100]}")
            return (
                "The AI is temporarily rate-limited by Google's free tier. "
                "Please wait about 60 seconds and try again. "
                f"(Tried {len(self.models)} models)"
            )
    
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
            "available_models": [m[0] for m in self.models] if self.models else [],
            "rate_limit": "15 RPM (1.5-flash) + 10 RPM (2.0-flash)",
            "cost": "$0.00",
            "status": "ready" if self.models else "no_api_key"
        }
