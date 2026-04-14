from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.enums import OrderStatus
from app.models.pedido import Order
from app.schemas import OrderResponse, OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=list[OrderResponse])
def list_orders(
    consumer_id: Optional[str] = Query(None, description="Filter by consumer ID"),
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Order)
    if consumer_id:
        query = query.filter(Order.consumer_id == consumer_id)
    if status:
        query = query.filter(Order.status == status)
    return query.offset(skip).limit(limit).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}", response_model=OrderResponse)
def update_order(order_id: str, payload: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(order, field, value)
        
    db.commit()
    db.refresh(order)
    return order
