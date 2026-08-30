import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0d1a0d] text-[#5a7a5a] pt-16 pb-8 px-8 font-sans text-[13px]">
      <div className="max-w-[1100px] mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#e8d5a3] [mask-image:url('/FAVICON.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"></div>
              <span className="text-[#e8d5a3] text-xl font-bold font-serif tracking-wide">
                TraktorShare
              </span>
            </div>
            <p className="leading-relaxed max-w-[260px]">
              Conectăm fermierii români cu utilajele agricole de care au nevoie, oriunde în țară.
            </p>
          </div>

          <div>
            <h4 className="text-[#e8d5a3] text-[14px] mb-4 font-serif">Platformă</h4>
            <div className="flex flex-col gap-2.5">
              <a href="/home" className="hover:text-[#e8d5a3] transition-colors">Găsește utilaje</a>
              <a href="/adauga-utilaj" className="hover:text-[#e8d5a3] transition-colors">Publică un utilaj</a>
              <a href="/cum-functioneaza" className="hover:text-[#e8d5a3] transition-colors">Cum funcționează</a>
              <a href="/contact" className="hover:text-[#e8d5a3] transition-colors">Contact</a>
              <a href="/signup" className="hover:text-[#e8d5a3] transition-colors">Înregistrare</a>
            </div>
          </div>

          <div>
            <h4 className="text-[#e8d5a3] text-[14px] mb-4 font-serif">Resurse</h4>
            <div className="flex flex-col gap-2.5">
              <a href="/ghiduri" className="hover:text-[#e8d5a3] transition-colors">Ghiduri pentru fermieri</a>
            </div>
          </div>

          <div>
            <h4 className="text-[#e8d5a3] text-[14px] mb-4 font-serif">Contact</h4>
            <a href="mailto:admin.traktorshare@gmail.com" className="block hover:text-[#e8d5a3] transition-colors">
              admin.traktorshare@gmail.com
            </a>
          </div>

        </div>

        <div className="border-t border-[#e8d5a3]/10 pt-6 text-center">
          <div className="flex justify-center gap-5 mb-2.5">
            <a href="/termeni" className="text-[12px] hover:text-[#e8d5a3] transition-colors">
              Termeni și condiții
            </a>
            <a href="/confidentialitate" className="text-[12px] hover:text-[#e8d5a3] transition-colors">
              Confidențialitate
            </a>
          </div>
          <div className="text-[#4a6a4a]">
            © 2026 TraktorShare. Toate drepturile rezervate.
          </div>
        </div>

      </div>
    </footer>
  );
}