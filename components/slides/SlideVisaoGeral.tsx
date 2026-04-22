"use client";

import { useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

export default function SlideVisaoGeral() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggle = (i: number) => setActiveIdx((prev) => (prev === i ? null : i));

  return (
    <section className="slide s-content s2" data-screen-label="02 Visão Geral">
      <ChapterLabel num={1} name="Visão Geral da Área" />
      <div className="left">
        <h2>
          Visão geral da <em>área</em>.
        </h2>
        <p className="intro">
          Sustenta e evolui a plataforma de tecnologia da gestora — habilitador estratégico
          das mesas de investimento, back office e compliance.
        </p>

        <div className="qa-block">
          <div
            className={`panel qa clickable${activeIdx === 0 ? " active" : ""}`}
            onClick={() => toggle(0)}
          >
            <div className="q-label">O que a área faz?</div>
            <h3>
              Sustenta e evolui a plataforma de tecnologia da gestora.
            </h3>
            <p>
              Responsável pela infraestrutura, sistemas de investimento e integrações que
              viabilizam decisão, execução e controle das estratégias da M8. Garante
              disponibilidade, segurança e evolução contínua do ambiente.
            </p>
          </div>
          <div
            className={`panel qa clickable${activeIdx === 1 ? " active" : ""}`}
            onClick={() => toggle(1)}
          >
            <div className="q-label">Qual o papel dentro da gestora?</div>
            <h3>
              Habilitador estratégico, não apenas suporte.
            </h3>
            <p>
              Atua como parceira das mesas de investimento, back office e compliance —
              traduzindo necessidades de negócio em soluções escaláveis, auditáveis e
              alinhadas à regulação.
            </p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="right-label">Visão Geral · 01</div>
      </div>

      <ChromeBottom
        prevLabel="← Capa"
        prevIndex={0}
        nextLabel="Organograma →"
        nextIndex={2}
      />
    </section>
  );
}
