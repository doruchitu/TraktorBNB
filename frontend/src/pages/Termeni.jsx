import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Termeni() {
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
        <h1 className="text-[#e8d5a3] text-3xl md:text-4xl font-bold">Termeni și Condiții</h1>
        <p className="text-[#9db89d] font-sans text-xs mt-2">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="bg-[#f7f5f0] px-8 py-12 pb-20">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#e8e0d0] p-10">

          <Section title="1. Despre platformă">
            <P>
              TraktorShare este o platformă digitală care conectează proprietari de utilaje agricole
              cu fermieri care au nevoie temporar de astfel de utilaje, facilitând procesul de căutare,
              rezervare și comunicare între părți.
            </P>
            <P>
              Platforma este dezvoltată și administrată de o persoană fizică, în cadrul unui proiect
              educațional și de cercetare desfășurat în context universitar. TraktorShare se află
              momentan în etapă de testare (pilot), cu funcționalitate limitată la un grup de
              utilizatori participanți la acest studiu.
            </P>
          </Section>

          <Section title="2. Rolul platformei">
            <P>
              TraktorShare oferă infrastructura tehnică prin care proprietarii pot publica anunțuri
              pentru utilajele lor, iar clienții pot căuta, vizualiza disponibilitatea și trimite
              cereri de rezervare.
            </P>
            <P>
              <strong>Platforma nu este parte în tranzacția dintre proprietar și client.</strong>{" "}
              Închirierea efectivă a utilajului, condițiile financiare, predarea și returnarea
              acestuia se stabilesc direct între cele două părți implicate.
            </P>
          </Section>

          <Section title="3. Contul de utilizator">
            <P>
              Pentru a folosi platforma, ai nevoie de un cont creat cu date reale — nume, prenume,
              adresă de email și număr de telefon valide. Ești responsabil pentru confidențialitatea
              datelor de autentificare ale contului tău și pentru orice activitate desfășurată prin
              intermediul acestuia.
            </P>
            <P>
              Ne rezervăm dreptul de a suspenda sau elimina conturi care furnizează informații false
              sau care încalcă acești termeni.
            </P>
          </Section>

          <Section title="4. Publicarea utilajelor">
            <P>
              Proprietarii sunt responsabili pentru acuratețea informațiilor publicate — descrierea,
              starea tehnică, prețul și disponibilitatea utilajului. Publicarea unui utilaj pe
              platformă reprezintă o declarație a proprietarului că are dreptul legal de a-l închiria.
            </P>
          </Section>

          <Section title="5. Rezervările">
            <P>
              O cerere de rezervare trimisă printr-un utilaj disponibil nu constituie o obligație
              automată — proprietarul poate aproba sau respinge cererea. Odată aprobată, rezervarea
              devine un angajament între cele două părți, pe care platforma îl facilitează dar nu
              îl garantează.
            </P>
          </Section>

          <Section title="6. Modelul de contract generat automat">
            <P>
              La aprobarea unei rezervări, platforma generează automat un document PDF cu rol de
              model orientativ, pe baza datelor introduse de cele două părți. Acest document{" "}
              <strong>nu constituie un contract legal definitiv</strong> și nu înlocuiește o
              consultanță juridică. Recomandăm ca, pentru închirieri de valoare mare sau situații
              speciale, părțile să consulte un specialist înainte de a considera înțelegerea finală.
            </P>
          </Section>

          <Section title="7. Recenzii și evaluări">
            <P>
              Recenziile pot fi lăsate doar de utilizatorii care au avut o rezervare aprobată pentru
              utilajul respectiv. Recenziile trebuie să reflecte experiența reală a utilizatorului și
              nu trebuie să conțină conținut ofensator, fals sau înșelător.
            </P>
          </Section>

          <Section title="8. Limitarea răspunderii">
            <P>
              TraktorShare este oferită „așa cum este", în etapă de testare. Nu garantăm funcționare
              neîntreruptă sau lipsită de erori. Nu suntem responsabili pentru daune, litigii sau
              neînțelegeri apărute între proprietari și clienți în cadrul închirierilor facilitate
              prin platformă.
            </P>
          </Section>

          <Section title="9. Modificări ale termenilor">
            <P>
              Acești termeni pot fi actualizați pe măsură ce platforma evoluează. Continuarea
              utilizării platformei după o actualizare reprezintă acceptarea noilor termeni.
            </P>
          </Section>

          <Section title="10. Contact">
            <P>
              Pentru întrebări legate de acești termeni, ne poți scrie la{" "}
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