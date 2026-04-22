"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DeckContext } from "./DeckContext";
import TocPanel from "./TocPanel";
import SlideCover from "./slides/SlideCover";
import SlideVisaoGeral from "./slides/SlideVisaoGeral";
import SlideOrganograma from "./slides/SlideOrganograma";
import SlideComoConecta from "./slides/SlideComoConecta";
import SlideResponsabilidades from "./slides/SlideResponsabilidades";
import SlideGeraValor from "./slides/SlideGeraValor";
import SlideRiscos from "./slides/SlideRiscos";
import SlideInterface from "./slides/SlideInterface";
import SlideSistema from "./slides/SlideSistema";
import type { DeckStageElement } from "@/types/deck-stage";

const TOTAL = 9;

export default function DeckShell() {
  const stageRef = useRef<DeckStageElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ index: number }>;
      setCurrentIndex(ce.detail.index);
    };
    el.addEventListener("slidechange", handler);
    return () => el.removeEventListener("slidechange", handler);
  }, []);

  const goTo = useCallback((i: number) => {
    stageRef.current?.goTo(i);
  }, []);

  return (
    <DeckContext.Provider value={{ currentIndex, total: TOTAL, goTo }}>
      <deck-stage ref={stageRef as React.Ref<HTMLElement>}>
        <SlideCover />
        <SlideVisaoGeral />
        <SlideOrganograma />
        <SlideComoConecta />
        <SlideResponsabilidades />
        <SlideGeraValor />
        <SlideRiscos />
        <SlideInterface />
        <SlideSistema />
      </deck-stage>

      <TocPanel />
    </DeckContext.Provider>
  );
}
