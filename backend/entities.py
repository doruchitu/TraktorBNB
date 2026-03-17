from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index = True)
    nume = Column(String, index = True)
    prenume = Column(String, index = True)
    email = Column(String, unique = True, index = True)
    telefon = Column(String)
    password_hash = Column(String)

    utilaje_proprii = relationship("Machinery", back_populates="owner")
    rezervari_facute = relationship("Booking", back_populates="client")

class Machinery(Base):
    __tablename__ = "machinery"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    marca = Column(String)
    model = Column(String)
    putere_cp = Column(Integer)
    judet = Column(String, index=True)
    pret = Column(Float)

    owner = relationship("User", back_populates="utilaje_proprii")
    rezervari = relationship("Booking", back_populates="utilaj")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    utilaj_id = Column(Integer, ForeignKey("machinery.id"))
    client_id = Column(Integer, ForeignKey("users.id"))
    data_start = Column(DateTime)
    data_end = Column(DateTime)
    status = Column(String, default="pending") #aprobare de la proproietar

    utilaj = relationship("Machinery", back_populates="rezervari")
    client = relationship("User", back_populates="rezervari_facute")