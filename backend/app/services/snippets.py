from sqlalchemy import select, update, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session, SnippetModel
from datetime import datetime
import bcrypt


async def get_snippet_by_slug(slug: str):
    async with async_session() as session:
        result = await session.execute(select(SnippetModel).where(SnippetModel.slug == slug))
        return result.scalar_one_or_none()


async def create_snippet(data: dict):
    async with async_session() as session:
        snippet = SnippetModel(**data)
        session.add(snippet)
        await session.commit()
        await session.refresh(snippet)
        return snippet


async def increment_view_count(slug: str):
    async with async_session() as session:
        await session.execute(
            update(SnippetModel)
            .where(SnippetModel.slug == slug)
            .values(view_count=SnippetModel.view_count + 1)
        )
        await session.commit()


async def get_snippets_by_user(user_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(SnippetModel)
            .where(SnippetModel.user_id == user_id)
            .order_by(desc(SnippetModel.created_at))
        )
        return result.scalars().all()


async def delete_expired_snippets():
    async with async_session() as session:
        now = datetime.utcnow()
        result = await session.execute(
            select(SnippetModel).where(
                SnippetModel.expiry_type == "time",
                SnippetModel.expires_at < now
            )
        )
        expired = result.scalars().all()
        for snip in expired:
            await session.delete(snip)
        await session.commit()
        return len(expired)