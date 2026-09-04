import { cn } from "@/utils/cs";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "static" | "standard" | "outlined";
  label?: string;
};

export default function InputField({
  className,
  variant = "outlined",
  label,
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  const baseStyles =
    "w-full px-3 py-2.5 text-sm font-normal outline outline-0 transition-all";

  const variantStyles = {
    outlined:
      "border border-blue-gray-200 bg-white text-blue-gray-900 placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-blue-500 focus:outline-0",
    standard:
      "border-b-2 border-blue-gray-200 bg-transparent text-blue-gray-900 placeholder-shown:border-blue-gray-200 focus:border-b-2 focus:border-blue-500 focus:outline-0",
    static: "bg-transparent text-blue-gray-900 focus:outline-0",
  };

  const labelStyles = label
    ? "block text-sm font-medium text-blue-gray-700 mb-2"
    : "";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={cn(baseStyles, variantStyles[variant])}
      />
    </div>
  );
}
