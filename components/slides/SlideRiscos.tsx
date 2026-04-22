"use client";

import { useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

type Sev = "h" | "m" | "l";

interface Risk {
  sev: Sev;
  sevBig: string;
  sevLabel: string;
  title: string;
  desc: string;
  mitig: string;
}

const RISKS: Risk[] = [
  { sev: "h", sevBig: "A", sevLabel: "ALTO", title: "Segurança cibernética", desc: "Exposição a ataques direcionados ao setor financeiro — ransomware, phishing, fraude transacional.", mitig: "SOC 24/7 · MFA corporativo · treinamentos trimestrais · pentests anuais" },
  { sev: "h", sevBig: "A", sevLabel: "ALTO", title: "Dependência de fornecedores", desc: "Concentração em provedores críticos de sistemas, dados e nuvem.", mitig: "Contratos com SLA · planos de contingência · redundância entre provedores" },
  { sev: "m", sevBig: "M", sevLabel: "MÉDIO", title: "Integridade dos dados", desc: "Falhas em pipelines podem comprometer precificação, posição e reportes regulatórios.", mitig: "Reconciliações automáticas · alertas de qualidade · linhagem end-to-end" },
  { sev: "m", sevBig: "M", sevLabel: "MÉDIO", title: "Continuidade de negócios", desc: "Eventos disruptivos (energia, telecom, ambiente físico) podem interromper operações críticas.", mitig: "DR testado semestralmente · backups offsite · site alternativo" },
  { sev: "l", sevBig: "B", sevLabel: "BAIXO", title: "Dívida técnica", desc: "Acúmulo de legado pode reduzir velocidade de evolução.", mitig: "Refactoring contínuo · governança de arquitetura · roadmap de modernização" },
];

export default function SlideRiscos() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="slide s-content s6" data-screen-label="07 Riscos">
      <ChapterLabel num={6} name="Riscos e Atenção" />
      <div className="left">
        <h2>
          Principais riscos <em>e atenção</em>.
        </h2>
        <p className="intro">
          Mapeamos e mitigamos cinco frentes críticas — de segurança cibernética a
          continuidade operacional. Clique em cada risco para ver a mitigação em curso.
        </p>

        <div className="risks">
          {RISKS.map((r, i) => (
            <div
              key={r.title}
              className={`panel risk clickable${openIdx === i ? " open" : ""}`}
              onClick={() => setOpenIdx((p) => (p === i ? null : i))}
            >
              <div className={`sev ${r.sev}`}>
                <span className="big">{r.sevBig}</span>
                <span>{r.sevLabel}</span>
              </div>
              <div>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </div>
              <div className="chev">›</div>
              <div className="mitig-detail">
                <div className="mitig-detail-inner">
                  <div className="label">Mitigação em curso</div>
                  <div>{r.mitig}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="right-label">Riscos · 06</div>
      </div>
      <ChromeBottom
        prevLabel="← Geração de valor"
        prevIndex={5}
        nextLabel="Interface →"
        nextIndex={7}
      />
    </section>
  );
}
