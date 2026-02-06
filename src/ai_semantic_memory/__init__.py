"""
ai-semantic-memory: Reusable semantic memory for LangGraph agents.
"""

from ai_semantic_memory.schema import (
    Durability,
    Memory,
    MemoryCreate,
    MemoryQuery,
    MemorySource,
    MemoryUpdate,
)
from ai_semantic_memory.store import build_postgres_store

__version__ = "0.1.0"

__all__ = [
    # Store
    "build_postgres_store",
    # Schema
    "Memory",
    "MemoryCreate",
    "MemoryUpdate",
    "MemoryQuery",
    "Durability",
    "MemorySource",
]
