"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Product } from "../../../lib/products";

export interface PlateProps {
  p: Product;
  instanceKey: string;
  isOpen: boolean;
  canOpen: boolean;
  onOpen: (key: string) => void;
  onClose: () => void;
  onRelaxPopup?: () => void;
  /** Pass true for the static product-page grid — skips the "carried away" IntersectionObserver */
  isStatic?: boolean;
}

export function SushiPlate({
  p,
  instanceKey,
  isOpen,
  canOpen,
  onOpen,
  onClose,
  onRelaxPopup,
  isStatic = false,
}: PlateProps) {
  const [isClosing, setIsClosing] = useState(false);
  const trackItemRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const relaxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRelaxTimers = useCallback(() => {
    if (relaxTimerRef.current) {
      clearTimeout(relaxTimerRef.current);
      relaxTimerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    clearRelaxTimers();
    isClosingRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      isClosingRef.current = false;
      setIsClosing(false);
      onClose();
    }, 600);
  }, [onClose, clearRelaxTimers]);

  const handleMouseEnter = () => {
    if (!canOpen || isClosingRef.current) return;
    onOpen(instanceKey);
  };

  const handleMouseLeave = () => {
    if (!isOpen) return;
    clearRelaxTimers();
    handleClose();
  };

  // "Carried away" sequence — only runs on the moving belt, not the static grid
  useEffect(() => {
    if (isStatic || !isOpen) {
      clearRelaxTimers();
      return;
    }
    const el = trackItemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.45) {
          if (!relaxTimerRef.current && !autoCloseTimerRef.current) {
            relaxTimerRef.current = setTimeout(() => {
              relaxTimerRef.current = null;
              onRelaxPopup?.();
              autoCloseTimerRef.current = setTimeout(() => {
                autoCloseTimerRef.current = null;
                handleClose();
              }, 2500);
            }, 1000);
          }
        } else {
          clearRelaxTimers();
        }
      },
      { threshold: [0, 0.45, 1] },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearRelaxTimers();
    };
  }, [isOpen, isStatic, handleClose, onRelaxPopup, clearRelaxTimers]);

  const domeClass = [
    "sushi-dome",
    isOpen && !isClosing ? "dome-open" : "",
    isClosing ? "dome-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const infoClass = [
    "sushi-info",
    isClosing ? "info-closing" : isOpen ? "info-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="sushi-track-item"
      ref={trackItemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`sushi-plate${isOpen ? " plate-open" : ""}`}>
        <div className="plate-base">
          <img src={p.image} alt={p.product_name} className="plate-img" />
        </div>
        <div className={domeClass} />
        {isOpen && (
          <div className={infoClass}>
            <p className="sushi-info-name">{p.product_name}</p>
            <p className="sushi-info-price">${p.price}</p>
            <Link href={`/product/${p.id}`} className="btn-view">
              View More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
