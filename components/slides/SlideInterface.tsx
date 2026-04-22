"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

interface Area {
  id: string;
  label: string;
  freq: string;
  intensity: string;
  desc: string;
  style: React.CSSProperties;
}

const AREAS: Area[] = [
  { id: "portfolio", label: "Gestão de Portfólio", freq: "Diária", intensity: "Alta", desc: "Ferramentas de decisão, dados de mercado, execução.", style: { left: "22%", top: "18%" } },
  { id: "risco", label: "Risco", freq: "Diária", intensity: "Alta", desc: "Modelos, limites, monitoramento em tempo quase-real.", style: { left: "50%", top: "12%" } },
  { id: "compliance", label: "Compliance", freq: "Semanal", intensity: "Média", desc: "Trilhas de auditoria, controles, reportes regulatórios.", style: { left: "78%", top: "18%" } },
  { id: "back", label: "Back Office", freq: "Diária", intensity: "Alta", desc: "Liquidação, conciliação, integrações com custodiantes.", style: { left: "15%", top: "50%" } },
  { id: "contr", label: "Controladoria", freq: "Diária", intensity: "Alta", desc: "Precificação, fechamento, cota e relatórios.", style: { left: "85%", top: "50%" } },
  { id: "rel", label: "Relacionamento", freq: "Semanal", intensity: "Média", desc: "Portal de investidores, materiais, CRM.", style: { left: "22%", top: "85%" } },
  { id: "jur", label: "Jurídico", freq: "Eventual", intensity: "Sob demanda", desc: "Contratos, LGPD, due diligence de fornecedores.", style: { left: "50%", top: "92%" } },
  { id: "adm", label: "Pessoas & Adm.", freq: "Eventual", intensity: "Sob demanda", desc: "Onboarding, equipamentos, colaboração interna.", style: { left: "78%", top: "85%" } },
];

export default function SlideInterface() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const meRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const drawEdges = useCallback(() => {
    const map = mapRef.current;
    const svg = svgRef.current;
    const me = meRef.current;
    if (!map || !svg || !me) return;
    const rect = map.getBoundingClientRect();
    if (!rect.width) return;
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = "";
    const mr = me.getBoundingClientRect();
    const mx = (mr.left + mr.right) / 2 - rect.left;
    const my = (mr.top + mr.bottom) / 2 - rect.top;
    map.querySelectorAll<HTMLElement>(".inode:not(.me)").forEach((n) => {
      const nr = n.getBoundingClientRect();
      const nx = (nr.left + nr.right) / 2 - rect.left;
      const ny = (nr.top + nr.bottom) / 2 - rect.top;
      const intensity = n.dataset.intensity;
      const high = intensity === "Alta";
      const dash = high ? "" : "5 5";
      const activeForThis = active && n.dataset.area === active;
      const fallback = active ? 0.15 : high ? 0.75 : 0.45;
      const opacity = activeForThis ? 1 : fallback;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(mx));
      line.setAttribute("y1", String(my));
      line.setAttribute("x2", String(nx));
      line.setAttribute("y2", String(ny));
      line.setAttribute("stroke", "#1E4BFF");
      line.setAttribute("stroke-width", String(high ? 1.8 : 1.2));
      line.setAttribute("stroke-dasharray", dash);
      line.setAttribute("opacity", String(opacity));
      line.dataset.for = n.dataset.area || "";
      svg.appendChild(line);
    });
  }, [active]);

  useLayoutEffect(() => {
    const t = setTimeout(drawEdges, 200);
    window.addEventListener("resize", drawEdges);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", drawEdges);
    };
  }, [drawEdges]);

  useEffect(() => {
    const stage = document.querySelector("deck-stage");
    if (!stage) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ index: number }>;
      if (ce.detail.index === 7) setTimeout(drawEdges, 100);
    };
    stage.addEventListener("slidechange", handler);
    return () => stage.removeEventListener("slidechange", handler);
  }, [drawEdges]);

  const activeArea = AREAS.find((a) => a.id === active) || null;

  return (
    <section className="slide s-content s7" data-screen-label="08 Interface">
      <ChapterLabel num={7} name="Interface com outras áreas" />
      <div className="left">
        <h2>
          Interface com <em>outras áreas</em>.
        </h2>
        <p className="intro">
          A TI é ponto de encontro de toda a gestora. Clique em cada área para ver
          frequência, intensidade e natureza da relação.
        </p>

        <div ref={mapRef} className="interface-map">
          <svg ref={svgRef} className="edges" viewBox="0 0 900 520" preserveAspectRatio="none"></svg>

          <div ref={meRef} className="inode me" data-area="self" style={{ left: "50%", top: "50%" }}>
            <span className="d"></span>TI
          </div>

          {AREAS.map((a) => (
            <div
              key={a.id}
              className={`inode${active === a.id ? " active" : ""}`}
              data-area={a.id}
              data-freq={a.freq}
              data-intensity={a.intensity}
              data-desc={a.desc}
              style={a.style}
              onClick={() => setActive(a.id)}
            >
              <span className="d"></span>
              {a.label}
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <div className="right-label">Interfaces · 07</div>
      </div>

      <div className="panel iside">
        <h4>{activeArea ? activeArea.label : "Clique em uma área"}</h4>
        <p>{activeArea ? activeArea.desc : "Explore as interfaces da TI com as demais áreas da gestora."}</p>
        <div className="meta-row">
          <span className="k">Frequência</span>
          <span className="v">{activeArea ? activeArea.freq : "—"}</span>
        </div>
        <div className="meta-row">
          <span className="k">Intensidade</span>
          <span className="v">{activeArea ? activeArea.intensity : "—"}</span>
        </div>
        <div className="meta-row">
          <span className="k">Natureza</span>
          <span className="v">Colaborativa</span>
        </div>
      </div>

      <ChromeBottom
        prevLabel="← Riscos"
        prevIndex={6}
        nextLabel="Nosso Sistema →"
        nextIndex={8}
      />
    </section>
  );
}
