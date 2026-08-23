import React, { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
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
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (installed || !deferredPrompt) return null;

  return (
    <button onClick={handleInstall} style={{
      background: "transparent",
      color: "#e8d5a3",
      border: "1px solid rgba(232,213,163,0.5)",
      borderRadius: "8px",
      padding: "12px 28px",
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "Georgia, serif",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s",
    }}
      onMouseEnter={e => e.target.style.borderColor = "#e8d5a3"}
      onMouseLeave={e => e.target.style.borderColor = "rgba(232,213,163,0.5)"}
    >
      📲 Instalează aplicația
    </button>
  );
}