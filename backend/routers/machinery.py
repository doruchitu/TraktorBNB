from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal
import entities, schemas
from auth import get_current_user

router = APIRouter(prefix="/machinery", tags=["Machinery"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.MachineryOut)
def create_machinery(
    machinery: schemas.MachineryCreate,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    new_machinery = entities.Machinery(
        **machinery.model_dump(),
        owner_id=current_user.id
    )
    db.add(new_machinery)
    db.commit()
    db.refresh(new_machinery)
    return new_machinery


@router.get("/", response_model=List[schemas.MachineryOut])
def list_machinery(
    judet: Optional[str] = None,
    pret_max: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(entities.Machinery).filter(entities.Machinery.disponibil == True)
    
    if judet:
        query = query.filter(entities.Machinery.judet == judet)
    if pret_max:
        query = query.filter(entities.Machinery.pret_zi <= pret_max)
    
    return query.all()


@router.get("/{machinery_id}", response_model=schemas.MachineryOut)
def get_machinery(machinery_id: int, db: Session = Depends(get_db)):
    machinery = db.query(entities.Machinery).filter(entities.Machinery.id == machinery_id).first()
    if not machinery:
        raise HTTPException(status_code=404, detail="Utilajul nu a fost găsit")
    return machinery


@router.put("/{machinery_id}", response_model=schemas.MachineryOut)
def update_machinery(
    machinery_id: int,
    updates: schemas.MachineryCreate,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    machinery = db.query(entities.Machinery).filter(entities.Machinery.id == machinery_id).first()
    if not machinery:
        raise HTTPException(status_code=404, detail="Utilajul nu a fost găsit")
    if machinery.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai permisiunea să editezi acest utilaj")
    
    for key, value in updates.model_dump().items():
        setattr(machinery, key, value)
    
    db.commit()
    db.refresh(machinery)
    return machinery


@router.delete("/{machinery_id}")
def delete_machinery(
    machinery_id: int,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    machinery = db.query(entities.Machinery).filter(entities.Machinery.id == machinery_id).first()
    if not machinery:
        raise HTTPException(status_code=404, detail="Utilajul nu a fost găsit")
    if machinery.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai permisiunea să ștergi acest utilaj")
    
    db.delete(machinery)
    db.commit()
    return {"message": "Utilaj șters cu succes"}