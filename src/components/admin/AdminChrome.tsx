import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { logout } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

/** Admin pages use their own container: wider than the site's, same margins. */
export function AdminContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[84rem] px-5 md:px-10", className)}>{children}</div>
  );
}

function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void logout()
          .then(() => router.invalidate())
          .finally(() => setBusy(false));
      }}
      className={cn(
        "micro-label cursor-pointer text-paper/60 transition-colors hover:text-paper disabled:opacity-40",
        className,
      )}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

/**
 * The two utility actions. Shown inline from `md` up, and inside the menu
 * below that, where the bar has no room for them beside the navigation.
 */
function UtilityMenu() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Navigating away should not leave the menu hanging open behind the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <div className="ml-auto hidden items-center gap-6 md:flex">
        <Link
          to="/insights"
          className="micro-label text-paper/60 transition-colors hover:text-paper"
        >
          View live site
        </Link>
        <SignOutButton />
      </div>

      <div className="relative ml-auto md:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-11 cursor-pointer items-center justify-center text-paper/70 transition-colors hover:text-paper"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>

        {open && (
          <div
            ref={panelRef}
            id="admin-menu"
            className="absolute right-0 top-full z-50 mt-3 min-w-44 border border-paper/15 bg-navy py-1 shadow-lg"
          >
            <Link
              to="/insights"
              className="micro-label block px-4 py-3 text-paper/70 transition-colors hover:bg-navy-deep hover:text-paper"
            >
              View live site
            </Link>
            <SignOutButton className="block w-full px-4 py-3 text-left hover:bg-navy-deep" />
          </div>
        )}
      </div>
    </>
  );
}

export function AdminBar({ pending }: { pending: number }) {
  const linkClass = "micro-label px-1 py-2 text-paper/60 transition-colors hover:text-paper";
  const activeProps = { className: cn(linkClass, "text-paper border-b border-gold") };

  return (
    <header className="border-b border-paper/15 bg-navy">
      <AdminContainer className="flex items-center gap-x-6 py-4 md:gap-x-8">
        <Link to="/" className="shrink-0">
          <Logo tone="white" className="h-7" />
        </Link>
        {/* Decorative on a narrow screen, where the space is worth more. */}
        <span className="micro-label hidden text-gold sm:inline">Content admin</span>
        <nav className="flex items-center gap-5 md:gap-6" aria-label="Admin">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            className={linkClass}
            activeProps={activeProps}
          >
            Content
          </Link>
          <Link to="/admin/export" className={linkClass} activeProps={activeProps}>
            Publish
            {pending > 0 && (
              <span className="ml-2 bg-gold px-1.5 py-0.5 text-[10px] font-medium text-navy-deep">
                {pending}
              </span>
            )}
          </Link>
        </nav>
        <UtilityMenu />
      </AdminContainer>
    </header>
  );
}

/** Page title block for admin screens. */
export function AdminHeading({
  label,
  title,
  intro,
  actions,
}: {
  label: string;
  title: string;
  intro?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
      <div>
        <p className="micro-label text-gold-deep">{label}</p>
        <h1 className="display-2 mt-3 text-ink">{title}</h1>
        {intro && <p className="measure mt-4 text-ink-soft">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "published" | "draft" | "edited" | "conflict";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "micro-label inline-flex items-center border px-2 py-1",
        tone === "published" && "border-rule text-ink-soft",
        tone === "draft" && "border-ink/25 bg-mist text-ink",
        tone === "edited" && "border-gold-deep/40 bg-gold/10 text-gold-deep",
        tone === "conflict" && "border-destructive/40 bg-destructive/5 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning";
  title?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-l-2 py-4 pl-5 pr-4 text-sm leading-relaxed",
        tone === "info" && "border-navy bg-mist text-ink-soft",
        tone === "warning" && "border-destructive bg-destructive/5 text-ink",
      )}
    >
      {title && <p className="font-medium text-ink">{title}</p>}
      <div className={cn(title && "mt-1")}>{children}</div>
    </div>
  );
}

/** Shown while the browser store is still loading (and during SSR). */
export function AdminLoading() {
  return (
    <AdminContainer className="py-24">
      <p className="micro-label text-ink-soft">Loading your content…</p>
    </AdminContainer>
  );
}
