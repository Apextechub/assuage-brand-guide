import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Fixed site header. Transparent over the home hero, solid --ink after
 * scroll (and always solid on interior pages). Mobile: full-screen overlay.
 */
export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll, move focus to the toggle, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    toggleRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = !isHome || scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          "on-dark fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out",
          solid ? "border-b border-paper/10 bg-ink" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-[76rem] items-center justify-between px-5 md:h-24 md:px-10">
          <Link to="/" aria-label="Assuage Attorneys — home" className="shrink-0">
            <Logo tone="white" className="h-10 md:h-12" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b-2 border-transparent pb-1 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-paper/65 transition-colors duration-200 hover:text-paper"
                activeProps={{ className: "border-gold text-paper hover:text-paper" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="pb-1 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-gold underline decoration-gold/40 underline-offset-8 transition-colors duration-200 hover:text-paper hover:decoration-paper"
            >
              Request a consultation
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center text-paper transition-colors hover:text-gold lg:hidden"
          >
            {menuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="on-dark fixed inset-0 z-40 overflow-y-auto bg-ink lg:hidden"
        >
          <div className="flex min-h-full flex-col px-5 pb-10 pt-28">
            <nav aria-label="Mobile">
              <ul>
                {site.nav.map((item) => (
                  <li key={item.to} className="border-b border-paper/10">
                    <Link
                      to={item.to}
                      className="block py-4 font-display text-3xl text-paper transition-colors duration-200 hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="border-b border-paper/10">
                  <Link
                    to="/contact"
                    className="block py-4 font-display text-3xl text-gold transition-colors duration-200 hover:text-paper"
                  >
                    Request a consultation
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mt-auto pt-10 text-sm leading-relaxed text-paper/55">
              <p>{site.email}</p>
              <p className="mt-1">{site.phone}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
