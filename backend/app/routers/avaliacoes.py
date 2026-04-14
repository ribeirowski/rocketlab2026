from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import OrderReview
from app.models.item_pedido import OrderItem
from app.models.pedido import Order
from app.schemas import OrderReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/order/{order_id}", response_model=list[OrderReviewResponse])
def list_reviews_by_order(order_id: str, db: Session = Depends(get_db)):
    return db.query(OrderReview).filter(OrderReview.order_id == order_id).all()

@router.get("/product/{product_id}", response_model=list[OrderReviewResponse])
def list_reviews_by_product(product_id: str, db: Session = Depends(get_db)):
    return (
        db.query(OrderReview)
        .join(Order, Order.order_id == OrderReview.order_id)
        .join(OrderItem, OrderItem.order_id == Order.order_id)
        .filter(OrderItem.product_id == product_id)
        .limit(20)
        .all()
    )

@router.get("/{review_id}", response_model=OrderReviewResponse)
def get_review(review_id: str, db: Session = Depends(get_db)):
    review = db.query(OrderReview).filter(OrderReview.review_id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review
