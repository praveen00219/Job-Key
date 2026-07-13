from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import models  # noqa: F401 — registers models on Base.metadata
from .routers import agencies, applications, auth, candidates, companies, invoices, notifications, offers, submissions, vacancies

# Schema is managed exclusively by Alembic (`alembic upgrade head`) — no
# create_all here, so the app can never drift ahead of the migrations.

app = FastAPI(title="JobKey API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Flatten FastAPI's validation-error list into the same `{"detail": str}`
    shape every other error uses, so the frontend's ApiError always has a
    human-readable message."""
    first = exc.errors()[0]
    loc = ".".join(str(part) for part in first["loc"] if part not in ("body", "query", "path"))
    message = f"{loc}: {first['msg']}" if loc else first["msg"]
    return JSONResponse(status_code=422, content={"detail": message})


app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(agencies.router)
app.include_router(vacancies.router)
app.include_router(candidates.router)
app.include_router(submissions.router)
app.include_router(offers.router)
app.include_router(applications.router)
app.include_router(invoices.router)
app.include_router(notifications.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
