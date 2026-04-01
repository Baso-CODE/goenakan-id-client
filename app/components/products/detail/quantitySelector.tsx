"use client";

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({
  quantity,
  min = 1,
  onChange,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };
  const increment = () => onChange(quantity + 1);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-stone-700">Quantity:</p>
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          disabled={quantity <= min}
          className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg leading-none">
          −
        </button>
        <span className="w-10 text-center text-sm font-medium text-stone-800">
          {quantity}
        </span>
        <button
          onClick={increment}
          className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-50 transition-colors text-lg leading-none">
          +
        </button>
      </div>
    </div>
  );
}
