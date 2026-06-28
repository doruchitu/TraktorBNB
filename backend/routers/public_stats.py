from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
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