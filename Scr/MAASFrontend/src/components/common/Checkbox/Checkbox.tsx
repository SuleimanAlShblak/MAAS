import { cn } from "@/utils/cs";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Checkbox({
  label,
  error,
  id,
  className,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          className={cn(
            "w-5 h-5",
            "rounded-md",
            "border-2 border-neutral-300",
            "cursor-pointer",
            "accent-primary-600",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-semantic-error",
            className,
          )}
        />

        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-neutral-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-semantic-error font-medium ml-7">{error}</p>
      )}
    </div>
  );
}
