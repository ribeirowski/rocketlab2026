from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import Order
from app.schemas import OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=list[OrderResponse])
def list_orders(
    consumer_id: Optional[str] = Query(None, description="Filter by consumer"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
):
    query = db.query(Order)
    if consumer_id:
        query = query.filter(Order.consumer_id == consumer_id)
    if status:
        query = query.filter(Order.status.ilike(f"%{status}%"))
    return query.limit(100).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
