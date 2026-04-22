"use client";

import { useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

interface Resp {
  idx: string;
  title: string;
  desc: string;
  subs: string[];
}

const RESP: Resp[] = [
  {
    idx: "R·01",
    title: "Infraestrutura & Cloud",
    desc: "Operação do ambiente produtivo, redes, identidade e provedores de nuvem.",
    subs: ["Servidores, redes e conectividade", "Identidade e controle de acesso", "Backup, DR e continuidade"],
  },
  {
    idx: "R·02",
    title: "Sistemas de Investimento",
    desc: "Suporte e evolução dos sistemas de gestão de portfólio, risco e back office.",
    subs: ["OMS / PMS", "Risco e atribuição de performance", "Back office e liquidação"],
  },
  {
    idx: "R·03",
    title: "Dados & Integrações",
    desc: "Ingestão, qualidade e distribuição de dados de mercado, contrapartes e custodiantes.",
    subs: ["Pipelines e APIs", "Data warehouse e modelagem", "Qualidade e linhagem"],
  },
  {
    idx: "R·04",
    title: "Segurança & Compliance",
    desc: "Proteção do ambiente, resposta a incidentes e aderência regulatória.",
    subs: ["SOC e monitoramento 24/7", "Gestão de vulnerabilidades", "Políticas, auditoria, LGPD"],
  },
];

export default function SlideResponsabilidades() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section className="slide s-content s4" data-screen-label="05 Responsabilidades">
      <ChapterLabel num={4} name="Responsabilidades" />
      <div className="left">
        <h2>
          Principais <em>responsabilidades</em>.
        </h2>
        <p className="intro">
          Quatro frentes sustentam a operação: infraestrutura, sistemas de investimento,
          dados e segurança. Clique em cada frente para ver o detalhamento.
        </p>

        <div className="resp-list">
          {RESP.map((r, i) => (
            <div
              key={r.idx}
              className={`panel resp clickable${openIdx === i ? " open" : ""}`}
              onClick={() => toggle(i)}
            >
              <div className="idx">{r.idx}</div>
              <div>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </div>
              <div className="plus">+</div>
              <div className="detail">
                <div className="detail-inner">
                  {r.subs.map((s) => (
                    <div key={s} className="sub">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="right-label">Responsabilidades · 04</div>
      </div>
      <ChromeBottom
        prevLabel="← Conexões"
        prevIndex={3}
        nextLabel="Geração de valor →"
        nextIndex={5}
      />
    </section>
  );
}
