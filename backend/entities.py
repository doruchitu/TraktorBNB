from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nume = Column(String, nullable=False)
    prenume = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    telefon = Column(String)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    utilaje_proprii = relationship("Machinery", back_populates="owner")
    rezervari_facute = relationship("Booking", back_populates="client")


class Machinery(Base):
    __tablename__ = "machinery"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    marca = Column(String, nullable=False)
    model = Column(String, nullable=False)
    putere_cp = Column(Integer)
    judet = Column(String, index=True)
    pret_zi = Column(Float, nullable=False)        # redenumit: pret pe zi
    descriere = Column(Text, default="")           # ✅ nou
    imagine_url = Column(String, default="")       # ✅ nou
    disponibil = Column(Boolean, default=True)     # ✅ nou
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # ✅ nou

    owner = relationship("User", back_populates="utilaje_proprii")
    rezervari = relationship("Booking", back_populates="utilaj")


# Status-urile posibile definite ca constante — evită typo-uri
class BookingStatus:
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    utilaj_id = Column(Integer, ForeignKey("machinery.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_start = Column(DateTime, nullable=False)
    data_end = Column(DateTime, nullable=False)
    status = Column(String, default=BookingStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # ✅ nou

    utilaj = relationship("Machinery", back_populates="rezervari")
    client = relationship("User", back_populates="rezervari_facute")