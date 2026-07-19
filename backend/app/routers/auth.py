from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.database import async_session, UserModel
from datetime import datetime, timedelta
import jwt  # Use PyJWT instead of python-jose
import bcrypt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return int(user_id)
    except jwt.PyJWTError:
        return None

@router.post("/auth/signup")
async def signup(data: UserCreate):
    async with async_session() as session:
        result = await session.execute(select(UserModel).where(UserModel.username == data.username))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already taken")
        
        result = await session.execute(select(UserModel).where(UserModel.email == data.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user = UserModel(
            username=data.username,
            email=data.email,
            password_hash=get_password_hash(data.password)
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        token = create_access_token({"sub": str(user.id)})
        return {"access_token": token, "token_type": "bearer", "user_id": user.id, "username": user.username}

@router.post("/auth/login")
async def login(data: UserLogin):
    async with async_session() as session:
        result = await session.execute(select(UserModel).where(UserModel.username == data.username))
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        token = create_access_token({"sub": str(user.id)})
        return {"access_token": token, "token_type": "bearer", "user_id": user.id, "username": user.username}

@router.get("/auth/me")
async def get_me(token: str):
    user_id = await get_current_user(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    async with async_session() as session:
        result = await session.execute(select(UserModel).where(UserModel.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"id": user.id, "username": user.username, "email": user.email}