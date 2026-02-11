"""
FREE E-commerce Chatbot API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api import chat, documents, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FREE RAG API (Rapid Boot)...")
    # Lazy loading will happen on the first request to avoid blocking startup
    yield

app = FastAPI(title="FREE RAG API", lifespan=lifespan)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"message": "FREE RAG API Ready", "cost": "$0.00"}
