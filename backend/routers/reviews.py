from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import get_db
import entities, schemas
from auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=schemas.ReviewOut)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    booking = db.query(entities.Booking).filter(entities.Booking.id == review.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu a fost găsită")
    if booking.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu poți evalua o rezervare care nu îți aparține")
    if booking.status != "approved":
        raise HTTPException(status_code=400, detail="Poți evalua doar rezervări aprobate")
    if not (1 <= review.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating-ul trebuie să fie între 1 și 5")

    existing = db.query(entities.Review).filter(entities.Review.booking_id == review.booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ai evaluat deja această rezervare")

    new_review = entities.Review(
        utilaj_id=booking.utilaj_id,
        client_id=current_user.id,
        booking_id=review.booking_id,
        rating=review.rating,
        comentariu=review.comentariu
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@router.get("/machinery/{utilaj_id}")
def get_reviews_for_machinery(utilaj_id: int, db: Session = Depends(get_db)):
    reviews = db.query(entities.Review).filter(entities.Review.utilaj_id == utilaj_id).all()
    if not reviews:
        return {"average": None, "count": 0, "reviews": []}
    avg = sum(r.rating for r in reviews) / len(reviews)
    return {
        "average": round(avg, 1),
        "count": len(reviews),
        "reviews": [
            {
                "rating": r.rating,
                "comentariu": r.comentariu,
                "client_nume": f"{r.client.nume} {r.client.prenume[0]}."
            }
            for r in reviews
        ]
    }