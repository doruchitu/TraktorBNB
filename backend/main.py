from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine
from auth import hash_password, get_db
from routers import machinery, bookings, contract
import entities, schemas

entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraktorBNB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(machinery.router)
app.include_router(bookings.router)
app.include_router(contract.router)


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