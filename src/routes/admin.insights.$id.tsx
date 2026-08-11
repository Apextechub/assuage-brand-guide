import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminContainer,
  AdminHeading,
  AdminLoading,
  Notice,
  StatusPill,
} from "@/components/admin/AdminChrome";
import { InsightPreview } from "@/components/admin/ArticlePreview";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ActionButton } from "@/components/admin/FileOutput";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { Field, SelectInput, TextArea, TextInput } from "@/components/site/Field";
import { insightCategories } from "@/data/insights.types";
import { team } from "@/data/team";
import { actions, emptyInsight, useAdminState } from "@/lib/admin/store";
import type { InsightDraft } from "@/lib/admin/types";
import { useUnsavedGuard } from "@/lib/admin/useUnsavedGuard";
import { estimateReadTime, slugify, validateInsight } from "@/lib/admin/validate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/insights/$id")({
  component: InsightEditor,
});

function InsightEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state } = useAdminState();

  const [draft, setDraft] = useState<InsightDraft | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Load once the browser store is ready, and reload whenever the route points
  // at a different article. Editing works on a local copy so an unfinished edit
  // is never written into the store mid-keystroke.
  useEffect(() => {
    if (!state || loadedId === id) return;
    if (id === "new") {
      setDraft(emptyInsight());
    } else {
      const found = state.insights.find((item) => item.id === id);
      setDraft(found ? { ...found, content: found.content.map((block) => ({ ...block })) } : null);
    }
    setLoadedId(id);
    setDirty(false);
    setSubmitted(false);
    setSavedAt(null);
  }, [state, id, loadedId]);

  useUnsavedGuard(dirty);

  const siblings = useMemo(() => state?.insights ?? [], [state]);
  const validation = useMemo(
    () => (draft ? validateInsight(draft, siblings) : null),
    [draft, siblings],
  );

  if (!state) return <AdminLoading />;

  if (!draft) {
    return (
      <AdminContainer className="py-16">
        <Notice tone="warning" title="That article is not here">
          It may have been deleted, or written in a different browser.{" "}
          <Link to="/admin" className="text-gold-deep underline underline-offset-4">
            Back to content
          </Link>
        </Notice>
      </AdminContainer>
    );
  }

  const errors = submitted ? (validation?.errors ?? {}) : {};
  const set = <K extends keyof InsightDraft>(key: K, value: InsightDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setSavedAt(null);
    setDirty(true);
  };

  const bodyText = draft.content.map((block) => block.text).join(" ");
  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const save = (thenClose: boolean) => {
    setSubmitted(true);
    if (!validation?.ok) return;
    actions.saveInsight(draft);
    setSavedAt(now());
    setDirty(false);
    // The guard reads `dirty` from this render, so leave on the next one.
    if (thenClose) window.setTimeout(() => void navigate({ to: "/admin" }), 0);
  };

  const saveAsDraft = () => {
    actions.saveInsight({ ...draft, status: "draft" });
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
          label={id === "new" ? "New article" : "Edit article"}
          title={draft.title || "Untitled article"}
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
          <Notice title={`Saved in this browser at ${savedAt}`}>
            To put it on the live site, open{" "}
            <Link to="/admin/export" className="text-gold-deep underline underline-offset-4">
              Publish
            </Link>{" "}
            and send the generated file to whoever deploys the site.
          </Notice>
        </div>
      )}

      {submitted && validation && !validation.ok && (
        <div className="mt-6">
          <Notice tone="warning" title="This article cannot be published yet">
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
              placeholder="The Nigeria Data Protection Act: compliance priorities"
              onChange={(event) => {
                const title = event.target.value;
                setDraft((current) => {
                  if (!current) return current;
                  // Keep the address in step with the headline until it is
                  // published — after that, changing it would break links.
                  const followSlug = current.origin === "local" && current.status === "draft";
                  return { ...current, title, slug: followSlug ? slugify(title) : current.slug };
                });
                setSavedAt(null);

                setDirty(true);
              }}
              aria-invalid={errors.title ? true : undefined}
            />
          </Field>

          <Field label="Web address" htmlFor="slug" error={errors.slug} required>
            <div className="flex items-stretch">
              <span className="flex items-center border border-r-0 border-rule bg-mist px-3 text-sm text-ink-soft">
                /insights/
              </span>
              <TextInput
                id="slug"
                value={draft.slug}
                onChange={(event) => set("slug", event.target.value)}
                aria-invalid={errors.slug ? true : undefined}
              />
            </div>
            {draft.origin === "source" && (
              <p className="mt-2 text-xs text-ink-soft">
                This article is already on the live site. Changing the address breaks any existing
                link to it.
              </p>
            )}
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Category" htmlFor="category" error={errors.category} required>
              <SelectInput
                id="category"
                value={draft.category}
                onChange={(event) => set("category", event.target.value)}
              >
                {insightCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field label="Author" htmlFor="author" error={errors.author} required>
              <SelectInput
                id="author"
                value={draft.author}
                onChange={(event) => set("author", event.target.value)}
              >
                <option value="">Choose an author…</option>
                {team.map((member) => (
                  <option key={member.slug} value={member.slug}>
                    {member.name} — {member.role}
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

            <Field label="Reading time" htmlFor="readTime" error={errors.readTime} required>
              <div className="flex items-stretch gap-2">
                <TextInput
                  id="readTime"
                  value={draft.readTime}
                  placeholder="6 min read"
                  onChange={(event) => set("readTime", event.target.value)}
                  aria-invalid={errors.readTime ? true : undefined}
                />
                <button
                  type="button"
                  onClick={() => set("readTime", estimateReadTime(bodyText))}
                  title="Estimate from the article body"
                  className="micro-label inline-flex shrink-0 cursor-pointer items-center gap-2 border border-rule px-3 text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  <Wand2 className="size-3.5" aria-hidden="true" />
                  Estimate
                </button>
              </div>
            </Field>
          </div>

          <Field label="Summary" htmlFor="excerpt" error={errors.excerpt} required>
            <TextArea
              id="excerpt"
              rows={3}
              value={draft.excerpt}
              placeholder="Two sentences describing what the reader will take away."
              onChange={(event) => set("excerpt", event.target.value)}
              aria-invalid={errors.excerpt ? true : undefined}
            />
            <p className="mt-2 text-xs text-ink-soft">
              Shown on the insights index and in search results. {draft.excerpt.length} characters.
            </p>
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Featured image
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            </p>
            <ImagePicker
              value={draft.image}
              onChange={(image) => set("image", image)}
              alt={draft.imageAlt}
              onAltChange={(value) => set("imageAlt", value)}
              altError={errors.imageAlt}
              imageError={errors.image}
            />
          </div>

          <BlockEditor
            blocks={draft.content}
            onChange={(content) => set("content", content)}
            error={errors.content}
          />
        </form>

        {showPreview && (
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto">
            <p className="micro-label mb-4 text-ink-soft">Preview</p>
            <div className="border border-rule p-6 md:p-8">
              <InsightPreview draft={draft} />
            </div>
          </div>
        )}
      </div>
    </AdminContainer>
  );
}
