import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { CloudUpload, Download, ExternalLink, Image as ImageIcon, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  AdminContainer,
  AdminHeading,
  AdminLoading,
  Notice,
  StatusPill,
} from "@/components/admin/AdminChrome";
import { ActionButton, FileOutput } from "@/components/admin/FileOutput";
import { publish, type PublishResult } from "@/lib/admin/api";
import { UPLOAD_DIR } from "@/lib/admin/assets";
import { downloadDataUrl, downloadText } from "@/lib/admin/download";
import {
  exportBundle,
  INSIGHTS_DATA_PATH,
  NEWS_DATA_PATH,
  parseBundle,
  publishable,
  serializeInsightsFile,
  serializeNewsFile,
} from "@/lib/admin/serialize";
import { actions, seededState, useAdminState } from "@/lib/admin/store";
import type { AnyDraft } from "@/lib/admin/types";
import { validateDraft } from "@/lib/admin/validate";

export const Route = createFileRoute("/admin/export")({
  component: PublishScreen,
});

type Phase =
  | { state: "idle" }
  | { state: "working" }
  | { state: "done"; result: PublishResult }
  | { state: "failed"; message: string };

function PublishScreen() {
  const router = useRouter();
  const { state } = useAdminState();
  const fileInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ state: "idle" });
  const [showFiles, setShowFiles] = useState(false);

  const committed = useMemo(() => {
    const seed = seededState();
    return {
      insights: serializeInsightsFile(seed.insights),
      news: serializeNewsFile(seed.news),
    };
  }, []);

  const generated = useMemo(() => {
    if (!state) return null;
    return {
      insights: serializeInsightsFile(state.insights),
      news: serializeNewsFile(state.news),
    };
  }, [state]);

  if (!state || !generated) return <AdminLoading />;

  const everything: AnyDraft[] = [...state.insights, ...state.news];
  const blocked = publishable(everything).filter((draft) => {
    const siblings = draft.kind === "insight" ? state.insights : state.news;
    return !validateDraft(draft, siblings).ok;
  });
  const heldBack = everything.filter((draft) => draft.status === "draft");
  const uploads = publishable(state.insights).flatMap((draft) =>
    draft.image.kind === "upload" ? [draft.image] : [],
  );

  const insightsChanged = generated.insights !== committed.insights;
  const newsChanged = generated.news !== committed.news;
  const nothingToDo = !insightsChanged && !newsChanged && uploads.length === 0;
  const canPublish = !nothingToDo && blocked.length === 0 && phase.state !== "working";

  const runPublish = async () => {
    setPhase({ state: "working" });
    try {
      const result = await publish({ data: { insights: state.insights, news: state.news } });
      setPhase({ state: "done", result });
      // Re-check the session: an expired login surfaces as the sign-in screen
      // rather than a silent failure next time.
      await router.invalidate();
    } catch (error) {
      setPhase({
        state: "failed",
        message:
          error instanceof Error
            ? error.message
            : "Publishing failed for an unknown reason. Please try again.",
      });
    }
  };

  const handleImport = (file: File | undefined) => {
    if (!file) return;
    setImportError(null);
    void file.text().then(
      (text) => {
        try {
          actions.replaceAll(parseBundle(text));
        } catch (error) {
          setImportError(error instanceof Error ? error.message : "That file could not be read.");
        }
      },
      () => setImportError("That file could not be read."),
    );
  };

  return (
    <AdminContainer className="py-12 md:py-16">
      <AdminHeading
        label="Publish"
        title="Put your changes on the live site"
        intro="Publishing saves your work and rebuilds the website. Your changes usually appear online within a couple of minutes."
        actions={
          <ActionButton
            tone="primary"
            disabled={!canPublish}
            onClick={() => void runPublish()}
            icon={<CloudUpload className="size-3.5" aria-hidden="true" />}
          >
            {phase.state === "working" ? "Publishing…" : "Publish to the live site"}
          </ActionButton>
        }
      />

      {blocked.length > 0 && (
        <div className="mt-8">
          <Notice
            tone="warning"
            title={`${blocked.length} item${blocked.length === 1 ? " is" : "s are"} incomplete`}
          >
            <p>
              These are set to publish but are missing something. Fix them, or set them back to
              draft, before publishing.
            </p>
            <ul className="mt-2 list-disc pl-5">
              {blocked.map((draft) => (
                <li key={draft.id}>
                  <Link
                    to={draft.kind === "insight" ? "/admin/insights/$id" : "/admin/news/$id"}
                    params={{ id: draft.id }}
                    className="text-gold-deep underline underline-offset-4"
                  >
                    {draft.title || "Untitled"}
                  </Link>
                </li>
              ))}
            </ul>
          </Notice>
        </div>
      )}

      {nothingToDo && blocked.length === 0 && phase.state === "idle" && (
        <div className="mt-8">
          <Notice title="Nothing to publish">
            What you have here already matches the live site.
          </Notice>
        </div>
      )}

      <PublishOutcome phase={phase} />

      <section className="mt-12" aria-labelledby="summary-heading">
        <div className="flex flex-wrap items-baseline gap-4">
          <h2 id="summary-heading" className="display-3 text-ink">
            What will go live
          </h2>
          {heldBack.length > 0 && (
            <StatusPill tone="draft">
              {heldBack.length} draft{heldBack.length === 1 ? "" : "s"} left out
            </StatusPill>
          )}
        </div>
        <dl className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-3">
          <Stat label="Articles" value={publishable(state.insights).length} />
          <Stat label="Announcements" value={publishable(state.news).length} />
          <Stat label="New images" value={uploads.length} />
        </dl>
      </section>

      {uploads.length > 0 && (
        <section className="mt-12" aria-labelledby="images-heading">
          <h2 id="images-heading" className="display-3 text-ink">
            New images
          </h2>
          <p className="measure mt-3 text-ink-soft">
            These are uploaded together with your changes when you publish. Nothing further to do.
          </p>
          <ul className="mt-6 border-t border-rule">
            {uploads.map((image) => (
              <li
                key={image.fileName}
                className="flex flex-wrap items-center gap-4 border-b border-rule py-4"
              >
                <img
                  src={image.dataUrl}
                  alt=""
                  className="h-14 w-20 shrink-0 border border-rule object-cover"
                />
                <code className="text-sm text-ink">{image.fileName}</code>
                <div className="ml-auto">
                  <ActionButton
                    onClick={() => downloadDataUrl(image.fileName, image.dataUrl)}
                    icon={<ImageIcon className="size-3.5" aria-hidden="true" />}
                  >
                    Download
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 border-t border-rule pt-10" aria-labelledby="handoff-heading">
        <h2 id="handoff-heading" className="display-3 text-ink">
          Keep a copy
        </h2>
        <p className="measure mt-3 text-ink-soft">
          Unpublished work is stored in this browser alone — not on a server, and not on your other
          devices. Download a copy as a backup, or to carry on writing on another computer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton
            icon={<Download className="size-3.5" aria-hidden="true" />}
            onClick={() =>
              downloadText("assuage-content.json", exportBundle(state), "application/json")
            }
          >
            Download a copy of everything
          </ActionButton>
          <ActionButton
            icon={<Upload className="size-3.5" aria-hidden="true" />}
            onClick={() => fileInput.current?.click()}
          >
            Open a copy from a file
          </ActionButton>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => handleImport(event.target.files?.[0])}
          />
        </div>
        {importError && (
          <div className="mt-4">
            <Notice tone="warning">{importError}</Notice>
          </div>
        )}
        <p className="mt-4 text-sm text-ink-soft">
          Opening a file replaces everything currently in this browser.
        </p>
      </section>

      <section className="mt-16 border-t border-rule pt-10" aria-labelledby="advanced-heading">
        <h2 id="advanced-heading" className="display-3 text-ink">
          For developers
        </h2>
        <p className="measure mt-3 text-ink-soft">
          The exact files publishing writes to the repository. You do not need these unless you are
          committing by hand.
        </p>
        <div className="mt-6">
          <ActionButton onClick={() => setShowFiles((current) => !current)}>
            {showFiles ? "Hide the generated files" : "Show the generated files"}
          </ActionButton>
        </div>
        {showFiles && (
          <div className="mt-6 space-y-8">
            <FileOutput
              path={INSIGHTS_DATA_PATH}
              contents={generated.insights}
              mime="text/typescript"
              note={insightsChanged ? "Changed" : "Unchanged"}
            />
            <FileOutput
              path={NEWS_DATA_PATH}
              contents={generated.news}
              mime="text/typescript"
              note={newsChanged ? "Changed" : "Unchanged"}
            />
            {uploads.length > 0 && (
              <p className="text-sm text-ink-soft">
                Images are written to <code className="text-ink">{UPLOAD_DIR}/</code> in the same
                commit.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="mt-16 border-t border-rule pt-10" aria-labelledby="reset-heading">
        <h2 id="reset-heading" className="display-3 text-ink">
          Start again
        </h2>
        <p className="measure mt-3 text-ink-soft">
          Throw away every unpublished change in this browser and go back to exactly what is on the
          live site. This cannot be undone — download a copy first if you might want it.
        </p>
        <div className="mt-6">
          <ActionButton
            tone="destructive"
            onClick={() => {
              if (
                window.confirm(
                  "Discard every change in this browser and go back to what is on the live site?",
                )
              ) {
                actions.resetAll();
                setPhase({ state: "idle" });
              }
            }}
          >
            Discard all changes
          </ActionButton>
        </div>
      </section>
    </AdminContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper px-5 py-6">
      <dt className="micro-label text-ink-soft">{label}</dt>
      <dd className="mt-2 font-display text-3xl tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function PublishOutcome({ phase }: { phase: Phase }) {
  if (phase.state === "idle") return null;

  if (phase.state === "working") {
    return (
      <div className="mt-8">
        <Notice title="Publishing…">
          Saving your changes and starting the rebuild. This takes a few seconds.
        </Notice>
      </div>
    );
  }

  if (phase.state === "failed") {
    return (
      <div className="mt-8">
        <Notice tone="warning" title="Publishing did not work">
          <p>{phase.message}</p>
          <p className="mt-2">
            Nothing on the live site was changed, and your work is still saved in this browser.
          </p>
        </Notice>
      </div>
    );
  }

  const { result } = phase;

  if (result.status === "invalid") {
    return (
      <div className="mt-8">
        <Notice tone="warning" title="Some items could not be published">
          <ul className="mt-1 list-disc pl-5">
            {result.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </Notice>
      </div>
    );
  }

  if (result.status === "unchanged") {
    return (
      <div className="mt-8">
        <Notice title="Already up to date">
          The live site already matches what you have here, so nothing needed publishing.
        </Notice>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Notice title="Published">
        <p>
          Your changes are saved and the site is rebuilding now. Give it a minute or two, then
          refresh the live page to see them.
        </p>
        <p className="mt-2">
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-gold-deep underline underline-offset-4"
          >
            View the record of this change
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      </Notice>
    </div>
  );
}
