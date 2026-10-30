"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/accessories";
import type { CategoryKey } from "@/lib/accessories";
import type { CatalogFilters as FilterValues } from "@/lib/catalog-utils";

interface Props {
  filters: FilterValues;
  brands: string[];
  maxPrice: number;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export function CatalogFilters({
  filters,
  brands,
  maxPrice,
  onChange,
  onReset,
}: Props) {
  const priceRange = filters.price;
  const [minimumPrice, maximumPrice] = priceRange;
  const [minValue, setMinValue] = useState(String(minimumPrice));
  const [maxValue, setMaxValue] = useState(
    maximumPrice === null ? "" : String(maximumPrice),
  );
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    setMinValue(String(priceRange[0]));
    setMaxValue(priceRange[1] === null ? "" : String(priceRange[1]));
    setPriceError("");
  }, [priceRange]);

  function toggleCategory(key: CategoryKey) {
    onChange({
      ...filters,
      categories: filters.categories.includes(key)
        ? filters.categories.filter((value) => value !== key)
        : [...filters.categories, key],
    });
  }

  function toggleBrand(brand: string) {
    const selected = filters.brands.some(
      (value) => value.toLocaleLowerCase() === brand.toLocaleLowerCase(),
    );
    onChange({
      ...filters,
      brands: selected
        ? filters.brands.filter(
            (value) => value.toLocaleLowerCase() !== brand.toLocaleLowerCase(),
          )
        : [...filters.brands, brand],
    });
  }

  function applyPrice() {
    const min = minValue.trim() === "" ? 0 : Number(minValue);
    const max = maxValue.trim() === "" ? null : Number(maxValue);
    if (
      !Number.isFinite(min) ||
      min < 0 ||
      (max !== null && (!Number.isFinite(max) || max < min))
    ) {
      setPriceError(
        "Перевірте діапазон: ціна «до» має бути не меншою за ціну «від».",
      );
      return;
    }
    setPriceError("");
    onChange({ ...filters, price: [min, max] });
  }

  const brandMap = new Map<string, string>();
  for (const brand of [...brands, ...filters.brands]) {
    if (!brandMap.has(brand.toLocaleLowerCase()))
      brandMap.set(brand.toLocaleLowerCase(), brand);
  }
  const visibleBrands = Array.from(brandMap.values());
  const inputClass =
    "h-10 min-w-0 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Фільтри</h2>
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onClick={onReset}
        >
          Скинути все
        </button>
      </div>
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-semibold">Категорія</legend>
        {CATEGORIES.map((category) => (
          <label
            key={category.key}
            className="flex cursor-pointer items-center gap-3 text-sm"
          >
            <input
              type="checkbox"
              className="size-4 accent-current"
              checked={filters.categories.includes(category.key)}
              onChange={() => toggleCategory(category.key)}
            />
            <span>{category.label}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="space-y-3 border-t border-border pt-4">
        <legend className="text-sm font-semibold">Бренд</legend>
        {visibleBrands.length ? (
          visibleBrands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="checkbox"
                className="size-4 accent-current"
                checked={filters.brands.some(
                  (value) =>
                    value.toLocaleLowerCase() === brand.toLocaleLowerCase(),
                )}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            Бренди з’являться після завантаження товарів.
          </p>
        )}
      </fieldset>
      <form
        className="space-y-3 border-t border-border pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          applyPrice();
        }}
      >
        <h3 className="text-sm font-semibold">Ціна, ₴</h3>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-muted-foreground">
            <span>Від</span>
            <input
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={minValue}
              onChange={(event) => setMinValue(event.target.value)}
              aria-label="Мінімальна ціна"
            />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            <span>До</span>
            <input
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={maxValue}
              placeholder={String(maxPrice)}
              onChange={(event) => setMaxValue(event.target.value)}
              aria-label="Максимальна ціна, порожнє поле — без обмеження"
            />
          </label>
        </div>
        {priceError && (
          <p role="alert" className="text-xs text-destructive">
            {priceError}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Застосувати ціну
        </button>
      </form>
    </div>
  );
}
