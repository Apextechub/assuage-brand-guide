import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminContainer,
  AdminHeading,
  AdminLoading,
  Notice,
  StatusPill,
} from "@/components/admin/AdminChrome";
import { ActionButton } from "@/components/admin/FileOutput";
import { formatInsightDate } from "@/data/insights";
import { getTeamMember } from "@/data/team";
import { actions, isModified, useAdminState } from "@/lib/admin/store";
import type { AnyDraft, InsightDraft, NewsDraft } from "@/lib/admin/types";
import { validateDraft } from "@/lib/admin/validate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Tab = "insights" | "news";

function AdminDashboard() {
  const { state } = useAdminState();
  const [tab, setTab] = useState<Tab>("insights");

  if (!state) return <AdminLoading />;

  const items: AnyDraft[] = tab === "insights" ? state.insights : state.news;
  const siblings = items;
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const changed = [...state.insights, ...state.news].filter(isModified).length;

  return (
    <AdminContainer className="py-12 md:py-16">
      <AdminHeading
        label="Content"
        title="News and insights"
        intro="Write and edit here. Nothing on this screen is live until you publish it."
        actions={
          <Link
            to={tab === "insights" ? "/admin/insights/$id" : "/admin/news/$id"}
            params={{ id: "new" }}
            className="micro-label inline-flex cursor-pointer items-center gap-2 border border-navy bg-navy px-4 py-2.5 text-paper transition-colors hover:bg-navy-deep"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {tab === "insights" ? "New article" : "New announcement"}
          </Link>
        }
      />

      {changed > 0 && (
        <div className="mt-8">
          <Notice title={`${changed} item${changed === 1 ? "" : "s"} not yet on the live site`}>
            Go to{" "}
            <Link to="/admin/export" className="text-gold-deep underline underline-offset-4">
              Publish
            </Link>{" "}
            to put them on the website.
          </Notice>
        </div>
      )}

      <div className="mt-10 flex gap-2" role="tablist" aria-label="Content type">
        {(["insights", "news"] as Tab[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={tab === option}
            onClick={() => setTab(option)}
            className={cn(
              "micro-label cursor-pointer border px-5 py-2.5 transition-colors",
              tab === option
                ? "border-navy bg-navy text-paper"
                : "border-rule text-ink-soft hover:border-ink hover:text-ink",
            )}
          >
            {option === "insights" ? "Insights" : "Firm news"}
            <span className="ml-2 opacity-60">
              {option === "insights" ? state.insights.length : state.news.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-rule">
        {sorted.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">Nothing here yet.</p>
        ) : (
          sorted.map((item) => <Row key={item.id} draft={item} siblings={siblings} />)
        )}
      </div>
    </AdminContainer>
  );
}

function Row({ draft, siblings }: { draft: AnyDraft; siblings: AnyDraft[] }) {
  const modified = isModified(draft);
  const { ok, errors } = validateDraft(draft, siblings);
  const errorCount = Object.keys(errors).length;
  const isInsight = draft.kind === "insight";
  const author = isInsight ? getTeamMember((draft as InsightDraft).author) : undefined;

  const remove = () => {
    const label = isInsight ? "article" : "announcement";
    if (
      !window.confirm(
        `Delete the ${label} “${draft.title || "Untitled"}”?\n\nThis only removes it from this browser. It stays on the live site until the change is published and deployed.`,
      )
    ) {
      return;
    }
    if (isInsight) actions.removeInsight(draft.id);
    else actions.removeNews(draft.id);
  };

  const toggleStatus = () => {
    const next = draft.status === "published" ? "draft" : "published";
    if (isInsight) actions.setInsightStatus(draft.id, next);
    else actions.setNewsStatus(draft.id, next);
  };

  return (
    <article className="grid gap-4 border-b border-rule py-6 md:grid-cols-12 md:items-start md:gap-6">
      <div className="md:col-span-3">
        <p className="micro-label text-ink-soft">
          <time dateTime={draft.date}>{formatInsightDate(draft.date)}</time>
          <span className="mx-2 text-rule" aria-hidden="true">
            ·
          </span>
          <span className="text-gold-deep">
            {isInsight ? (draft as InsightDraft).category : (draft as NewsDraft).label}
          </span>
        </p>
        {author && <p className="mt-1 text-xs text-ink-soft">{author.name}</p>}
      </div>

      <div className="md:col-span-5">
        <h2 className="font-display text-xl leading-snug text-ink">
          {draft.title || <span className="text-ink-soft">Untitled</span>}
        </h2>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          /{isInsight ? "insights/" : "news#"}
          {draft.slug || "…"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {draft.status === "draft" && (
            <StatusPill tone="draft">Draft — not on the site</StatusPill>
          )}
          {modified && draft.status === "published" && (
            <StatusPill tone="edited">Edited here</StatusPill>
          )}
          {draft.conflictWithSource && (
            <StatusPill tone="conflict">Also changed in code</StatusPill>
          )}
          {!ok && (
            <StatusPill tone="conflict">
              {errorCount} thing{errorCount === 1 ? "" : "s"} to fix
            </StatusPill>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
        <Link
          to={isInsight ? "/admin/insights/$id" : "/admin/news/$id"}
          params={{ id: draft.id }}
          className="micro-label inline-flex cursor-pointer items-center gap-2 border border-rule px-4 py-2.5 text-ink transition-colors hover:border-ink hover:bg-mist"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit
        </Link>
        <ActionButton
          onClick={toggleStatus}
          icon={
            draft.status === "published" ? (
              <EyeOff className="size-3.5" aria-hidden="true" />
            ) : (
              <Eye className="size-3.5" aria-hidden="true" />
            )
          }
        >
          {draft.status === "published" ? "Unpublish" : "Publish"}
        </ActionButton>
        {draft.origin === "source" && modified && (
          <ActionButton
            onClick={() => {
              if (
                window.confirm(
                  "Discard your changes to this item and go back to the version on the live site?",
                )
              ) {
                actions.revertToSource(draft.id);
              }
            }}
            icon={<RotateCcw className="size-3.5" aria-hidden="true" />}
          >
            Revert
          </ActionButton>
        )}
        <ActionButton
          onClick={remove}
          tone="destructive"
          icon={<Trash2 className="size-3.5" aria-hidden="true" />}
        >
          Delete
        </ActionButton>
      </div>
    </article>
  );
}
