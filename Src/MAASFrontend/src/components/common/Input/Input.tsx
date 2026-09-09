import { useId } from "react";
import { cn } from "@/utils/cs";

type InputSize = "sm" | "md" | "lg";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export default function Input({
  label,
  error,
  hint,
  size,
  icon,
  rightElement,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const sizeValue: InputSize = size || "md";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const baseStyles = cn(
    "w-full",
    "border border-neutral-300",
    "rounded-lg",
    "bg-white",
    "text-neutral-900",
    "placeholder-neutral-400",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 focus:border-primary-500",
    "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
    sizeStyles[sizeValue],
    rightElement && "pr-11",
  );

  const errorStyles =
    error &&
    "border-semantic-error focus:ring-semantic-error focus:border-semantic-error";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          {...props}
          id={inputId}
          className={cn(baseStyles, errorStyles, icon && "pl-10", className)}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-semantic-error font-medium m-0">
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500 m-0">{hint}</p>
      )}
    </div>
  );
}
