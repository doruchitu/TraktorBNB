from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from database import SessionLocal, engine
import entities, schemas

entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraktorBNB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Mai sigur decât "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config JWT
SECRET_KEY = "traktorbnb-secret-key-schimba-in-productie"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Hashing parole
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


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
        password_hash=hash_password(user.password)  # ✅ Hashing corect
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm folosește câmpul "username" pentru email
    db_user = db.query(entities.User).filter(entities.User.email == form.username).first()
    
    if not db_user or not verify_password(form.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}