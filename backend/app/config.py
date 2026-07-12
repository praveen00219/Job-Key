from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings — override any of these via environment variables.

    DATABASE_URL defaults to a local SQLite file for zero-install dev;
    point it at Postgres (postgresql+psycopg://…) for staging/production
    per the PRD's target stack.
    """

    database_url: str = "sqlite:///./jobkey.db"
    jwt_secret: str = "dev-only-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 12
    # PRD: account locks after too many failed logins (30-minute lockout)
    max_login_attempts: int = 5
    lockout_minutes: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
