# PlurkoTech Backend

FastAPI + PostgreSQL API for the PlurkoTech Corporate IP Portal.

## Stack
- FastAPI + Uvicorn
- SQLAlchemy 2.0 (ORM) + Alembic (migrations)
- PostgreSQL 16 (local dev via Docker)

## Local dev
```bash
cd backend

# 1. Postgres (Docker)
docker compose up -d db

# 2. Python env
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env          # DATABASE_URL points at the docker db

# 3. Schema + seed
.venv/bin/alembic upgrade head        # create tables
.venv/bin/python -m app.seed          # seed catalog (6 categories, ~139 products)

# 4. Run
.venv/bin/uvicorn app.main:app --reload --port 8001
# http://127.0.0.1:8001/docs  (interactive API docs)
```

## API (current — catalog, read-only)
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | liveness |
| GET | `/api/categories` | published categories + product counts |
| GET | `/api/categories/{slug}` | a category with its products |
| GET | `/api/products?category=&q=&limit=&offset=` | list/filter/search products |
| GET | `/api/products/{slug}` | product detail + specs |

## Structure
```
app/
  main.py        FastAPI app + CORS
  config.py      env settings (DATABASE_URL, CORS_ORIGINS)
  database.py    engine / session / Base / get_db
  models/        SQLAlchemy models (catalog: Category, Product, ProductSpec)
  schemas/       Pydantic response models
  routers/       catalog routes
  seed.py        idempotent catalog seeder
  seed_data.py   PRODUCT_TREE source data
alembic/         migrations (alembic upgrade head)
docker-compose.yml  local Postgres
```

## Migrations
```bash
.venv/bin/alembic revision --autogenerate -m "describe change"
.venv/bin/alembic upgrade head
```

## Status / roadmap
- ✅ Catalog read API (this slice)
- ⬜ Inquiry & lead capture (Ticket IDs) → wire the site's inquiry form
- ⬜ Auth + RBAC (Guest / Registered / Admin)
- ⬜ Admin dashboard + CMS (manage catalog & inquiry tickets)

Local-dev only for now (Postgres in Docker on the dev machine). Production later:
managed Postgres (RDS) + the API behind nginx on EC2 (`/api`), frontend on S3/CloudFront.
