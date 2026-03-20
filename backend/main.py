from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from auth import hash_password, verify_password, create_access_token, get_db
from routers import machinery
import entities, schemas

entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraktorBNB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Înregistrăm router-ele
app.include_router(machinery.router)


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


@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(entities.User).filter(entities.User.email == form.username).first()
    if not db_user or not verify_password(form.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}