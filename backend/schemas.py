from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date as DateType

# ─────────────────────────────────────────
# USER
# ─────────────────────────────────────────

class UserCreate(BaseModel):
    nume: str
    prenume: str
    email: EmailStr
    telefon: str
    password: str

class UserOut(BaseModel):
    id: int
    nume: str
    prenume: str
    email: str
    telefon: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# MACHINERY
# ─────────────────────────────────────────

class MachineryCreate(BaseModel):
    marca: str
    model: str
    putere_cp: Optional[int] = None
    judet: str
    pret_zi: float
    descriere: Optional[str] = ""
    imagine_url: Optional[str] = ""
    data_disponibil_de: Optional[DateType] = None    
    data_disponibil_pana: Optional[DateType] = None  

class MachineryOut(BaseModel):
    id: int
    marca: str
    model: str
    putere_cp: Optional[int]
    judet: str
    pret_zi: float
    descriere: str
    imagine_url: str
    disponibil: bool
    created_at: datetime
    data_disponibil_de: Optional[DateType]    
    data_disponibil_pana: Optional[DateType]  
    owner: UserOut         

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# BOOKING
# ─────────────────────────────────────────

class BookingCreate(BaseModel):
    utilaj_id: int
    data_start: datetime
    data_end: datetime

class BookingOut(BaseModel):
    id: int
    status: str
    data_start: datetime
    data_end: datetime
    created_at: datetime
    utilaj: MachineryOut    # detalii utilaj
    client: UserOut         # detalii client

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# TOKEN (pentru login)
# ─────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str