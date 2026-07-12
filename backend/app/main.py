from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models  # noqa: F401 — registers models on Base.metadata
from .database import Base, engine
from .routers import agencies, applications, auth, candidates, companies, invoices, notifications, offers, submissions, vacancies

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobKey API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
