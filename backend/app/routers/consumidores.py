from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consumidor import Consumer
from app.schemas import ConsumerResponse

router = APIRouter(prefix="/consumers", tags=["Consumers"])


@router.get("/", response_model=list[ConsumerResponse])
def list_consumers(
    search: Optional[str] = Query(None, description="Search by name, city, or state"),
    db: Session = Depends(get_db),
):
    query = db.query(Consumer)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Consumer.consumer_name.ilike(pattern)
            | Consumer.city.ilike(pattern)
            | Consumer.state.ilike(pattern)
        )
    return query.limit(100).all()


@router.get("/{consumer_id}", response_model=ConsumerResponse)
def get_consumer(consumer_id: str, db: Session = Depends(get_db)):
    consumer = db.query(Consumer).filter(Consumer.consumer_id == consumer_id).first()
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    return consumer
