from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import OrderReview
from app.models.item_pedido import OrderItem
from app.models.pedido import Order
from app.models.produto import Product
from app.schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


def get_product_or_404(product_id: str, db: Session) -> Product:
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/", response_model=list[ProductResponse])
def list_products(
    search: Optional[str] = Query(None, description="Search by name or category"),
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Product.product_name.ilike(pattern) | Product.product_category.ilike(pattern)
        )
    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)

    avg_rating = (
        db.query(func.avg(OrderReview.rating))
        .join(Order, Order.order_id == OrderReview.order_id)
        .join(OrderItem, OrderItem.order_id == Order.order_id)
        .filter(OrderItem.product_id == product_id)
        .scalar()
    )

    total_sales = (
        db.query(func.count(OrderItem.item_id))
        .filter(OrderItem.product_id == product_id)
        .scalar()
    )

    setattr(product, "average_rating", round(avg_rating, 2) if avg_rating else None)
    setattr(product, "total_sales", total_sales or 0)
    return product


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if db.query(Product).filter(Product.product_id == payload.product_id).first():
        raise HTTPException(status_code=409, detail="Product already exists")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, payload: ProductCreate, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product = get_product_or_404(product_id, db)
    db.delete(product)
    db.commit()
