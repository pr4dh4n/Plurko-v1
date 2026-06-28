"""Seed the catalog from PRODUCT_TREE.

Dev convenience: creates tables if missing (Alembic is the production path) and
inserts categories/products. Idempotent — skips if a category already exists.

    cd backend && python -m app.seed
"""
import re

from sqlalchemy import func, select

from .database import Base, SessionLocal, engine
from . import models  # noqa: F401  (register models on Base)
from .models.catalog import Category, Product
from .seed_data import PRODUCT_TREE


def slugify(value: str) -> str:
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "item"


def run() -> None:
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Category.id).limit(1)):
            print("Catalog already seeded — skipping. (Drop rows to reseed.)")
            return

        used: set[str] = set()

        def uniq(name: str) -> str:
            base = slugify(name)
            s, i = base, 2
            while s in used:
                s, i = f"{base}-{i}", i + 1
            used.add(s)
            return s

        for ci, (cat_name, val) in enumerate(PRODUCT_TREE.items()):
            cat = Category(name=cat_name, slug=uniq(cat_name), sort_order=ci)
            db.add(cat)
            db.flush()
            order = 0
            if isinstance(val, list):
                for pname in val:
                    db.add(Product(name=pname, slug=uniq(pname), category_id=cat.id, sort_order=order))
                    order += 1
            else:
                for sub, products in val.items():
                    for pname in products:
                        db.add(Product(name=pname, slug=uniq(pname), category_id=cat.id, subcategory=sub, sort_order=order))
                        order += 1
        db.commit()

        n_cat = db.scalar(select(func.count(Category.id)))
        n_prod = db.scalar(select(func.count(Product.id)))
        print(f"Seeded {n_cat} categories and {n_prod} products.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
