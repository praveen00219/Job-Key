from typing import Generic, TypeVar

from fastapi import Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import Select

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """Standard list envelope for every collection endpoint."""

    items: list[T]
    total: int
    page: int
    size: int


class PageParams:
    """Shared `?page=&size=` query parameters (FastAPI dependency)."""

    def __init__(
        self,
        page: int = Query(1, ge=1),
        size: int = Query(50, ge=1, le=100),
    ):
        self.page = page
        self.size = size


def paginate(db: Session, stmt: Select, params: PageParams) -> tuple[list, int]:
    """Run `stmt` with limit/offset and return (rows, total)."""
    total = db.scalar(select(func.count()).select_from(stmt.order_by(None).subquery())) or 0
    rows = db.scalars(stmt.limit(params.size).offset((params.page - 1) * params.size)).all()
    return rows, total
