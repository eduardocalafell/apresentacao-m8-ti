"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

type PhotoKind = "photo" | "logo";

interface Person {
  name: string;
  role: string;
  section: string;
  photo: string;
  photoKind: PhotoKind;
  bio: string;
  skills: string[];
}

const PEOPLE: Record<string, Person> = {
  murillo: {
    name: "Murillo Spinelli",
    role: "Head de T.I.",
    section: "Gestão",
    photo: "/assets/org/murillo.jpg",
    photoKind: "photo",
    bio: "Lidera a área de tecnologia da gestora — responsável pela estratégia, roadmap, orçamento e relacionamento com stakeholders de negócio.",
    skills: [
      "Liderança técnica",
      "Roadmap & budget",
      "Gestão de fornecedores",
      "Governança",
      "Arquitetura de soluções",
      "Stakeholders",
    ],
  },
  eduardo: {
    name: "Eduardo Calafell",
    role: "Arquiteto / Backend",
    section: "Desenvolvimento",
    photo: "/assets/org/eduardo.png",
    photoKind: "photo",
    bio: "Define a arquitetura do sistema proprietário, lidera o design de dados e as integrações com custodiantes e provedores de mercado.",
    skills: [
      "C# / .NET 8",
      "PostgreSQL",
      "EF Core",
      "Arquitetura de sistemas",
      "Azure",
      "APIs REST",
      "Integrações (Singulare · BTG · Hemera)",
      "Modelagem de dados",
    ],
  },
  vinicius: {
    name: "Vinicius Henques",
    role: "Fullstack",
    section: "Desenvolvimento",
    photo: "/assets/org/vinicius.png",
    photoKind: "photo",
    bio: "Atua ponta-a-ponta em novas features — do backend e APIs até a tela final — com forte apoio em automações e integração de dados.",
    skills: [
      "C# / .NET",
      "React / TypeScript",
      "APIs REST",
      "PostgreSQL",
      "Power Automate",
      "Azure",
      "Integração de dados",
    ],
  },
  gabriel: {
    name: "Gabriel França",
    role: "Frontend",
    section: "Desenvolvimento",
    photo: "/assets/org/gabriel.jpeg",
    photoKind: "photo",
    bio: "Responsável pela camada de interface do sistema — experiência, consistência visual e performance das telas usadas diariamente pelas mesas.",
    skills: [
      "React",
      "TypeScript",
      "UI / UX",
      "Design systems",
      "Consumo de APIs",
      "State management",
      "Testes E2E",
    ],
  },
  mauro: {
    name: "Mauro",
    role: "Infraestrutura · Externo",
    section: "Infraestrutura",
    photo: "/assets/org/mauro.png",
    photoKind: "logo",
    bio: "Profissional externo (Vingra) dedicado à infraestrutura da M8 — mantém o ambiente produtivo em cloud, redes, CI/CD, backups e continuidade operacional, garantindo a disponibilidade 24/7 da plataforma.",
    skills: [
      "Azure (App Service · Blob · File Share)",
      "CI/CD (GitHub Actions)",
      "SFTP / FTP",
      "Monitoramento",
      "Redes & firewall",
      "Backup & DR",
    ],
  },
  ftconsult: {
    name: "FT Consult",
    role: "Segurança da Informação + Infraestrutura · Externo",
    section: "Consultoria",
    photo: "/assets/org/ftconsult.png",
    photoKind: "logo",
    bio: "Consultoria especializada que atua em duas frentes na M8: segurança da informação (SOC, resposta a incidentes, compliance) e suporte de infraestrutura — reforçando o time interno em ambos os domínios.",
    skills: [
      "SOC 24/7",
      "Resposta a incidentes",
      "Gestão de vulnerabilidades",
      "MFA / Identity",
      "LGPD / Compliance",
      "Pen testing",
      "Suporte de Infraestrutura",
      "Monitoramento de ambiente",
    ],
  },
};

const CHILD_IDS = ["eduardo", "vinicius", "gabriel", "mauro", "ftconsult"] as const;

const SHORT_ROLE: Record<string, string> = {
  eduardo: "Arquiteto / Backend",
  vinicius: "Fullstack",
  gabriel: "Frontend",
  mauro: "Infraestrutura",
  ftconsult: "Seg. Info. + Infra",
};

export default function SlideOrganograma() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const edgesRef = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const drawEdges = useCallback(() => {
    const chart = chartRef.current;
    const edges = edgesRef.current;
    if (!chart || !edges) return;
    const rect = chart.getBoundingClientRect();
    if (!rect.width) return;
    edges.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    edges.innerHTML = "";
    const murillo = chart.querySelector<HTMLElement>('[data-id="murillo"]');
    if (!murillo) return;
    const mr = murillo.getBoundingClientRect();
    const mx = (mr.left + mr.right) / 2 - rect.left;
    const my = mr.bottom - rect.top;
    CHILD_IDS.forEach((id) => {
      const el = chart.querySelector<HTMLElement>(`[data-id="${id}"]`);
      if (!el) return;
      const er = el.getBoundingClientRect();
      const ex = (er.left + er.right) / 2 - rect.left;
      const ey = er.top - rect.top;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(mx));
      line.setAttribute("y1", String(my));
      line.setAttribute("x2", String(ex));
      line.setAttribute("y2", String(ey));
      line.setAttribute("stroke", "#2A2E35");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("stroke-dasharray", "3 4");
      line.dataset.from = "murillo";
      line.dataset.to = id;
      edges.appendChild(line);
    });
    // Apply active class if there's a selection
    edges.querySelectorAll("line").forEach((l) => {
      const d = l as SVGLineElement & { dataset: DOMStringMap };
      const related = selected && (d.dataset.from === selected || d.dataset.to === selected);
      l.classList.toggle("active", Boolean(related));
    });
  }, [selected]);

  useLayoutEffect(() => {
    drawEdges();
    const t1 = setTimeout(drawEdges, 100);
    const t2 = setTimeout(drawEdges, 500);
    const ro = new ResizeObserver(drawEdges);
    if (chartRef.current) ro.observe(chartRef.current);
    window.addEventListener("resize", drawEdges);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", drawEdges);
    };
  }, [drawEdges]);

  useEffect(() => {
    const stage = document.querySelector("deck-stage");
    if (!stage) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ index: number }>;
      if (ce.detail.index === 2) setTimeout(drawEdges, 120);
    };
    stage.addEventListener("slidechange", handler);
    return () => stage.removeEventListener("slidechange", handler);
  }, [drawEdges]);

  const handlePersonClick = (id: string) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const handleChartClick = (e: React.MouseEvent) => {
    if (e.target === chartRef.current || e.target === edgesRef.current) {
      setSelected(null);
    }
  };

  const person = selected ? PEOPLE[selected] : null;

  return (
    <section
      className="slide s-content s-org"
      data-screen-label="03 Organograma"
    >
      <ChapterLabel num={2} name="Organograma" />
      <h2>
        Quem faz a <em>TI</em>.
      </h2>
      <p className="intro">
        Uma equipe enxuta, cross-funcional e sênior — cobrindo desenvolvimento,
        infraestrutura e segurança com apoio de consultoria especializada. Clique
        em cada pessoa para ver responsabilidades e stack.
      </p>

      <div className="org-layout">
        <div
          ref={chartRef}
          className={`org-chart${selected ? " has-selection" : ""}`}
          onClick={handleChartClick}
        >
          <svg ref={edgesRef} className="org-edges" preserveAspectRatio="none"></svg>

          <div className="pillar-row">
            <span className="pillar-tag-inline">● Gestão</span>
          </div>

          <div className="org-level gestao">
            <div
              className={`person lead${selected === "murillo" ? " selected" : ""}`}
              onClick={() => handlePersonClick("murillo")}
              data-id="murillo"
              id="pMurillo"
            >
              <div
                className="avatar is-photo"
                style={{ "--avatar-url": `url('${PEOPLE.murillo.photo}')` } as React.CSSProperties}
              >
                MS
              </div>
              <div className="p-name">
                Murillo Spinelli
              </div>
              <div className="p-role">
                Head de T.I.
              </div>
            </div>
          </div>

          <div className="pillar-row">
            <span className="pillar-tag-inline">● Desenvolvimento</span>
          </div>

          <div className="org-level dev">
            {(["eduardo", "vinicius", "gabriel"] as const).map((id) => (
              <div
                key={id}
                className={`person${selected === id ? " selected" : ""}`}
                onClick={() => handlePersonClick(id)}
                data-id={id}
              >
                <div
                  className="avatar is-photo"
                  style={{ "--avatar-url": `url('${PEOPLE[id].photo}')` } as React.CSSProperties}
                >
                  {PEOPLE[id].name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="p-name">
                  {PEOPLE[id].name}
                </div>
                <div className="p-role">
                  {SHORT_ROLE[id]}
                </div>
              </div>
            ))}
          </div>

          <div className="pillar-row">
            <span className="pillar-tag-inline">● Infraestrutura</span>
            <span className="pillar-tag-inline">● Seg. Info. + Infra</span>
          </div>

          <div className="org-level inf-sec">
            {(["mauro", "ftconsult"] as const).map((id) => (
              <div
                key={id}
                className={`person${selected === id ? " selected" : ""}`}
                onClick={() => handlePersonClick(id)}
                data-id={id}
              >
                <div
                  className="avatar is-logo"
                  style={{ "--avatar-url": `url('${PEOPLE[id].photo}')` } as React.CSSProperties}
                >
                  {id === "mauro" ? "MA" : "FT"}
                </div>
                <div className="p-badge">ext</div>
                <div className="p-name">
                  {PEOPLE[id].name}
                </div>
                <div className="p-role">
                  {SHORT_ROLE[id]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`org-skills${selected ? " active" : ""}`}>
          {person ? (
            <>
              <div className="card-hdr">
                <div
                  className={`card-ava ${person.photoKind === "logo" ? "is-logo" : "is-photo"}`}
                  style={{ "--avatar-url": `url('${person.photo}')` } as React.CSSProperties}
                />
                <div>
                  <div className="card-name">{person.name}</div>
                  <div className="card-role">{person.role}</div>
                </div>
              </div>
              <div className="card-section">Área · {person.section}</div>
              <p className="card-bio">{person.bio}</p>
              <div className="card-section">Skills & Stack</div>
              <div className="skill-tags">
                {person.skills.map((s, i) => (
                  <span
                    key={s}
                    className="skill-tag enter"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="card-foot">
                <span>{person.skills.length} competências</span>
                <span className="clear" onClick={() => setSelected(null)}>
                  × limpar seleção
                </span>
              </div>
            </>
          ) : (
            <div className="ph">
              <div className="ph-icon">◉</div>
              <div className="ph-t">Selecione um integrante</div>
              <div className="ph-s">
                Clique em qualquer pessoa do organograma para ver responsabilidades,
                skills e stack.
              </div>
            </div>
          )}
        </div>
      </div>

      <ChromeBottom
        prevLabel="← Visão Geral"
        prevIndex={1}
        nextLabel="Como se conecta →"
        nextIndex={3}
      />
    </section>
  );
}
