import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AdminBar, AdminContainer, Notice } from "@/components/admin/AdminChrome";
import { Button } from "@/components/site/Button";
import { Field, TextInput } from "@/components/site/Field";
import { Logo } from "@/components/site/Logo";
import { getAdminSession, login } from "@/lib/admin/api";
import { isModified, useAdminState } from "@/lib/admin/store";

export const Route = createFileRoute("/admin")({
  // The session is checked on the server on every entry to /admin, so the
  // login state cannot be faked from the browser.
  loader: () => getAdminSession(),
  head: () => ({
    meta: [
      { title: "Content admin — Assuage Attorneys" },
      // Keep the admin out of search results. public/robots.txt disallows it too.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const session = Route.useLoaderData();
  const { state, error } = useAdminState();

  if (!session.publishing.ready) return <SetupNeeded missing={session.publishing.missing} />;
  if (!session.authenticated) return <SignIn />;

  const pending = state ? [...state.insights, ...state.news].filter(isModified).length : 0;

  return (
    <div className="min-h-screen bg-paper">
      <AdminBar pending={pending} />
      {error && (
        <AdminContainer className="pt-6">
          <Notice tone="warning" title="Your work is not being saved">
            {error}
          </Notice>
        </AdminContainer>
      )}
      <Outlet />
    </div>
  );
}

/** Shown when the server is missing the secrets publishing depends on. */
function SetupNeeded({ missing }: { missing: string[] }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5 py-24">
      <div className="w-full max-w-xl border border-rule bg-paper p-8">
        <Logo tone="navy" className="h-10" />
        <p className="micro-label mt-8 text-gold-deep">Content admin</p>
        <h1 className="display-3 mt-3 text-ink">Not set up yet</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          The admin cannot sign anyone in until these are configured on the server:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink">
          {missing.map((name) => (
            <li key={name}>
              <code>{name}</code>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-rule pt-5 text-sm text-ink-soft">
          Whoever looks after the site can set these — the steps are in{" "}
          <code className="text-ink">docs/content-admin.md</code>.
        </p>
      </div>
    </div>
  );
}

function SignIn() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const result = await login({ data: { password } });
      if (!result.ok) {
        setError(result.error ?? "That password is not right.");
        return;
      }
      setPassword("");
      // Re-runs the loader, which now sees the session cookie.
      await router.invalidate();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5 py-24">
      <div className="w-full max-w-md border border-rule bg-paper p-8">
        <Logo tone="navy" className="h-10" />
        <p className="micro-label mt-8 text-gold-deep">Content admin</p>
        <h1 className="display-3 mt-3 text-ink">Sign in</h1>
        <form onSubmit={(event) => void submit(event)} className="mt-6">
          <Field label="Password" htmlFor="admin-password" error={error} required>
            <TextInput
              id="admin-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(undefined);
              }}
              aria-invalid={error ? true : undefined}
            />
          </Field>
          <Button type="submit" className="mt-6 w-full" disabled={busy || password.length === 0}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 border-t border-rule pt-5 text-xs leading-relaxed text-ink-soft">
          Articles you write are stored in this browser until you publish them. Publishing puts them
          on the live site.
        </p>
      </div>
    </div>
  );
}
