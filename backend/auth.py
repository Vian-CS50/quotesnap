"""
QuoteSnap Authentication Module
SQLite + SQLAlchemy + bcrypt + JWT + TOTP 2FA
All auth state is server-side — no localStorage bypass possible.
"""

from __future__ import annotations

import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import pyotp
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field, validator
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    select,
    func,
)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "FATAL: JWT_SECRET environment variable is not set. "
        "Set a strong secret (e.g. openssl rand -base64 32) and add it to your .env file."
    )
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
REFRESH_TOKEN_EXPIRE_DAYS = 30

FREE_QUOTA = 3

# SQLite async path
DB_PATH = os.getenv("AUTH_DB_PATH", os.path.join(os.path.dirname(__file__), "quotesnap_auth.db"))
ASYNC_DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire, "type": "refresh", "jti": secrets.token_urlsafe(16)},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


# ---------------------------------------------------------------------------
# SQLAlchemy models
# ---------------------------------------------------------------------------
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_subscribed = Column(Boolean, default=False)
    subscription_tier = Column(String, default="free")  # free, pro, elite
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    # Custom pricing model (JSON string for elite users)
    custom_pricing_model = Column(String, nullable=True)
    # 2FA
    totp_secret = Column(String, nullable=True)
    totp_enabled = Column(Boolean, default=False)
    # Quota tracking
    quotes_used = Column(Integer, default=0)
    quotes_reset_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True)
    token_jti = Column(String, unique=True, index=True)
    user_id = Column(Integer, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class QuoteUsage(Base):
    __tablename__ = "quote_usage"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)


class StripeEvent(Base):
    __tablename__ = "stripe_events"

    id = Column(Integer, primary_key=True)
    stripe_event_id = Column(String, unique=True, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    processed_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, nullable=True)
    details = Column(String, nullable=True)


# ---------------------------------------------------------------------------
# Async DB engine + session
# ---------------------------------------------------------------------------
async_engine = create_async_engine(ASYNC_DB_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=100)
    business_name: Optional[str] = Field(None, max_length=200)
    age_confirmation: bool = Field(..., description="User confirms they are 18+ or have guardian consent")

    @validator("password")
    def password_strength(cls, v):
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v

    @validator("age_confirmation")
    def must_confirm_age(cls, v):
        if not v:
            raise ValueError("You must confirm you are 18+ or have guardian consent to use QuoteSnap")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    requires_2fa: bool = False


class TwoFASetupResponse(BaseModel):
    secret: str
    uri: str
    qr_code: Optional[str] = None


class TwoFAVerifyRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)


class TwoFALoginRequest(BaseModel):
    email: EmailStr
    password: str
    totp_code: str = Field(..., min_length=6, max_length=6)


class UserProfile(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    business_name: Optional[str]
    is_subscribed: bool
    subscription_tier: str
    totp_enabled: bool
    quotes_used: int
    quotes_remaining: int
    quotes_reset_at: Optional[datetime]
    has_custom_pricing: bool


class CustomPricingModel(BaseModel):
    """User-defined pricing model for elite tier."""
    labour_rates: dict = Field(default_factory=dict, description="e.g. {'general': 65, 'skilled': 85, 'excavator': 120}")
    material_markup_percent: float = Field(default=0.0, ge=0, le=200, description="Markup % on materials")
    contingency_percent: float = Field(default=10.0, ge=0, le=50, description="Default contingency %")
    job_type_templates: dict = Field(default_factory=dict, description="e.g. {'Deck Construction': {'crew_size': 2, 'daily_rate': 750, 'markup': 15}}")
    default_crew_size: int = Field(default=2, ge=1, le=10)
    gst_included_in_rates: bool = Field(default=False, description="Whether entered rates already include GST")
    geographic_factor: float = Field(default=1.0, ge=0.5, le=3.0, description="Multiplier for regional pricing adjustments")
    notes: str = Field(default="", max_length=1000, description="Internal notes about this pricing model")


# ---------------------------------------------------------------------------
# Auth dependency
# ---------------------------------------------------------------------------
security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency: extract and validate JWT, return User row."""
    token = None
    if credentials:
        token = credentials.credentials
    else:
        # Fallback to cookie
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user


async def get_current_user_optional(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Optional auth — returns None if no valid token."""
    try:
        return await get_current_user(request, credentials, db)
    except HTTPException:
        return None


# ---------------------------------------------------------------------------
# 2FA helpers
# ---------------------------------------------------------------------------
def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str, issuer: str = "QuoteSnap") -> str:
    return pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer)


def verify_totp(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code, valid_window=1)


# ---------------------------------------------------------------------------
# Quota helpers
# ---------------------------------------------------------------------------
async def get_quota_status(user: User) -> dict:
    """Return remaining quotes and whether user can generate."""
    # Elite and Pro both get unlimited; free gets 3 total lifetime (not per month)
    is_paid = user.subscription_tier in ("pro", "elite") or user.is_subscribed
    remaining = max(0, FREE_QUOTA - (user.quotes_used or 0)) if not is_paid else 9999
    return {
        "used": user.quotes_used or 0,
        "remaining": remaining,
        "total": FREE_QUOTA,
        "is_subscribed": is_paid,
        "subscription_tier": user.subscription_tier,
        "can_generate": is_paid or remaining > 0,
    }


async def increment_quote_usage(user: User, db: AsyncSession, ip_address: Optional[str] = None):
    """Record a quote generation against the user's quota."""
    user.quotes_used = (user.quotes_used or 0) + 1
    usage = QuoteUsage(user_id=user.id, ip_address=ip_address)
    db.add(usage)
    await db.commit()
    await db.refresh(user)


# ---------------------------------------------------------------------------
# Subscription helpers
# ---------------------------------------------------------------------------
async def activate_subscription(user: User, db: AsyncSession, stripe_sub_id: str, tier: str = "pro"):
    valid_tiers = {"free", "pro", "elite"}
    user.is_subscribed = True
    user.subscription_tier = tier if tier in valid_tiers else "pro"
    user.stripe_subscription_id = stripe_sub_id
    await db.commit()
    await db.refresh(user)


async def deactivate_subscription(user: User, db: AsyncSession):
    user.is_subscribed = False
    user.subscription_tier = "free"
    user.stripe_subscription_id = None
    await db.commit()
    await db.refresh(user)
