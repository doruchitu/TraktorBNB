from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from database import SessionLocal
import entities, schemas
from auth import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.BookingOut)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    utilaj = db.query(entities.Machinery).filter(entities.Machinery.id == booking.utilaj_id).first()
    if not utilaj:
        raise HTTPException(status_code=404, detail="Utilajul nu a fost găsit")
    if not utilaj.disponibil:
        raise HTTPException(status_code=400, detail="Utilajul nu este disponibil")
    if utilaj.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Nu îți poți rezerva propriul utilaj")

    new_booking = entities.Booking(
        utilaj_id=booking.utilaj_id,
        client_id=current_user.id,
        data_start=booking.data_start,
        data_end=booking.data_end,
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.get("/my", response_model=List[schemas.BookingOut])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    return db.query(entities.Booking).filter(entities.Booking.client_id == current_user.id).all()


@router.get("/incoming", response_model=List[schemas.BookingOut])
def get_incoming_bookings(
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    return db.query(entities.Booking)\
        .join(entities.Machinery)\
        .filter(entities.Machinery.owner_id == current_user.id)\
        .all()


@router.put("/{booking_id}/approve")
def approve_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    booking = db.query(entities.Booking).filter(entities.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu a fost găsită")
    if booking.utilaj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai permisiunea să aprobi această rezervare")
    booking.status = "approved"
    db.commit()
    return {"message": "Rezervare aprobată"}


@router.put("/{booking_id}/reject")
def reject_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    booking = db.query(entities.Booking).filter(entities.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu a fost găsită")
    if booking.utilaj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai permisiunea să respecți această rezervare")
    booking.status = "rejected"
    db.commit()
    return {"message": "Rezervare respinsă"}


@router.put("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    booking = db.query(entities.Booking).filter(entities.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu a fost găsită")
    if booking.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai permisiunea să anulezi această rezervare")
    booking.status = "cancelled"
    db.commit()
    return {"message": "Rezervare anulată"}


@router.get("/ocupate/{utilaj_id}")
def get_zile_ocupate(utilaj_id: int, db: Session = Depends(get_db)):
    bookings = db.query(entities.Booking).filter(
        entities.Booking.utilaj_id == utilaj_id,
        entities.Booking.status.in_(["pending", "approved"])
    ).all()

    zile_ocupate = []
    for booking in bookings:
        current = booking.data_start.date()
        while current <= booking.data_end.date():
            zile_ocupate.append(str(current))
            current += timedelta(days=1)

    return {"zile_ocupate": zile_ocupate}