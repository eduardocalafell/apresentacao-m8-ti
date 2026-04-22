"use client";

import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";
import { useDeck } from "../DeckContext";

interface Vector {
  tag: string;
  title: string;
  desc: string;
  jump: number;
}

const VECTORS: Vector[] = [
  { tag: "Vetor 01", title: "Fluxo de Dados", desc: "Ingestão, qualidade e distribuição para decisão.", jump: 7 },
  { tag: "Vetor 02", title: "Operação", desc: "Plataformas que sustentam o dia-a-dia da gestora.", jump: 4 },
  { tag: "Vetor 03", title: "Segurança", desc: "Proteção do ambiente e aderência regulatória.", jump: 6 },
  { tag: "Vetor 04", title: "Valor gerado", desc: "Produtividade, escala e resiliência operacional.", jump: 5 },
  { tag: "Vetor 05", title: "Riscos", desc: "Mapeados, mitigados e revisados periodicamente.", jump: 6 },
  { tag: "Vetor 06", title: "Interfaces", desc: "Parceria direta com cada área da gestora.", jump: 7 },
];

export default function SlideComoConecta() {
  const { goTo } = useDeck();

  return (
    <section className="slide s-content s3" data-screen-label="04 Como se conecta">
      <ChapterLabel num={3} name="Como se conecta" />
      <div className="left">
        <h2>
          Como se <em>conecta</em>.
        </h2>
        <p className="intro">
          Seis vetores ligam a TI à gestora: fluxo de dados, operação, segurança, valor
          gerado, riscos e interfaces. Clique em cada vetor para ir direto ao capítulo.
        </p>
        <p className="intro">
          A TI é o tecido conectivo da gestora: integra mesas de investimento, back
          office, compliance e dados — orquestrando o fluxo de informação que sustenta
          cada decisão.
        </p>

        <div className="connect-matrix">
          {VECTORS.map((v) => (
            <div
              key={v.tag}
              className="panel cm clickable"
              onClick={() => goTo(v.jump)}
            >
              <div className="cm-tag">{v.tag}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="right-label">Conexões · 03</div>
      </div>
      <ChromeBottom
        prevLabel="← Organograma"
        prevIndex={2}
        nextLabel="Responsabilidades →"
        nextIndex={4}
      />
    </section>
  );
}
