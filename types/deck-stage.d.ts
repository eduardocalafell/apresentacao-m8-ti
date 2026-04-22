import type { DetailedHTMLProps, HTMLAttributes } from "react";

export interface DeckStageElement extends HTMLElement {
  readonly index: number;
  readonly length: number;
  goTo(i: number): void;
  next(): void;
  prev(): void;
  reset(): void;
}

export interface SlideChangeDetail {
  index: number;
  previousIndex: number;
  total: number;
  slide: HTMLElement | null;
  previousSlide: HTMLElement | null;
  reason: "init" | "keyboard" | "click" | "tap" | "api";
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "deck-stage": DetailedHTMLProps<
          HTMLAttributes<HTMLElement> & {
            width?: string | number;
            height?: string | number;
            noscale?: boolean | "";
          },
          HTMLElement
        >;
      }
    }
  }
}

export {};
