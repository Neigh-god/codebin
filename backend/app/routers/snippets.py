from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from app.utils.slug import generate_slug

router = APIRouter()

class SnippetCreate(BaseModel):
    code: str
    language: str = "text"
    title: Optional[str] = None
    expiry_type: Literal["time", "view_once", "never"] = "never"
    expires_at: Optional[str] = None
    max_views: Optional[int] = None
    password: Optional[str] = None
    is_public: bool = True

@router.post("/snippets")
def create_snippet(data: SnippetCreate):
    slug = generate_slug()
    return {
        "slug": slug,
        "url": f"/{slug}",
        "message": "Snippet created (placeholder -- Supabase not connected yet)"
    }

@router.get("/snippets/{slug}")
def get_snippet(slug: str):
    return {"slug": slug, "message": "Placeholder -- Supabase not connected yet"}

@router.get("/snippets/{slug}/raw")
def get_snippet_raw(slug: str):
    return {"slug": slug, "message": "Raw placeholder"}

@router.get("/snippets/{slug}/download")
def download_snippet(slug: str):
    return {"slug": slug, "message": "Download placeholder"}
