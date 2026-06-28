from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models.catalog import Category, Product
from ..schemas.catalog import (
    CategoryOut,
    CategoryWithProductsOut,
    ProductOut,
    ProductDetailOut,
)

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    """Published categories with a live product count."""
    counts = dict(
        db.execute(
            select(Product.category_id, func.count(Product.id))
            .where(Product.is_published.is_(True))
            .group_by(Product.category_id)
        ).all()
    )
    cats = db.scalars(
        select(Category).where(Category.is_published.is_(True)).order_by(Category.sort_order, Category.name)
    ).all()
    return [
        CategoryOut(id=c.id, name=c.name, slug=c.slug, product_count=counts.get(c.id, 0))
        for c in cats
    ]


@router.get("/categories/{slug}", response_model=CategoryWithProductsOut)
def category_detail(slug: str, db: Session = Depends(get_db)):
    cat = db.scalar(select(Category).where(Category.slug == slug, Category.is_published.is_(True)))
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    products = db.scalars(
        select(Product)
        .where(Product.category_id == cat.id, Product.is_published.is_(True))
        .order_by(Product.sort_order, Product.name)
    ).all()
    return CategoryWithProductsOut(
        id=cat.id, name=cat.name, slug=cat.slug, product_count=len(products), products=products
    )


@router.get("/products", response_model=list[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    category: str | None = Query(default=None, description="Filter by category slug"),
    q: str | None = Query(default=None, description="Search by name"),
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0, ge=0),
):
    stmt = select(Product).where(Product.is_published.is_(True))
    if category:
        cat = db.scalar(select(Category).where(Category.slug == category))
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        stmt = stmt.where(Product.category_id == cat.id)
    if q:
        stmt = stmt.where(Product.name.ilike(f"%{q}%"))
    stmt = stmt.order_by(Product.sort_order, Product.name).limit(limit).offset(offset)
    return db.scalars(stmt).all()


@router.get("/products/{slug}", response_model=ProductDetailOut)
def product_detail(slug: str, db: Session = Depends(get_db)):
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.specs))
        .where(Product.slug == slug, Product.is_published.is_(True))
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
