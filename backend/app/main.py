from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import catalog

app = FastAPI(title="PlurkoTech API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "service": "plurkotech-api"}
