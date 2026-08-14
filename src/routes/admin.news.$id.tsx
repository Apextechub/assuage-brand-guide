import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminContainer,
  AdminHeading,
  AdminLoading,
  Notice,
  StatusPill,
} from "@/components/admin/AdminChrome";
import { NewsPreview } from "@/components/admin/ArticlePreview";
import { ActionButton } from "@/components/admin/FileOutput";
import { Field, SelectInput, TextArea, TextInput } from "@/components/site/Field";
import { newsLabels } from "@/data/news.types";
import { actions, emptyNews, useAdminState } from "@/lib/admin/store";
import type { NewsDraft } from "@/lib/admin/types";
import { useUnsavedGuard } from "@/lib/admin/useUnsavedGuard";
import { slugify, validateNews } from "@/lib/admin/validate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/news/$id")({
  component: NewsEditor,
});

function NewsEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state } = useAdminState();

  const [draft, setDraft] = useState<NewsDraft | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Reload whenever the route points at a different announcement, not just on
  // first mount. Editing works on a local copy until Save.
  useEffect(() => {
    if (!state || loadedId === id) return;
    setDraft(id === "new" ? emptyNews() : (state.news.find((item) => item.id === id) ?? null));
    setLoadedId(id);
    setDirty(false);
    setSubmitted(false);
    setSavedAt(null);
  }, [state, id, loadedId]);

  useUnsavedGuard(dirty);

  const siblings = useMemo(() => state?.news ?? [], [state]);
  const validation = useMemo(
    () => (draft ? validateNews(draft, siblings) : null),
    [draft, siblings],
  );

  if (!state) return <AdminLoading />;

  if (!draft) {
    return (
      <AdminContainer className="py-16">
        <Notice tone="warning" title="That announcement is not here">
          It may have been deleted, or written in a different browser.{" "}
          <Link to="/admin" className="text-gold-deep underline underline-offset-4">
            Back to content
          </Link>
        </Notice>
      </AdminContainer>
    );
  }

  const errors = submitted ? (validation?.errors ?? {}) : {};
  const set = <K extends keyof NewsDraft>(key: K, value: NewsDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setSavedAt(null);
    setDirty(true);
  };

  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const save = (thenClose: boolean) => {
    setSubmitted(true);
    if (!validation?.ok) return;
    // Save means "ready to go live". A new announcement starts as a draft, so
    // without this it would save quietly and then be left out of the export,
    // and Publish would report nothing to do.
    const ready = { ...draft, status: "published" as const };
    actions.saveNews(ready);
    setDraft(ready);
    setSavedAt(now());
    setDirty(false);
    // The guard reads `dirty` from this render, so leave on the next one.
    if (thenClose) window.setTimeout(() => void navigate({ to: "/admin" }), 0);
  };

  const saveAsDraft = () => {
    actions.saveNews({ ...draft, status: "draft" });
    setDraft((current) => (current ? { ...current, status: "draft" } : current));
    setSavedAt(now());
    setDirty(false);
  };

  return (
    <AdminContainer className="py-12 md:py-16">
      <Link
        to="/admin"
        className="micro-label inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All content
      </Link>

      <div className="mt-6">
        <AdminHeading
          label={id === "new" ? "New announcement" : "Edit announcement"}
          title={draft.title || "Untitled announcement"}
          intro="Firm news is a single paragraph on one page — appointments, briefings, publications and events. Keep it factual: no rankings, awards or league table claims."
          actions={
            <>
              {dirty && <StatusPill tone="edited">Unsaved changes</StatusPill>}
              <ActionButton
                onClick={() => setShowPreview((current) => !current)}
                icon={<Eye className="size-3.5" aria-hidden="true" />}
              >
                {showPreview ? "Hide preview" : "Preview"}
              </ActionButton>
              <ActionButton onClick={saveAsDraft}>Save as draft</ActionButton>
              <ActionButton onClick={() => save(false)} tone="primary">
                Save
              </ActionButton>
              <ActionButton onClick={() => save(true)} tone="primary">
                Save and close
              </ActionButton>
            </>
          }
        />
      </div>

      {savedAt && (
        <div className="mt-6">
          <Notice title={`Saved at ${savedAt} — not live yet`}>
            Saved in this browser. To put it on the website, go to{" "}
            <Link to="/admin/export" className="text-gold-deep underline underline-offset-4">
              Publish
            </Link>{" "}
            and press <strong className="text-ink">Publish to the live site</strong>.
          </Notice>
        </div>
      )}

      {submitted && validation && !validation.ok && (
        <div className="mt-6">
          <Notice tone="warning" title="This announcement cannot be published yet">
            <ul className="mt-1 list-disc pl-5">
              {Object.values(validation.errors).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}

      {validation && validation.warnings.length > 0 && (
        <div className="mt-6">
          <Notice title="Worth a look">
            <ul className="mt-1 list-disc pl-5">
              {validation.warnings.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}

      <div className={cn("mt-10 grid gap-12", showPreview && "lg:grid-cols-2")}>
        <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
          <Field label="Headline" htmlFor="title" error={errors.title} required>
            <TextInput
              id="title"
              value={draft.title}
              placeholder="Firm hosts roundtable on arbitration reform"
              onChange={(event) => {
                const title = event.target.value;
                setDraft((current) => {
                  if (!current) return current;
                  const followSlug = current.origin === "local" && current.status === "draft";
                  return { ...current, title, slug: followSlug ? slugify(title) : current.slug };
                });
                setSavedAt(null);

                setDirty(true);
              }}
              aria-invalid={errors.title ? true : undefined}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Label" htmlFor="label" error={errors.label} required>
              <SelectInput
                id="label"
                value={
                  newsLabels.includes(draft.label as (typeof newsLabels)[number]) ? draft.label : ""
                }
                onChange={(event) => set("label", event.target.value)}
              >
                {!newsLabels.includes(draft.label as (typeof newsLabels)[number]) && (
                  <option value="">{draft.label || "Choose a label…"}</option>
                )}
                {newsLabels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field label="Date" htmlFor="date" error={errors.date} required>
              <TextInput
                id="date"
                type="date"
                value={draft.date}
                onChange={(event) => set("date", event.target.value)}
                aria-invalid={errors.date ? true : undefined}
              />
            </Field>
          </div>

          <Field label="Reference" htmlFor="slug" error={errors.slug} required>
            <TextInput
              id="slug"
              value={draft.slug}
              onChange={(event) => set("slug", event.target.value)}
              aria-invalid={errors.slug ? true : undefined}
            />
            <p className="mt-2 text-xs text-ink-soft">
              An internal identifier. It is not a page address — all news sits on one page — but it
              must be unique.
            </p>
          </Field>

          <Field label="Announcement" htmlFor="body" error={errors.body} required>
            <TextArea
              id="body"
              rows={7}
              value={draft.body}
              placeholder="One paragraph, written in the third person."
              onChange={(event) => set("body", event.target.value)}
              aria-invalid={errors.body ? true : undefined}
            />
            <p className="mt-2 text-xs text-ink-soft">
              {draft.body.trim().split(/\s+/).filter(Boolean).length} words. The existing items run
              to roughly 35–45.
            </p>
          </Field>
        </form>

        {showPreview && (
          <div className="lg:sticky lg:top-8">
            <p className="micro-label mb-4 text-ink-soft">Preview — as it appears on /news</p>
            <div className="border border-rule p-6 md:p-8">
              <NewsPreview draft={draft} />
            </div>
          </div>
        )}
      </div>
    </AdminContainer>
  );
}
