"use client";

import { useDeck } from "./DeckContext";

interface ChromeBottomProps {
  prevLabel?: string;
  prevIndex?: number;
  nextLabel?: string;
  nextIndex?: number;
}

export default function ChromeBottom({
  prevLabel,
  prevIndex,
  nextLabel,
  nextIndex,
}: ChromeBottomProps) {
  const { currentIndex, total, goTo } = useDeck();

  return (
    <div className="chrome-bot">
      {prevLabel !== undefined && prevIndex !== undefined ? (
        <div className="nav-prev" onClick={() => goTo(prevIndex)}>
          {prevLabel}
        </div>
      ) : (
        <div />
      )}
      <div className="progress">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`seg${i <= currentIndex ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      {nextLabel !== undefined && nextIndex !== undefined ? (
        <div className="nav-next" onClick={() => goTo(nextIndex)}>
          {nextLabel}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
