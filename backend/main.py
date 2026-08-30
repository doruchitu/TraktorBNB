from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine
from auth import hash_password, get_db, get_current_user
from routers import machinery, bookings, contract, public_stats, contact_message, reviews
import entities, schemas

entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraktorShare")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(machinery.router)
app.include_router(bookings.router)
app.include_router(contract.router)
app.include_router(public_stats.router)
app.include_router(contact_message.router)
app.include_router(reviews.router)


@app.get("/")
def health_check():
    return {"status": "online"}


@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(entities.User).filter(entities.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email deja folosit")

    new_user = entities.User(
        nume=user.nume,
        prenume=user.prenume,
        email=user.email,
        telefon=user.telefon,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/me")
def get_my_profile(current_user: entities.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "nume": current_user.nume,
        "prenume": current_user.prenume,
        "email": current_user.email,
        "telefon": current_user.telefon,
    }