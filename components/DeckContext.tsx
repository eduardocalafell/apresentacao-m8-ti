"use client";

import { createContext, useContext } from "react";

export interface DeckContextValue {
  currentIndex: number;
  total: number;
  goTo: (i: number) => void;
}

export const DeckContext = createContext<DeckContextValue>({
  currentIndex: 0,
  total: 0,
  goTo: () => {},
});

export function useDeck(): DeckContextValue {
  return useContext(DeckContext);
}
