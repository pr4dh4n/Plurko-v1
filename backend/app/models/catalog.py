from sqlalchemy import String, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160), unique=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="category", cascade="all, delete-orphan"
    )


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(240), unique=True, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), index=True)
    subcategory: Mapped[str | None] = mapped_column(String(160), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    category: Mapped["Category"] = relationship(back_populates="products")
    specs: Mapped[list["ProductSpec"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )


class ProductSpec(Base):
    __tablename__ = "product_specs"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    group: Mapped[str | None] = mapped_column(String(120), nullable=True)
    label: Mapped[str] = mapped_column(String(160))
    value: Mapped[str] = mapped_column(String(400))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    product: Mapped["Product"] = relationship(back_populates="specs")
