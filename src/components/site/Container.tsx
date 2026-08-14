import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Site-wide content container: 12-column grid lives inside this. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[76rem] px-5 md:px-10", className)}>{children}</div>
  );
}
