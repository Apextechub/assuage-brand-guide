import { Link, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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

function SignOutButton() {
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
      className="micro-label cursor-pointer text-paper/60 transition-colors hover:text-paper disabled:opacity-40"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

export function AdminBar({ pending }: { pending: number }) {
  const linkClass = "micro-label px-1 py-2 text-paper/60 transition-colors hover:text-paper";
  const activeProps = { className: cn(linkClass, "text-paper border-b border-gold") };

  return (
    <header className="border-b border-paper/15 bg-navy">
      <AdminContainer className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <Link to="/" className="shrink-0">
          <Logo tone="white" className="h-7" />
        </Link>
        <span className="micro-label text-gold">Content admin</span>
        <nav className="flex items-center gap-6" aria-label="Admin">
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
        <div className="ml-auto flex items-center gap-6">
          <Link
            to="/insights"
            className="micro-label text-paper/60 transition-colors hover:text-paper"
          >
            View live site
          </Link>
          <SignOutButton />
        </div>
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
