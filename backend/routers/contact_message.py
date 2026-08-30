from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/contact", tags=["Contact"])

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


class ContactMessage(BaseModel):
    nume: str
    email: EmailStr
    mesaj: str


@router.post("/")
def trimite_mesaj(data: ContactMessage):
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise HTTPException(status_code=500, detail="Serviciul de email nu este configurat")

    msg = MIMEMultipart()
    msg["From"] = GMAIL_USER
    msg["To"] = GMAIL_USER
    msg["Subject"] = f"Mesaj nou de la {data.nume} - TraktorShare Contact"
    msg["Reply-To"] = data.email

    body = f"""Mesaj nou primit prin formularul de contact TraktorShare

Nume: {data.nume}
Email: {data.email}

Mesaj:
{data.mesaj}
"""
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_USER, GMAIL_USER, msg.as_string())
        server.quit()
    except Exception:
        raise HTTPException(status_code=500, detail="Eroare la trimiterea mesajului. Încearcă din nou.")

    return {"message": "Mesaj trimis cu succes"}