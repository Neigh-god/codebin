from fastapi import APIRouter, HTTPException, Response, Query
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime, timedelta
from app.utils.slug import generate_slug
from app.database import init_db, async_session, SnippetModel
from app.services.snippets import get_snippet_by_slug, create_snippet, increment_view_count
import bcrypt
from sqlalchemy import select, desc

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

def generate_unique_slug(max_retries: int = 5) -> str:
    import shortuuid
    for _ in range(max_retries):
        slug = shortuuid.ShortUUID().random(length=6)
        import asyncio
        existing = asyncio.get_event_loop().run_until_complete(get_snippet_by_slug(slug))
        if not existing:
            return slug
    raise HTTPException(status_code=500, detail="Could not generate unique slug")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def calculate_expiry(expiry_type: str, expiry_value: Optional[str]) -> Optional[datetime]:
    if expiry_type == "never":
        return None
    elif expiry_type == "view_once":
        return None
    elif expiry_type == "time" and expiry_value:
        now = datetime.utcnow()
        if expiry_value == "1h":
            return now + timedelta(hours=1)
        elif expiry_value == "1d":
            return now + timedelta(days=1)
        elif expiry_value == "1w":
            return now + timedelta(weeks=1)
        elif expiry_value == "1m":
            return now + timedelta(days=30)
    return None

# ========== RECENT SNIPPETS — MUST BE BEFORE /{slug} ROUTES ==========
@router.get("/snippets/recent")
async def get_recent_snippets(limit: int = Query(10, ge=1, le=50)):
    async with async_session() as session:
        now = datetime.utcnow()
        result = await session.execute(
            select(SnippetModel)
            .where(SnippetModel.password_hash == None)
            .where(SnippetModel.is_public == True)
            .where(
                (SnippetModel.expires_at == None) | (SnippetModel.expires_at > now)
            )
            .order_by(desc(SnippetModel.created_at))
            .limit(limit)
        )
        snippets = result.scalars().all()
        
        return [
            {
                "slug": s.slug,
                "title": s.title,
                "language": s.language,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "view_count": s.view_count,
                "expiry_type": s.expiry_type,
            }
            for s in snippets
        ]

# ========== EMBED ROUTE — MUST BE BEFORE /{slug} ROUTES ==========
@router.get("/snippets/{slug}/embed")
async def embed_snippet(slug: str):
    snippet = await get_snippet_by_slug(slug)
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    # Check expiry
    if snippet.expiry_type == "time" and snippet.expires_at:
        if snippet.expires_at < datetime.utcnow():
            raise HTTPException(status_code=410, detail="Snippet has expired")
    
    if snippet.password_hash:
        raise HTTPException(status_code=403, detail="Password protected snippets cannot be embedded")
    
    # Language colors
    lang_colors = {
        "python": "#306998", "javascript": "#f7df1e", "typescript": "#3178c6",
        "html": "#e34c26", "css": "#264de4", "json": "#888888",
        "sql": "#f29111", "bash": "#4eaa25", "rust": "#dea584",
        "go": "#00add8", "text": "#888888",
    }
    color = lang_colors.get(snippet.language, "#888888")
    
    # Build lines HTML separately
    lines_html = ''.join(
        f'<div class="line"><span class="line-num">{i+1}</span><span class="line-content">{line}</span></div>'
        for i, line in enumerate(snippet.code.split('\n'))
    )
    
    # Use .format() instead of f-string to avoid curly brace conflicts
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            background: #0d1117;
            color: #c9d1d9;
            padding: 16px;
            line-height: 1.6;
        }}
        .header {{
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #30363d;
        }}
        .lang-badge {{
            background: {color}22;
            color: {color};
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }}
        .title {{
            font-size: 13px;
            color: #8b949e;
            flex: 1;
        }}
        .code {{
            font-size: 13px;
            overflow-x: auto;
            white-space: pre;
        }}
        .line {{ display: flex; }}
        .line-num {{
            color: #484f58;
            text-align: right;
            padding-right: 16px;
            min-width: 32px;
            user-select: none;
        }}
        .line-content {{ color: #c9d1d9; }}
        .footer {{
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #30363d;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .footer a {{
            color: #58a6ff;
            text-decoration: none;
            font-size: 11px;
        }}
        .footer a:hover {{ text-decoration: underline; }}
        .views {{ color: #8b949e; font-size: 11px; }}
    </style>
</head>
<body>
    <div class="header">
        <span class="lang-badge">{language}</span>
        <span class="title">{title}</span>
    </div>
    <div class="code">
        {lines}
    </div>
    <div class="footer">
        <a href="http://localhost:5173/s/{slug}" target="_blank">View on codeBin →</a>
        <span class="views">{views} views</span>
    </div>
</body>
</html>""".format(
        title=snippet.title or 'Untitled',
        color=color,
        language=snippet.language,
        lines=lines_html,
        slug=slug,
        views=snippet.view_count
    )
    
    return Response(content=html, media_type="text/html")

@router.post("/snippets")
async def create_snippet_endpoint(data: SnippetCreate):
    from app.services.snippets import get_snippet_by_slug
    
    slug = generate_slug()
    while await get_snippet_by_slug(slug):
        slug = generate_slug()
    
    expires_at = calculate_expiry(data.expiry_type, data.expires_at)
    max_views = 1 if data.expiry_type == "view_once" else data.max_views
    
    password_hash = None
    if data.password:
        password_hash = hash_password(data.password)
    
    snippet_data = {
        "slug": slug,
        "title": data.title,
        "code": data.code,
        "language": data.language,
        "expiry_type": data.expiry_type,
        "expires_at": expires_at,
        "max_views": max_views,
        "password_hash": password_hash,
        "is_public": data.is_public,
    }
    
    snippet = await create_snippet(snippet_data)
    
    return {
        "slug": slug,
        "url": f"/s/{slug}",
        "message": "Snippet created successfully"
    }

@router.get("/snippets/{slug}")
async def get_snippet(slug: str, password: Optional[str] = None):
    snippet = await get_snippet_by_slug(slug)
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    if snippet.expiry_type == "time" and snippet.expires_at:
        if snippet.expires_at < datetime.utcnow():
            raise HTTPException(status_code=410, detail="Snippet has expired")
    
    if snippet.expiry_type == "view_once":
        if snippet.view_count >= snippet.max_views:
            raise HTTPException(status_code=410, detail="Snippet has been viewed")
    
    if snippet.password_hash:
        if not password:
            raise HTTPException(status_code=403, detail="Password required")
        if not verify_password(password, snippet.password_hash):
            raise HTTPException(status_code=403, detail="Invalid password")
    
    await increment_view_count(slug)
    
    return {
        "slug": snippet.slug,
        "title": snippet.title,
        "code": snippet.code,
        "language": snippet.language,
        "created_at": snippet.created_at.isoformat() if snippet.created_at else None,
        "view_count": snippet.view_count + 1,
    }

@router.get("/snippets/{slug}/raw")
async def get_snippet_raw(slug: str):
    snippet = await get_snippet_by_slug(slug)
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    return Response(content=snippet.code, media_type="text/plain")

@router.get("/snippets/{slug}/download")
async def download_snippet(slug: str):
    snippet = await get_snippet_by_slug(slug)
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    ext = snippet.language if snippet.language != "text" else "txt"
    filename = f"{snippet.title or 'snippet'}.{ext}"
    
    return Response(
        content=snippet.code,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )