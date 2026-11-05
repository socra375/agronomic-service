import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "forest" | "outline" | "outline-light" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold tracking-[0.06em] transition-all duration-300 ease-(--ease-suave) disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Texto noche sobre dorado: contraste 5.6:1
  gold: "bg-dorado text-noche hover:bg-dorado-claro shadow-[0_10px_30px_-12px_rgb(184_147_90_/_0.7)]",
  forest: "bg-bosque text-marfil hover:bg-bosque-medio",
  outline: "border border-bosque/30 text-bosque hover:border-bosque hover:bg-bosque hover:text-marfil",
  "outline-light": "border border-marfil/50 text-marfil hover:bg-marfil hover:text-bosque",
  ghost: "text-bosque hover:bg-arena",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-13 px-8 text-[0.9375rem]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = "gold", size = "md", className = "" }: Omit<Common, "children">) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function ButtonLink({ variant, size, className, children, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}

export function Button({ variant, size, className, children, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
