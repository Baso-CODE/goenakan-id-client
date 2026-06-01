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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < min) {
      onChange(min);
    }
  };

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

        <input
          type="number"
          min={min}
          value={quantity || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onChange(isNaN(val) ? 0 : val);
          }}
          onBlur={handleBlur}
          className="w-12 text-center text-sm font-medium text-stone-800 border-none p-0 focus:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          onClick={increment}
          className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-50 transition-colors text-lg leading-none">
          +
        </button>
      </div>
    </div>
  );
}
