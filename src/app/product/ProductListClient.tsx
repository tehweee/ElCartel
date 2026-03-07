"use client";

import { useState, useCallback, useMemo } from "react";
import { SushiPlate } from "../component/ProductCarousel/SushiPlate";
import "../component/ProductCarousel/ProductCarousel.css";
import type { Product } from "../../lib/products";

interface Props {
  products: Product[];
}

export default function ProductListClient({ products }: Props) {
  const maxProductPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products],
  );

  const [nameFilter, setNameFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);
  const [openedKey, setOpenedKey] = useState<string | null>(null);

  const handleOpen = useCallback((key: string) => setOpenedKey(key), []);
  const handleClose = useCallback(() => setOpenedKey(null), []);

  function reset() {
    setNameFilter("");
    setMaxPrice(maxProductPrice);
    setOpenedKey(null);
  }

  const filtered = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      p.price <= maxPrice,
  );

  return (
    <div className="product-page-wrapper">
      {/* ── Page header ── */}
      <div className="product-page-header">
        <h1 className="product-page-title">The Arsenal</h1>
        <p className="product-page-subtitle">
          hover a plate &nbsp;·&nbsp; lift the dome &nbsp;·&nbsp; claim your
          skin
        </p>
      </div>

      {/* ── Body: filter sidebar + plate grid ── */}
      <div className="product-page-body">
        {/* Filter panel */}
        <aside className="product-filter-panel">
          <h2 className="filter-title">Filter</h2>

          {/* Name search */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="nameSearch">
              Name
            </label>
            <input
              id="nameSearch"
              type="text"
              placeholder="Search skins…"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Price slider */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="priceRange">
              Max price
            </label>
            <div className="filter-slider-row">
              <input
                id="priceRange"
                type="range"
                min={0}
                max={maxProductPrice}
                step={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="filter-slider"
              />
              <span className="filter-price-display">${maxPrice}</span>
            </div>
          </div>

          <hr className="filter-divider" />

          <p className="filter-count">
            {filtered.length} / {products.length} skins
          </p>

          <button type="button" onClick={reset} className="filter-reset-btn">
            Reset
          </button>
        </aside>

        {/* Sushi plate grid */}
        <main className="product-page-main">
          <div className="sushi-static-grid">
            {filtered.length === 0 ? (
              <p className="sushi-empty-state">no skins match the filter</p>
            ) : (
              filtered.map((p) => (
                <SushiPlate
                  key={p.id}
                  p={p}
                  instanceKey={String(p.id)}
                  isOpen={openedKey === String(p.id)}
                  canOpen={openedKey === null}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  isStatic
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
