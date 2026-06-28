from pydantic import BaseModel, ConfigDict


class SpecOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    group: str | None = None
    label: str
    value: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    subcategory: str | None = None
    summary: str | None = None
    featured: bool = False


class ProductDetailOut(ProductOut):
    category_id: int
    specs: list[SpecOut] = []


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    product_count: int = 0


class CategoryWithProductsOut(CategoryOut):
    products: list[ProductOut] = []
