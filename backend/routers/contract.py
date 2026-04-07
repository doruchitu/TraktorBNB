from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from fpdf import FPDF
import io
from database import SessionLocal
import entities
from auth import get_current_user

router = APIRouter(prefix="/contract", tags=["Contract"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ContractPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(26, 46, 26)
        self.cell(0, 15, "TraktorBNB", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 11)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Contract de inchiriere utilaj agricol", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(4)
        self.set_draw_color(26, 46, 26)
        self.set_line_width(0.8)
        self.line(15, self.get_y(), 195, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"TraktorBNB - Platforma fermierilor romani | Pagina {self.page_no()}", align="C")


@router.get("/{booking_id}")
def download_contract(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: entities.User = Depends(get_current_user)
):
    booking = db.query(entities.Booking).filter(entities.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu a fost gasita")
    if booking.status != "approved":
        raise HTTPException(status_code=400, detail="Contractul e disponibil doar pentru rezervari aprobate")
    if booking.client_id != current_user.id and booking.utilaj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nu ai acces la acest contract")

    proprietar = booking.utilaj.owner
    client = booking.client
    utilaj = booking.utilaj

    from datetime import date
    zile = (booking.data_end.date() - booking.data_start.date()).days + 1
    total = zile * utilaj.pret_zi

    pdf = ContractPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Nr contract si data
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, f"Nr. contract: TBN-{booking.id:04d} | Data: {date.today().strftime('%d.%m.%Y')}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    def section_title(title):
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(26, 46, 26)
        pdf.set_fill_color(232, 245, 232)
        pdf.cell(0, 9, f"  {title}", fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)

    def row(label, value):
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(80, 80, 80)
        pdf.cell(60, 7, label + ":", new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.cell(0, 7, str(value), new_x="LMARGIN", new_y="NEXT")

    # Parti contractante
    section_title("PARTI CONTRACTANTE")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(26, 46, 26)
    pdf.cell(0, 7, "PROPRIETAR (Locator):", new_x="LMARGIN", new_y="NEXT")
    row("  Nume complet", f"{proprietar.nume} {proprietar.prenume}")
    row("  Email", proprietar.email)
    row("  Telefon", proprietar.telefon or "—")
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(26, 46, 26)
    pdf.cell(0, 7, "CLIENT (Locatar):", new_x="LMARGIN", new_y="NEXT")
    row("  Nume complet", f"{client.nume} {client.prenume}")
    row("  Email", client.email)
    row("  Telefon", client.telefon or "—")
    pdf.ln(4)

    # Detalii utilaj
    section_title("OBIECTUL CONTRACTULUI")
    row("Tip utilaj", utilaj.tip if hasattr(utilaj, 'tip') and utilaj.tip else "Utilaj agricol")
    row("Marca", utilaj.marca)
    row("Model", utilaj.model)
    row("Putere", f"{utilaj.putere_cp} CP" if utilaj.putere_cp else "—")
    row("Judet", utilaj.judet)
    if utilaj.descriere:
        row("Descriere", utilaj.descriere)
    pdf.ln(4)

    # Perioada si pret
    section_title("PERIOADA SI PRETUL")
    row("Data inceput", booking.data_start.strftime("%d.%m.%Y"))
    row("Data sfarsit", booking.data_end.strftime("%d.%m.%Y"))
    row("Numar zile", str(zile))
    row("Pret pe zi", f"{utilaj.pret_zi:.2f} RON")
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(26, 46, 26)
    pdf.set_fill_color(232, 213, 163)
    pdf.cell(0, 10, f"  TOTAL DE PLATA: {total:.2f} RON", fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # Clauze
    section_title("CLAUZE SI CONDITII")
    clauze = [
        "1. Locatarul se obliga sa utilizeze utilajul conform destinatiei sale si cu respectarea normelor tehnice.",
        "2. Locatarul raspunde de orice daune produse utilajului pe perioada inchirierii.",
        "3. Utilajul va fi returnat in aceeasi stare in care a fost preluat, cu rezervorul de combustibil plin.",
        "4. In caz de defectiune tehnica aparuta din vina locatarului, acesta suporta costurile de reparatie.",
        "5. Plata se efectueaza integral inainte de preluarea utilajului.",
        "6. Contractul intra in vigoare la data aprobarii rezervarii pe platforma TraktorBNB.",
        "7. Litigiile se solutioneaza pe cale amiabila sau prin instantele competente din Romania.",
    ]
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(60, 60, 60)
    for clauza in clauze:
        pdf.multi_cell(0, 6, clauza, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)
    pdf.ln(4)

    # Semnaturi
    section_title("SEMNATURI")
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(85, 6, "PROPRIETAR", align="C", new_x="RIGHT", new_y="TOP")
    pdf.cell(0, 6, "CLIENT", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(16)
    pdf.set_draw_color(100, 100, 100)
    pdf.line(20, pdf.get_y(), 95, pdf.get_y())
    pdf.line(105, pdf.get_y(), 180, pdf.get_y())
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(85, 5, f"{proprietar.nume} {proprietar.prenume}", align="C", new_x="RIGHT", new_y="TOP")
    pdf.cell(0, 5, f"{client.nume} {client.prenume}", align="C", new_x="LMARGIN", new_y="NEXT")

    # Genereaza PDF
    pdf_bytes = pdf.output()
    pdf_buffer = io.BytesIO(bytes(pdf_bytes))

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=contract_TBN_{booking.id:04d}.pdf"}
    )