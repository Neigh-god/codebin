import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./codebin.db")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class SnippetModel(Base):
    __tablename__ = "snippets"

    id = Column(String, primary_key=True, default=lambda: __import__('shortuuid').uuid())
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=True)
    code = Column(Text, nullable=False)
    language = Column(String, default="text")
    expiry_type = Column(String, nullable=False)  # 'time', 'view_once', 'never'
    expires_at = Column(DateTime, nullable=True)
    view_count = Column(Integer, default=0)
    max_views = Column(Integer, nullable=True)
    password_hash = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
