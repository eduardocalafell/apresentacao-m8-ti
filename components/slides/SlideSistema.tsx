"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChapterLabel from "../ChapterLabel";
import ChromeBottom from "../ChromeBottom";

type SysMode = "live" | "window" | "preview";

const SYS_URL = "https://app.m8partners.com.br/";

interface Module {
  k: string;
  title: string;
  sub: string;
  tags: string[];
}

const MODULES: Module[] = [
  { k: "INT", title: "Integrações", sub: "Ingestão automatizada dos administradores e fontes externas.", tags: ["Singulare", "BTG Pactual", "Hemera", "Finaxis", "ANBIMA", "BCB · CDI", "ReceitaWS"] },
  { k: "CRT", title: "Carteira & Estoque", sub: "Posição diária dos fundos e recebíveis com cedente/sacado.", tags: ["Posições diárias", "PDD por faixa", "Renda fixa", "Saldos", "Recebíveis", "Liquidados"] },
  { k: "CRD", title: "Crédito", sub: "Elegibilidade, comitê e evolução de cotas sênior/mezanino/sub.", tags: ["Resumo diário", "Evolução de cotas", "Elegibilidade · 24 regras", "Comitê de crédito"] },
  { k: "RSC", title: "Risco & Passivo", sub: "Cotistas, distribuidores e exposição por fundo.", tags: ["Passivo · cotistas", "Concentração", "A vencer / vencidos", "Delta PDD"] },
  { k: "REL", title: "Relatórios BI", sub: "15 relatórios operacionais para tomada de decisão.", tags: ["Sintético", "Analítico", "Cedentes / Sacados", "Aportes & resgates"] },
  { k: "ADM", title: "Favoritos & Admin", sub: "Atalhos personalizados, parâmetros e monitoramento da plataforma.", tags: ["Monitoramento", "Parâmetros", "Jobs · 41 tipos"] },
];

export default function SlideSistema() {
  const [mode, setMode] = useState<SysMode>("live");
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<number | null>(null);
  const [winStatus, setWinStatus] = useState("janela ativa");

  const openSystemWindow = useCallback(() => {
    const w = screen.availWidth;
    const h = screen.availHeight;
    const feat = [
      `width=${w}`, `height=${h}`,
      "left=0", "top=0",
      "menubar=no", "toolbar=no", "location=yes",
      "status=yes", "resizable=yes", "scrollbars=yes",
      "fullscreen=yes",
    ].join(",");

    const popup = window.open(SYS_URL, "m8system", feat);
    if (!popup) {
      alert("Popup bloqueado. Permita popups para esta página.");
      return;
    }
    popupRef.current = popup;
    try {
      popup.moveTo(0, 0);
      popup.resizeTo(w, h);
    } catch { /* cross-origin */ }

    setMode("window");
    setWinStatus("janela ativa");

    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => {
      if (!popupRef.current || popupRef.current.closed) {
        if (pollRef.current) window.clearInterval(pollRef.current);
        setWinStatus("janela fechada");
        setMode((current) => (current === "window" ? "live" : current));
      }
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  const handleReload = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.location.reload();
    }
  };

  const handleFocusWindow = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
    } else {
      openSystemWindow();
    }
  };

  const handleCloseWindow = () => {
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    setMode("live");
  };

  const status =
    mode === "live"
      ? popupRef.current && !popupRef.current.closed
        ? { text: "● janela aberta", color: "var(--ok)" }
        : { text: "● ao vivo", color: "var(--ok)" }
      : mode === "window"
        ? popupRef.current && !popupRef.current.closed
          ? { text: "● janela ativa", color: "var(--ok)" }
          : { text: "● aguardando", color: "var(--muted-2)" }
        : { text: "● preview", color: "var(--blue-2)" };

  return (
    <section className="slide s-system" data-screen-label="09 Nosso Sistema">
      <ChapterLabel num={8} name="Nosso Sistema" />
      <div className="sys-header">
        <h2>
          Nosso <em>sistema</em>.
        </h2>
        <p className="intro">
          Plataforma proprietária construída pela TI — centraliza monitoramento, risco,
          crédito, comitê e dados da M8 em um único ambiente.
        </p>
      </div>

      <div className="sys-layout">
        <div className="sys-frame" data-mode={mode}>
          <div className="sys-frame-chrome">
            <div className="dots"><span></span><span></span><span></span></div>
            <div className="url-bar">
              <span className="lock">🔒</span>
              <span className="url">app.m8partners.com.br</span>
              <span className="status" style={{ color: status.color }}>{status.text}</span>
            </div>
            <div className="sys-modes">
              {(["live", "window", "preview"] as const).map((m) => (
                <button
                  key={m}
                  className={`sys-mode-btn${mode === m ? " active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m === "live" ? "Ao vivo" : m === "window" ? "Janela" : "Preview"}
                </button>
              ))}
            </div>
            <div className="frame-actions">
              <button className="frame-btn" title="Recarregar" onClick={handleReload}>↻</button>
              <button className="frame-btn" title="Abrir sistema em janela" onClick={openSystemWindow}>↗</button>
            </div>
          </div>
          <div className="sys-frame-viewport">
            <div className="sys-live" title="Abrir sistema em janela" onClick={openSystemWindow}>
              <div className="shot-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="shot" src="/assets/system-home.png" alt="Sistema M8 · home" />
                <div className="shot-scrim"></div>
                <div className="shot-tag">● preview do sistema</div>
                <div className="shot-cta">
                  <div className="play">▶</div>
                  <div className="lab">
                    <div className="t">Abrir sistema ao vivo</div>
                    <div className="s">clique para iniciar</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sys-windowed">
              <div className="fb-inner">
                <div className="win-dot"><span></span></div>
                <h3>Sistema rodando em janela separada</h3>
                <p>
                  O sistema está aberto em uma janela dedicada do navegador. Durante a
                  apresentação, posicione-a ao lado do deck para demonstrar os módulos
                  ao vivo.
                </p>
                <div className="fb-actions">
                  <button onClick={handleFocusWindow}>Trazer janela para frente</button>
                  <button className="ghost" onClick={handleCloseWindow}>Fechar janela</button>
                </div>
                <div className="fb-meta">
                  <span>app.m8partners.com.br</span>
                  <span>·</span>
                  <span>{winStatus}</span>
                </div>
              </div>
            </div>

            <div className="sys-preview">
              <div className="pv-chrome">
                <div className="pv-side">
                  <div className="pv-logo">M8</div>
                  <div className="pv-nav">
                    {["Portfólio", "Risco", "Operações", "Dados", "Relacionamento"].map((item, i) => (
                      <div key={item} className={`pv-nav-item${i === 0 ? " active" : ""}`}>
                        <span className="d"></span>{item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pv-main">
                  <div className="pv-topbar">
                    <div className="pv-crumb">Portfólio / Consolidado</div>
                    <div className="pv-user">G · Gestor</div>
                  </div>
                  <div className="pv-grid">
                    <div className="pv-card big">
                      <div className="pv-card-h">Exposição total</div>
                      <div className="pv-card-n">R$ 2,4 bi</div>
                      <svg className="pv-spark" viewBox="0 0 300 60" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#1E4BFF" strokeWidth="2" points="0,45 30,40 60,38 90,30 120,35 150,22 180,28 210,18 240,22 270,12 300,14" />
                        <polyline fill="none" stroke="#1E4BFF" strokeWidth="1" opacity="0.25" points="0,50 30,48 60,46 90,40 120,44 150,34 180,38 210,30 240,34 270,24 300,26" />
                      </svg>
                    </div>
                    <div className="pv-card">
                      <div className="pv-card-h">Retorno YTD</div>
                      <div className="pv-card-n pv-ok">+14,2%</div>
                      <div className="pv-card-sub">CDI · +240 bps</div>
                    </div>
                    <div className="pv-card">
                      <div className="pv-card-h">Vol. 21d</div>
                      <div className="pv-card-n">8,4%</div>
                      <div className="pv-card-sub">Limite · 12%</div>
                    </div>
                    <div className="pv-card wide">
                      <div className="pv-card-h">Alocação por classe</div>
                      <div className="pv-bars">
                        <div className="pv-bar"><span className="b" style={{ width: "42%" }}></span><label>Renda Fixa · 42%</label></div>
                        <div className="pv-bar"><span className="b" style={{ width: "28%" }}></span><label>Ações · 28%</label></div>
                        <div className="pv-bar"><span className="b" style={{ width: "18%" }}></span><label>Multimercado · 18%</label></div>
                        <div className="pv-bar"><span className="b" style={{ width: "12%" }}></span><label>Caixa · 12%</label></div>
                      </div>
                    </div>
                    <div className="pv-card">
                      <div className="pv-card-h">Alertas</div>
                      <div className="pv-alerts">
                        <div className="pv-alert ok">● Enquadramento OK</div>
                        <div className="pv-alert warn">● 2 limites próximos</div>
                        <div className="pv-alert">● 4 eventos do dia</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pv-badge">Preview visual · representação ilustrativa</div>
            </div>
          </div>
        </div>

        <aside className="sys-side">
          <div className="sys-side-eyebrow">O que construímos</div>
          <div className="sys-modules">
            {MODULES.map((m) => (
              <div key={m.k} className="mod group">
                <div className="mod-k">{m.k}</div>
                <div className="mod-body">
                  <h4>{m.title}</h4>
                  <p className="mod-sub">{m.sub}</p>
                  <div className="mod-tags">
                    {m.tags.map((t) => (
                      <span key={t} className="mod-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sys-stats">
            <div className="sst"><div className="num">100%</div><div className="lbl">proprietário</div></div>
            <div className="sst"><div className="num">7</div><div className="lbl">integrações</div></div>
            <div className="sst"><div className="num">24/7</div><div className="lbl">disponível</div></div>
          </div>
        </aside>
      </div>

      <ChromeBottom
        prevLabel="← Interfaces"
        prevIndex={7}
        nextLabel="↺ Retornar à capa"
        nextIndex={0}
      />
    </section>
  );
}
