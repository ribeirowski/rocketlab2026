from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.avaliacao_pedido import OrderReview
from app.models.categoria import Category
from app.models.item_pedido import OrderItem
from app.models.pedido import Order
from app.models.produto import Product
from app.schemas import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])


def get_product_or_404(product_id: str, db: Session) -> Product:
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def _enrich_product(product: Product, db: Session) -> ProductResponse:
    """Attach computed fields (avg_rating, total_sales, category_image_url) to a product."""
    avg_rating = (
        db.query(func.avg(OrderReview.rating))
        .join(Order, Order.order_id == OrderReview.order_id)
        .join(OrderItem, OrderItem.order_id == Order.order_id)
        .filter(OrderItem.product_id == product.product_id)
        .scalar()
    )
    total_sales = (
        db.query(func.count(OrderItem.item_id))
        .filter(OrderItem.product_id == product.product_id)
        .scalar()
    )

    setattr(product, "average_rating", round(avg_rating, 2) if avg_rating else None)
    setattr(product, "total_sales", total_sales or 0)
    setattr(product, "category_image_url", product.category.image_url if product.category else None)
    return product


@router.get("/", response_model=list[ProductResponse])
def list_products(
    search: Optional[str] = Query(None, description="Search by product name"),
    category: Optional[str] = Query(None, description="Filter by category slug (e.g. 'brinquedos')"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Max number of records to return"),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category))
    if search:
        query = query.filter(Product.product_name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Product.product_category == category)

    products = query.offset(skip).limit(limit).all()

    result = []
    for p in products:
        setattr(p, "average_rating", None)
        setattr(p, "total_sales", None)
        setattr(p, "category_image_url", p.category.image_url if p.category else None)
        result.append(p)
    return result


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    return _enrich_product(product, db)


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if db.query(Product).filter(Product.product_id == payload.product_id).first():
        raise HTTPException(status_code=409, detail="Product already exists")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return _enrich_product(product, db)


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return _enrich_product(product, db)


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    db.delete(product)
    db.commit()
