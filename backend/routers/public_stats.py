from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth import get_db
import entities

router = APIRouter(prefix="/stats", tags=["public_stats"])

@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    total_utilaje = db.query(entities.Machinery).count()
    total_useri = db.query(entities.User).count()
    return {
        "total_utilaje": total_utilaje,
        "total_useri": total_useri
    }

@router.get("/rating-general")
def get_rating_general(db: Session = Depends(get_db)):
    reviews = db.query(entities.Review).all()
    if not reviews:
        return {"average": None, "count": 0}
    avg = sum(r.rating for r in reviews) / len(reviews)
    return {"average": round(avg, 1), "count": len(reviews)}