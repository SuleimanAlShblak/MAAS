import { cn } from "@/utils/cs";

type PaperVariant = "elevated" | "filled" | "outlined";

type PaperProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: PaperVariant;
};

export default function Paper({
  variant = "filled",
  className,
  children,
  ...props
}: PaperProps) {
  const baseStyles = "rounded-lg bg-white transition-shadow duration-200";

  const variantStyles = {
    elevated: "shadow-lg",
    filled: "shadow-sm border border-neutral-200",
    outlined: "border-2 border-neutral-200",
  };

  return (
    <div
      {...props}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </div>
  );
}
