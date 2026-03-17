from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    nume: str
    prenume: str
    email: str # Folosim str simplu momentan pentru a evita erori de instalare
    telefon: str
    password: str

class UserOut(BaseModel):
    id: int
    nume: str
    prenume: str
    email: str
    
    class Config:
        from_attributes = True