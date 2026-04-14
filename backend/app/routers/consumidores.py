from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.enums import BrazilState
from app.models.consumidor import Consumer
from app.schemas import ConsumerResponse, ConsumerUpdate

router = APIRouter(prefix="/consumers", tags=["Consumers"])

@router.get("/", response_model=list[ConsumerResponse])
def list_consumers(
    search: Optional[str] = Query(None, description="Search by name or city"),
    state: Optional[BrazilState] = Query(None, description="Filter by state"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Consumer)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Consumer.consumer_name.ilike(pattern)
            | Consumer.city.ilike(pattern)
        )
    if state:
        query = query.filter(Consumer.state == state)
    return query.offset(skip).limit(limit).all()

@router.get("/{consumer_id}", response_model=ConsumerResponse)
def get_consumer(consumer_id: str, db: Session = Depends(get_db)):
    consumer = db.query(Consumer).filter(Consumer.consumer_id == consumer_id).first()
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    return consumer


@router.patch("/{consumer_id}", response_model=ConsumerResponse)
def update_consumer(consumer_id: str, payload: ConsumerUpdate, db: Session = Depends(get_db)):
    consumer = db.query(Consumer).filter(Consumer.consumer_id == consumer_id).first()
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(consumer, field, value)
        
    db.commit()
    db.refresh(consumer)
    return consumer
