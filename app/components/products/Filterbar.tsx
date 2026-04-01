"use client";

import { FilterOption, FilterState } from "@/app/products/types/product.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "Stainless Steel", value: "STAINLESS STEEL" },
  { label: "Bamboo", value: "BAMBOO" },
  { label: "Ceramic", value: "CERAMIC" },
  { label: "Plastic", value: "PLASTIC" },
];

const COLOR_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Brown", value: "brown" },
  { label: "Black", value: "black" },
  { label: "Silver", value: "silver" },
  { label: "White", value: "white" },
];

const SIZE_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const PRICE_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Under Rp 20.000", value: "under_20000" },
  { label: "Rp 20.000 – 50.000", value: "20000_50000" },
  { label: "Above Rp 50.000", value: "above_50000" },
];

const AVAILABILITY_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Best Selling", value: "best_selling" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

interface FilterSelectProps {
  label: string;
  filterKey: keyof FilterState;
  options: FilterOption[];
  value: string;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

function FilterSelect({
  label,
  filterKey,
  options,
  value,
  onFilterChange,
}: FilterSelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <Select
      value={value}
      onValueChange={(val) => onFilterChange(filterKey, val)}>
      <SelectTrigger className="h-9 border border-stone-300 rounded-sm bg-white hover:bg-stone-50 text-xs text-stone-700 gap-1.5 px-3 min-w-fit focus:ring-1 focus:ring-stone-400 focus:ring-offset-0">
        <span className="text-stone-400 font-normal">{label}:</span>
        <SelectValue>
          <span className="font-medium text-stone-700 uppercase tracking-wide text-[11px]">
            {selectedLabel}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-sm border border-stone-200 shadow-md">
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

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        label="category"
        filterKey="category"
        options={CATEGORY_OPTIONS}
        value={filters.category}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="color"
        filterKey="color"
        options={COLOR_OPTIONS}
        value={filters.color}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="size"
        filterKey="size"
        options={SIZE_OPTIONS}
        value={filters.size}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="price"
        filterKey="price"
        options={PRICE_OPTIONS}
        value={filters.price}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="availability"
        filterKey="availability"
        options={AVAILABILITY_OPTIONS}
        value={filters.availability}
        onFilterChange={onFilterChange}
      />
      <FilterSelect
        label="sort"
        filterKey="sort"
        options={SORT_OPTIONS}
        value={filters.sort}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
