from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import snippets
from app.database import init_db

app = FastAPI(title="codeBin API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def startup():
    await init_db()

app.include_router(snippets.router, prefix="/api", tags=["snippets"])

@app.get("/health")
def health_check():
    return {"status": "ok", "database": "sqlite"}
