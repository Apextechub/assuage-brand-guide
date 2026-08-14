import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Navy carries structure: the default primary button. */
        primary: "bg-navy text-paper hover:bg-navy-deep active:bg-navy-deep",
        /** For dark bands where navy would disappear. */
        inverse: "bg-paper text-ink hover:bg-mist active:bg-mist",
        /** Gold outline — dark surfaces only. */
        outlineGold:
          "border border-gold text-gold hover:bg-gold hover:text-navy-deep active:bg-gold",
        /** Secondary action on light surfaces. */
        outline: "border border-ink/30 text-ink hover:border-ink hover:bg-mist",
      },
      size: {
        default: "px-7 py-3.5",
        sm: "px-5 py-2.5 text-[0.75rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type LinkProps = Omit<ComponentProps<typeof Link>, "children" | "params"> & {
  children: ReactNode;
  params?: Record<string, string>;
};

export function ButtonLink({
  variant,
  size,
  className,
  params,
  ...props
}: LinkProps & VariantProps<typeof buttonVariants>) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      params={params as never}
      {...props}
    />
  );
}

/** Editorial text link with arrow. `tone="dark"` is for navy/ink surfaces. */
export function ArrowLink({
  tone = "light",
  className,
  children,
  params,
  ...props
}: LinkProps & { tone?: "light" | "dark" }) {
  return (
    <Link
      params={params as never}
      className={cn(
        "group inline-flex items-center gap-2.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-200 ease-out",
        tone === "light" ? "text-gold-deep hover:text-ink" : "text-gold hover:text-paper",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "underline underline-offset-8 transition-colors duration-200",
          tone === "light"
            ? "decoration-gold-deep/30 group-hover:decoration-ink"
            : "decoration-gold/40 group-hover:decoration-paper",
        )}
      >
        {children}
      </span>
      <ArrowRight
        className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
