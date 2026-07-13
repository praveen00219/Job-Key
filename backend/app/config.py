from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings — override any of these via environment variables.

    DATABASE_URL defaults to a local SQLite file for zero-install dev;
    point it at Postgres (postgresql+psycopg://…) for staging/production
    per the PRD's target stack. See .env.example.
    """

    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "sqlite:///./jobkey.db"
    jwt_secret: str = "dev-only-change-me"
    jwt_algorithm: str = "HS256"
    # Short-lived access tokens + rotating refresh tokens (A1)
    jwt_expires_minutes: int = 60
    refresh_expires_days: int = 14
    verify_token_expires_hours: int = 48
    reset_token_expires_minutes: int = 60
    # Dev conveniences (dev-token lookup endpoint, console "email" delivery).
    # MUST be false in production.
    dev_mode: bool = True
    # PRD: account locks after too many failed logins (30-minute lockout)
    max_login_attempts: int = 5
    lockout_minutes: int = 30


settings = Settings()
