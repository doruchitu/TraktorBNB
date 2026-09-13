import React, { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt PRINS", e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log("appinstalled declanșat");
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log("CLICK DETECTAT pe buton");
    console.log("deferredPrompt curent:", deferredPrompt);
    if (!deferredPrompt) {
      console.log("Nu exista deferredPrompt, ies din functie");
      return;
    }
    console.log("Apelez .prompt()...");
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Rezultat userChoice:", outcome);
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  console.log("Render InstallButton — installed:", installed, "deferredPrompt:", !!deferredPrompt);

  if (installed || !deferredPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      onMouseDown={() => console.log("MOUSEDOWN pe buton")}
      className="relative z-10 pointer-events-auto flex items-center justify-center gap-2 bg-transparent text-[#e8d5a3] border border-[#e8d5a3]/50 hover:border-[#e8d5a3] rounded-lg px-7 py-3 text-[14px] md:text-[15px] cursor-pointer font-serif transition-all duration-200 w-full sm:w-auto"
    >
      <span className="text-lg">📲</span> Instalează aplicația
    </button>
  );
}