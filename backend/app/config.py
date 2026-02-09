"""
Configuration module for FREE E-commerce Chatbot
All services used are 100% FREE with no credit card required
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Google Gemini (FREE - 15 RPM)
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "PLACEHOLDER")
    
    # Supabase (FREE - 500MB)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "PLACEHOLDER")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "PLACEHOLDER")
    
    # ChromaDB (FREE - Local storage)
    CHROMA_DB_PATH: str = "./chroma_db"
    
    # Application
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Create settings instance
settings = get_settings()
