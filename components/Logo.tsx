import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export function LogoMark({ className = "", size = "md" }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Huy logo"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-accent shadow-sm ${sizeClasses[size]} ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-transparent"
      />
      <Image
        src="/mascots/huy-face.png"
        alt=""
        fill
        sizes="48px"
        className="relative object-contain"
      />
    </span>
  );
}
