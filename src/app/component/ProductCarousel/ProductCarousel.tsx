"use client";
import { useState, useCallback } from "react";
import "./ProductCarousel.css";
import { SushiPlate } from "./SushiPlate";
import type { Product } from "../../../lib/products";

interface Props {
  products: Product[];
}

interface RelaxMsg {
  emoji: string;
  main: string;
  sub: string;
}

const RELAX_MESSAGES: RelaxMsg[] = [
  { emoji: "🍣", main: "bro it went around the bend", sub: "let it pass king" },
  { emoji: "💀", main: "she's gone fr", sub: "there'll be another one" },
  {
    emoji: "😭",
    main: "bro stop chasing it",
    sub: "the train waits for no one",
  },
  { emoji: "🌀", main: "relax king", sub: "life's too short to chase sushi" },
  {
    emoji: "🫡",
    main: "respectfully... let go",
    sub: "it went around the corner",
  },
];

export default function ProductCarousel({ products }: Props) {
  const [openedKey, setOpenedKey] = useState<string | null>(null);
  const [relaxMsg, setRelaxMsg] = useState<RelaxMsg | null>(null);
  const isAnyOpen = openedKey !== null;

  const handleOpen = useCallback((key: string) => setOpenedKey(key), []);

  const handleClose = useCallback(() => {
    setOpenedKey(null);
    setRelaxMsg(null);
  }, []);

  const handleRelaxPopup = useCallback(() => {
    const msg =
      RELAX_MESSAGES[Math.floor(Math.random() * RELAX_MESSAGES.length)];
    setRelaxMsg(msg);
  }, []);

  const renderStrip = (beltIndex: number, reverse = false) => (
    <div
      className={`sushi-belt-strip ${
        reverse ? "animate-carousel-reverse" : "animate-carousel"
      }`}
      style={{ animationPlayState: isAnyOpen ? "paused" : "running" }}
      aria-hidden={beltIndex % 2 === 1 ? true : undefined}
    >
      {products.map((p) => {
        const instanceKey = `${beltIndex}-${p.id}`;
        return (
          <SushiPlate
            key={instanceKey}
            p={p}
            instanceKey={instanceKey}
            isOpen={openedKey === instanceKey}
            canOpen={!isAnyOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            onRelaxPopup={handleRelaxPopup}
          />
        );
      })}
    </div>
  );

  return (
    <section className="sushi-train-section">
      <div className="sushi-track-outer">
        <div className="sushi-track-belt">
          {renderStrip(0)}
          {renderStrip(1)}
        </div>
      </div>

      {/* Title sits in the gap between the two belts */}
      <div className="sushi-section-header">
        <h2 className="font-hero sushi-section-title">
          Skins — <span className="sushi-title-accent">sushi train style</span>
        </h2>
      </div>

      <div className="sushi-track-outer">
        <div className="sushi-track-belt">
          {renderStrip(2, true)}
          {renderStrip(3, true)}
        </div>
      </div>

      {/* Relax popup — position:fixed so it's always centered on viewport */}
      {relaxMsg && (
        <div className="relax-popup" key={relaxMsg.main}>
          <span className="relax-popup-emoji">{relaxMsg.emoji}</span>
          <span className="relax-popup-text">{relaxMsg.main}</span>
          <span className="relax-popup-sub">{relaxMsg.sub}</span>
        </div>
      )}
    </section>
  );
}
