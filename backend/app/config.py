import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    ENV = os.getenv("APP_ENV", "development").lower()
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))
    RESET_TOKEN_EXPIRES_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRES_MINUTES", "30"))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]

    @classmethod
    def validate(cls):
        if cls.ENV == "production":
            missing = [name for name in ("DATABASE_URL", "SECRET_KEY", "JWT_SECRET_KEY") if not os.getenv(name)]
            if missing:
                raise RuntimeError(f"Missing required production environment variables: {', '.join(missing)}")
            if len(cls.SECRET_KEY) < 32 or len(cls.JWT_SECRET_KEY) < 32:
                raise RuntimeError("SECRET_KEY and JWT_SECRET_KEY must each be at least 32 characters in production")
