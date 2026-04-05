from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import requests
from database import SessionLocal
import entities

SECRET_KEY = "traktorbnb-secret-key-schimba-in-productie"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

FIREBASE_PROJECT_ID = "traktorbnb"

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

def verify_firebase_token(token: str) -> dict:
    try:
        # Obținem cheile publice Firebase
        keys_url = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
        keys = requests.get(keys_url).json()
        
        # Decodăm header-ul să găsim kid-ul
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        
        if kid not in keys:
            raise HTTPException(status_code=401, detail="Token invalid")
        
        # Verificăm tokenul
        payload = jwt.decode(
            token,
            keys[kid],
            algorithms=["RS256"],
            audience=FIREBASE_PROJECT_ID,
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Token Firebase invalid sau expirat")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> entities.User:
    payload = verify_firebase_token(token)
    email = payload.get("email")
    
    if not email:
        raise HTTPException(status_code=401, detail="Token invalid")
    
    user = db.query(entities.User).filter(entities.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilizator negăsit în baza de date")
    return user