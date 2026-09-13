import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Confidentialitate() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1a0d] font-serif overflow-x-hidden">

      <nav className={`fixed top-0 left-0 right-0 z-[100] px-12 h-[70px] flex items-center justify-between transition-colors duration-300 ${
        scrollY > 50 ? "bg-[#0d1a0d]/95 backdrop-blur-md border-b border-[#e8d5a3]/10" : "bg-transparent"
      }`}>
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🚜</span>
          <span className="text-[#e8d5a3] text-[22px] font-bold tracking-wide">TraktorShare</span>
        </div>
      </nav>

      <div className="bg-gradient-to-b from-[#0d1a0d] via-[#1a2e1a] to-[#0d1a0d] text-center px-8 pt-[140px] pb-12">
        <h1 className="text-[#e8d5a3] text-3xl md:text-4xl font-bold">Politica de Confidențialitate</h1>
        <p className="text-[#9db89d] font-sans text-xs mt-2">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="bg-[#f7f5f0] px-8 py-12 pb-20">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#e8e0d0] p-10">

          <Section title="1. Cine suntem">
            <P>
              TraktorShare este dezvoltată și administrată de o persoană fizică, în cadrul unui
              proiect educațional desfășurat în context universitar. Această politică explică ce
              date colectăm, de ce, și cum le folosim și protejăm.
            </P>
          </Section>

          <Section title="2. Ce date colectăm">
            <P>Când îți creezi un cont, colectăm:</P>
            <List items={[
              "Nume și prenume",
              "Adresă de email",
              "Număr de telefon",
              "Parolă (stocată securizat prin Firebase Authentication, niciodată în text simplu)",
            ]} />
            <P>Dacă publici un utilaj, colectăm și:</P>
            <List items={[
              "Detalii despre utilaj (marcă, model, preț, descriere, fotografii)",
              "Județul în care se află utilajul",
            ]} />
            <P>
              Dacă faci o rezervare sau primești una, colectăm datele intervalului de rezervare și
              statusul acesteia (în așteptare, aprobată, respinsă).
            </P>
          </Section>

          <Section title="3. De ce colectăm aceste date">
            <List items={[
              "Pentru a-ți crea și administra contul",
              "Pentru a afișa utilajele disponibile altor utilizatori ai platformei",
              "Pentru a facilita comunicarea dintre proprietari și clienți în cadrul unei rezervări",
              "Pentru a genera modelul de contract PDF la aprobarea unei rezervări",
              "Pentru a răspunde mesajelor trimise prin formularul de contact",
            ]} />
          </Section>

          <Section title="4. Cine are acces la datele tale">
            <P>
              Numele, telefonul și emailul tău devin vizibile celeilalte părți implicate{" "}
              <strong>doar</strong> în contextul unei rezervări aprobate — proprietarul vede datele
              clientului și invers, exact cât e necesar pentru a coordona predarea/preluarea
              utilajului.
            </P>
            <P>
              Datele sunt stocate folosind următorii furnizori de servicii cloud, fiecare cu propriile
              politici de securitate:
            </P>
            <List items={[
              "Neon (bază de date PostgreSQL)",
              "Render (server backend)",
              "Vercel (aplicație frontend)",
              "Firebase / Google (autentificare)",
              "Cloudinary (stocare imagini)",
            ]} />
            <P>Nu vindem și nu închiriem datele tale către terți în scopuri publicitare.</P>
          </Section>

          <Section title="5. Cookie-uri">
            <P>
              Platforma folosește exclusiv <strong>cookie-uri esențiale</strong>, necesare pentru
              funcționarea de bază — păstrarea sesiunii tale de autentificare. Nu folosim cookie-uri
              de analiză a traficului sau de publicitate.
            </P>
          </Section>

          <Section title="6. Cât timp păstrăm datele">
            <P>
              Datele contului tău sunt păstrate atât timp cât contul rămâne activ. Dacă dorești
              ștergerea contului și a datelor asociate, ne poți contacta oricând — vezi secțiunea
              de mai jos.
            </P>
          </Section>

          <Section title="7. Drepturile tale">
            <P>Conform legislației aplicabile privind protecția datelor (GDPR), ai dreptul să:</P>
            <List items={[
              "Soliciți o copie a datelor pe care le deținem despre tine",
              "Ceri corectarea datelor incorecte",
              "Ceri ștergerea contului și a datelor asociate",
              "Retragi consimțământul acordat, atunci când prelucrarea se bazează pe acesta",
            ]} />
          </Section>

          <Section title="8. Contact">
            <P>
              Pentru orice întrebare legată de datele tale personale, ne poți scrie la{" "}
              <a href="mailto:admin.traktorshare@gmail.com" className="text-[#1a2e1a] font-bold">
                admin.traktorshare@gmail.com
              </a>{" "}
              sau prin{" "}
              <span onClick={() => navigate("/contact")} className="text-[#1a2e1a] font-bold cursor-pointer underline">
                formularul de contact
              </span>.
            </P>
          </Section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-[#1a2e1a] text-[17px] font-serif mb-2.5">{title}</h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p className="text-[#555] font-sans text-sm leading-relaxed mb-2.5">{children}</p>;
}

function List({ items }) {
  return (
    <ul className="list-disc pl-5 mb-2.5">
      {items.map((item, i) => (
        <li key={i} className="text-[#555] font-sans text-sm leading-relaxed mb-1">{item}</li>
      ))}
    </ul>
  );
}