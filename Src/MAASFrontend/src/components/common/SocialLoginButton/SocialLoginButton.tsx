import { cn } from "@/utils/cs";

type SocialProvider = "google" | "github" | "microsoft";

type SocialLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: SocialProvider;
  isLoading?: boolean;
};

const providerIcons: Record<SocialProvider, string> = {
  google: "🔍",
  github: "🐙",
  microsoft: "◼️",
};

const providerLabels: Record<SocialProvider, string> = {
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
};

export default function SocialLoginButton({
  provider,
  isLoading,
  disabled,
  children,
  className,
  ...props
}: SocialLoginButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "w-full",
        "flex items-center justify-center gap-2.5",
        "px-4 py-2.5",
        "border-2 border-neutral-300",
        "rounded-lg",
        "bg-white",
        "text-neutral-700 font-medium text-base",
        "transition-all duration-200",
        "hover:border-neutral-400 hover:bg-neutral-50",
        "active:bg-neutral-100",
        "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-lg">{providerIcons[provider]}</span>
      )}
      {children || providerLabels[provider]}
    </button>
  );
}
