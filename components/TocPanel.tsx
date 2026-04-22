"use client";

import { useEffect, useRef, useState } from "react";
import { useDeck } from "./DeckContext";

const ITEMS = [
  { i: 0, label: "Capa" },
  { i: 1, label: "Visão Geral da Área" },
  { i: 2, label: "Organograma" },
  { i: 3, label: "Como se conecta?" },
  { i: 4, label: "Principais Responsabilidades" },
  { i: 5, label: "Como a área gera valor?" },
  { i: 6, label: "Principais Riscos / Atenção" },
  { i: 7, label: "Interface com outras áreas" },
  { i: 8, label: "Nosso Sistema" },
];

export default function TocPanel() {
  const { currentIndex, goTo } = useDeck();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        className="toc-btn"
        title="Índice"
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
      <div ref={panelRef} className={`toc-panel${open ? " open" : ""}`}>
        <h5>Índice</h5>
        {ITEMS.map((it) => (
          <div
            key={it.i}
            className={`item${currentIndex === it.i ? " active" : ""}`}
            onClick={() => {
              goTo(it.i);
              setOpen(false);
            }}
          >
            <span className="n">{String(it.i).padStart(2, "0")}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
