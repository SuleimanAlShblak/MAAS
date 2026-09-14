import { useId, useState, useEffect } from "react";
import { cn } from "@/utils/cs";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "floating" | "standard";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
};

export default function Input({
  label,
  error,
  hint,
  size = "md",
  variant = "floating",
  icon,
  rightElement,
  id,
  className,
  containerClassName,
  placeholder,
  value,
  defaultValue,
  disabled,
  required,
  onFocus,
  onBlur,
  onChange,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintOrErrorId = `${inputId}-desc`;

  const [isFocused, setIsFocused] = useState(false);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      setInternalValue(defaultValue);
    }
  }, [isControlled, defaultValue]);

  const currentValue = isControlled ? value : internalValue;
  const hasValue =
    currentValue !== undefined &&
    currentValue !== null &&
    String(currentValue).trim().length > 0;

  const isExpanded =
    props["aria-expanded"] === true || props["aria-expanded"] === "true";

  const isFloatingActive = isFocused || hasValue || isExpanded;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const sizeClasses = {
    sm: {
      input: "h-9 text-xs px-3",
      inputWithIcon: "pl-9",
      labelRestingWithIcon: "left-9 top-1/2 -translate-y-1/2 text-xs",
      labelRestingNoIcon: "left-3 top-1/2 -translate-y-1/2 text-xs",
      labelFloating: "left-2.5 top-0 -translate-y-1/2 text-[0.6875rem]",
    },
    md: {
      input: "h-12 text-sm px-3.5",
      inputWithIcon: "pl-10",
      labelRestingWithIcon: "left-10 top-1/2 -translate-y-1/2 text-sm",
      labelRestingNoIcon: "left-3.5 top-1/2 -translate-y-1/2 text-sm",
      labelFloating: "left-2.5 top-0 -translate-y-1/2 text-xs",
    },
    lg: {
      input: "h-14 text-base px-4",
      inputWithIcon: "pl-11",
      labelRestingWithIcon: "left-11 top-1/2 -translate-y-1/2 text-base",
      labelRestingNoIcon: "left-4 top-1/2 -translate-y-1/2 text-base",
      labelFloating: "left-3 top-0 -translate-y-1/2 text-xs",
    },
  }[size];

  const baseInputStyles = cn(
    "peer w-full rounded-lg bg-white text-neutral-900 transition-all duration-200",
    "border border-neutral-300",
    "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
    "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200",
    sizeClasses.input,
    icon && sizeClasses.inputWithIcon,
    rightElement && "pr-11",
    variant === "floating" &&
      (isFloatingActive
        ? "placeholder:text-neutral-400 placeholder:opacity-100"
        : "placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-neutral-400 placeholder:transition-opacity placeholder:duration-150"),
    error &&
      "border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20"
  );

  return (
    <div className={cn("w-full", containerClassName)}>
      {variant === "standard" && label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
          {required && <span className="text-semantic-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-[1]",
              disabled
                ? "text-neutral-300"
                : error
                ? "text-semantic-error"
                : isFocused
                ? "text-primary-600"
                : "text-neutral-400"
            )}
          >
            {icon}
          </div>
        )}

        <input
          {...props}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          placeholder={placeholder || (variant === "floating" ? " " : undefined)}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? hintOrErrorId : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(baseInputStyles, className)}
        />

        {variant === "floating" && label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute transition-all duration-200 ease-out pointer-events-none select-none",
              isFloatingActive
                ? cn(
                    sizeClasses.labelFloating,
                    "bg-white px-1.5 font-medium rounded-sm z-[2] leading-none",
                    disabled
                      ? "bg-neutral-50 text-neutral-400"
                      : error
                      ? "text-semantic-error"
                      : isFocused
                      ? "text-primary-600 font-semibold"
                      : "text-neutral-600"
                  )
                : cn(
                    icon
                      ? sizeClasses.labelRestingWithIcon
                      : sizeClasses.labelRestingNoIcon,
                    "text-neutral-500 font-normal",
                    disabled && "text-neutral-400"
                  ),
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:font-semibold peer-focus:text-primary-600 peer-focus:z-[2] peer-focus:leading-none",
              "peer-autofill:top-0 peer-autofill:-translate-y-1/2 peer-autofill:left-2.5 peer-autofill:text-xs peer-autofill:bg-white peer-autofill:px-1.5 peer-autofill:z-[2] peer-autofill:leading-none",
              error && "peer-focus:text-semantic-error"
            )}
          >
            {label}
            {required && (
              <span
                className={cn(
                  "ml-0.5",
                  error
                    ? "text-semantic-error"
                    : isFocused
                    ? "text-primary-600"
                    : "text-semantic-error"
                )}
              >
                *
              </span>
            )}
          </label>
        )}

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[1]">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={hintOrErrorId}
          className="mt-1.5 text-xs text-semantic-error font-medium m-0 flex items-center gap-1"
        >
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={hintOrErrorId} className="mt-1.5 text-xs text-neutral-500 m-0">
          {hint}
        </p>
      )}
    </div>
  );
}
