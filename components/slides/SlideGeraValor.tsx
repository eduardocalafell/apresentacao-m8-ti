"use client";

import { useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

interface ValueItem {
  title: string;
  desc: string;
  metric: string;
}

const VALUES: ValueItem[] = [
  { title: "Escala sem atrito", desc: "Plataformas que suportam crescimento de AUM e novas estratégias sem custo linear.", metric: "+35% produtividade" },
  { title: "Decisão informada", desc: "Dados íntegros, tempestivos e rastreáveis para gestores, risco e controladoria.", metric: "dados em T+0" },
  { title: "Resiliência operacional", desc: "Ambiente seguro, auditável e preparado para continuidade, mesmo em cenários adversos.", metric: "99,9% SLA" },
  { title: "Vantagem competitiva", desc: "Agilidade para incorporar novas estratégias, produtos e contrapartes.", metric: "time-to-market" },
  { title: "Aderência regulatória", desc: "Controles embutidos nos sistemas, reduzindo esforço manual e exposição a achados.", metric: "0 achados críticos" },
];

export default function SlideGeraValor() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className="slide s-content s5" data-screen-label="06 Gera Valor">
      <ChapterLabel num={5} name="Gera Valor" />
      <div className="left">
        <h2>
          Como a área <em>gera valor</em>.
        </h2>
        <p className="intro">
          Para além de manter o ambiente de pé — a TI entrega escala, decisão informada,
          resiliência e aderência regulatória com métricas concretas.
        </p>

        <div className="value-flow">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={`panel vitem clickable${activeIdx === i ? " active" : ""}`}
              onClick={() => setActiveIdx((p) => (p === i ? null : i))}
            >
              <div className="dot"></div>
              <div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
              <div className="metric">
                {v.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="right-label">Geração de valor · 05</div>
      </div>
      <ChromeBottom
        prevLabel="← Responsabilidades"
        prevIndex={4}
        nextLabel="Riscos →"
        nextIndex={6}
      />
    </section>
  );
}
