"use client";

import { useDeck } from "../DeckContext";

export default function SlideCover() {
  const { goTo } = useDeck();

  return (
    <section className="slide s-cover" data-screen-label="01 Capa">
      <div className="bg"></div>
      <div className="rules">
        <div className="v l1"></div>
      </div>

      <div className="cover-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-m8.svg" alt="M8 Partners" />
      </div>

      <div className="subtitle">
        <div className="line"></div>
        <div className="t1">Tecnologia da Informação</div>
        <div>
          Visão Geral da Área · Abril 2026
        </div>
      </div>

      <div className="enter-hint" onClick={() => goTo(1)}>
        <span>Iniciar apresentação</span>
        <div className="arrow">→</div>
      </div>
    </section>
  );
}
