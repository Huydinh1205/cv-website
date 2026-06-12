type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  initials?: string;
};

const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "size-6 text-[10px]",
  md: "size-7 text-[11px]",
  lg: "size-9 text-[13px]",
};

export function LogoMark({
  className = "",
  size = "md",
  initials = "QH",
}: LogoProps) {
  return (
    <span
      role="img"
      aria-label={`${initials} logo`}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-md bg-accent font-bold tracking-tight text-accent-foreground shadow-sm ${sizeClasses[size]} ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-transparent"
      />
      <span className="relative">{initials}</span>
    </span>
  );
}
