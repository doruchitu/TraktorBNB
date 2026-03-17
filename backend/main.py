from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import entities, schemas

# Creăm tabelele în baza de date la pornire
entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraktorBNB")

# Rezolvăm eroarea de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Funcția care deschide/închide conexiunea la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verificăm dacă email-ul există deja
    db_user = db.query(entities.User).filter(entities.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email deja folosit")
    
    # Creăm obiectul de bază de date
    new_user = entities.User(
        nume=user.nume,
        prenume=user.prenume,
        email=user.email,
        telefon=user.telefon,
        password_hash=user.password # În licență vom pune hashing aici
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/")
def health_check():
    return {"status": "online"}