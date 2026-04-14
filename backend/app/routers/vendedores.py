from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vendedor import Seller
from app.schemas import SellerResponse

router = APIRouter(prefix="/sellers", tags=["Sellers"])


@router.get("/", response_model=list[SellerResponse])
def list_sellers(
    search: Optional[str] = Query(None, description="Search by name, city, or state"),
    db: Session = Depends(get_db),
):
    query = db.query(Seller)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Seller.seller_name.ilike(pattern)
            | Seller.city.ilike(pattern)
            | Seller.state.ilike(pattern)
        )
    return query.all()


@router.get("/{seller_id}", response_model=SellerResponse)
def get_seller(seller_id: str, db: Session = Depends(get_db)):
    seller = db.query(Seller).filter(Seller.seller_id == seller_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    return seller
