import { useRef } from "react";
import { cn } from "@/utils/cs";

export type SegmentedControlOption<T extends string = string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string = string> = {
  label?: string;
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function SegmentedControl<T extends string = string>({
  label,
  options,
  value,
  onChange,
  name,
  disabled = false,
  error,
  className,
}: SegmentedControlProps<T>) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (disabled || options.length === 0) return;

    let targetIndex: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % options.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = options.length - 1;
    }

    if (targetIndex !== null) {
      onChange(options[targetIndex].value);
      buttonRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "flex items-center p-1 rounded-xl bg-[#f0f4f8] border border-neutral-200/60",
          disabled && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              name={name}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 text-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#078bc5]",
                isSelected
                  ? "bg-white text-[#078bc5] font-semibold shadow-xs"
                  : "text-[#5d6878] hover:text-[#101827] hover:bg-white/40"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-semantic-error font-medium">{error}</p>
      )}
    </div>
  );
}
