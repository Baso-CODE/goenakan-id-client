"use client";

import {
  DynamicFilterOptions,
  FilterOption,
  FilterState,
} from "@/app/types/product.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (
    keyOrObj: keyof FilterState | Partial<FilterState>,
    value?: string,
  ) => void;
  dynamicOptions: DynamicFilterOptions;
}

const AVAILABILITY_OPTIONS: FilterOption[] = [
  { label: "All Status", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Best Selling", value: "best_selling" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const QUICK_PRICE_OPTIONS = [
  { label: "Under Rp 20.000", min: "", max: "20000" },
  { label: "Rp 20.000 – 50.000", min: "20000", max: "50000" },
  { label: "Above Rp 50.000", min: "50000", max: "" },
];

export function FilterBar({
  filters,
  onFilterChange,
  dynamicOptions,
}: FilterBarProps) {
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...(dynamicOptions.categories || []),
  ];

  const [localMin, setLocalMin] = useState(filters.minPrice || "");
  const [localMax, setLocalMax] = useState(filters.maxPrice || "");

  const [prevMin, setPrevMin] = useState(filters.minPrice);
  const [prevMax, setPrevMax] = useState(filters.maxPrice);

  if (filters.minPrice !== prevMin || filters.maxPrice !== prevMax) {
    setPrevMin(filters.minPrice);
    setPrevMax(filters.maxPrice);
    setLocalMin(filters.minPrice || "");
    setLocalMax(filters.maxPrice || "");
  }

  const handleApplyCustomPrice = () => {
    onFilterChange({
      minPrice: localMin,
      maxPrice: localMax,
    });
  };

  const handleQuickPriceClick = (min: string, max: string) => {
    setLocalMin(min);
    setLocalMax(max);
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleClearPrice = () => {
    setLocalMin("");
    setLocalMax("");
    onFilterChange({ minPrice: "", maxPrice: "" });
  };

  let priceLabel = "All Prices";
  if (filters.minPrice || filters.maxPrice) {
    const quickMatch = QUICK_PRICE_OPTIONS.find(
      (o) => o.min === filters.minPrice && o.max === filters.maxPrice,
    );
    if (quickMatch) {
      priceLabel = quickMatch.label;
    } else {
      const minText = filters.minPrice
        ? `Rp ${Number(filters.minPrice).toLocaleString("id-ID")}`
        : "0";
      const maxText = filters.maxPrice
        ? `Rp ${Number(filters.maxPrice).toLocaleString("id-ID")}`
        : "∞";
      priceLabel = `${minText} - ${maxText}`;
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. FILTER CATEGORY */}
      <FilterSelect
        label="Category"
        options={categoryOptions}
        value={filters.category}
        onChange={(val) => onFilterChange("category", val)}
      />

      {/* ✨ 2. FILTER ATRIBUT DINAMIS (Warna, Ukuran, dll otomatis dirender dari database) */}
      {dynamicOptions.attributes?.map((attr) => (
        <FilterSelect
          key={attr.name}
          label={attr.name}
          options={[
            { label: `All ${attr.name}`, value: "all" },
            ...attr.options,
          ]}
          value={filters.attributes?.[attr.name] || "all"}
          onChange={(val) => {
            onFilterChange({
              attributes: {
                ...filters.attributes,
                [attr.name]: val,
              },
            });
          }}
        />
      ))}

      {/* 3. FILTER HARGA (Custom + Quick Select) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 border border-stone-300 rounded-sm bg-white hover:bg-stone-50 text-xs text-stone-700 gap-1.5 px-3 font-normal focus-visible:ring-1 focus-visible:ring-stone-400 focus-visible:ring-offset-0">
            <span className="text-stone-400">Price:</span>
            <span className="font-medium text-stone-700 uppercase tracking-wide text-[11px] max-w-45 truncate">
              {priceLabel}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-4 rounded-sm border border-stone-200 shadow-md bg-white space-y-4"
          align="start">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Quick Select
            </div>
            <div className="flex flex-col gap-1">
              {QUICK_PRICE_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "text-left text-xs py-1.5 px-2 rounded-sm transition-colors hover:bg-stone-50 text-stone-700",
                    filters.minPrice === opt.min &&
                      filters.maxPrice === opt.max &&
                      "bg-stone-100 font-medium text-stone-900",
                  )}
                  onClick={() => handleQuickPriceClick(opt.min, opt.max)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Custom Price (Rp)
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-8 text-xs rounded-sm border-stone-300 bg-white p-2"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
              />
              <span className="text-stone-400 text-xs">-</span>
              <Input
                type="number"
                placeholder="Max"
                className="h-8 text-xs rounded-sm border-stone-300 bg-white p-2"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 pt-1">
              {(filters.minPrice || filters.maxPrice) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-stone-500 rounded-sm hover:bg-stone-50 flex-1"
                  onClick={handleClearPrice}>
                  Clear
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="h-7 text-[11px] bg-stone-700 hover:bg-stone-800 text-white rounded-sm flex-1 font-medium"
                onClick={handleApplyCustomPrice}>
                Apply Price
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 4. FILTER AVAILABILITY */}
      <FilterSelect
        label="Availability"
        options={AVAILABILITY_OPTIONS}
        value={filters.availability}
        onChange={(val) => onFilterChange("availability", val)}
      />

      {/* 5. FILTER SORT */}
      <FilterSelect
        label="Sort"
        options={SORT_OPTIONS}
        value={filters.sort}
        onChange={(val) => onFilterChange("sort", val)}
      />
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (val: string) => void;
}) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 border border-stone-300 rounded-sm bg-white hover:bg-stone-50 text-xs text-stone-700 gap-1.5 px-3 min-w-fit focus:ring-1 focus:ring-stone-400 focus:ring-offset-0">
        <span className="text-stone-400 font-normal">{label}:</span>
        <SelectValue>
          <span className="font-medium text-stone-700 uppercase tracking-wide text-[11px]">
            {selectedLabel}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-sm border border-stone-200 shadow-md bg-white">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs text-stone-700 focus:bg-stone-50 cursor-pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
