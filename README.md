# codeBin — Pastebin with Syntax Highlighting & Expiry

A sleek, modern code snippet sharing platform built with **FastAPI**, **React**, **Three.js**, and **ReactBits** effects. Paste code, get a clean shareable URL, and let snippets expire automatically.

## Features

- **Create Snippets** — Paste code with optional title, language selection, and expiry options
- **Syntax Highlighting** — Auto-detect language or select manually
- **Expiry Options** — 1 hour / 1 day / 1 week / 1 month / view-once / never
- **Password Protection** — Secure snippets with bcrypt-hashed passwords
- **Short URLs** — Clean shareable slugs (e.g., `/aB3xK9`)
- **Raw View & Download** — Plain text access and file downloads
- **Embed Widget** — Embed snippets in external sites
- **Public Feed** — Browse recent public snippets

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python FastAPI |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 |
| **Effects** | Three.js + ReactBits (GlitchText, ColorBends) |
| **Syntax Highlight** | PrismJS / Shiki |
| **Slug Generation** | shortuuid |
| **Password Hashing** | bcrypt |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000