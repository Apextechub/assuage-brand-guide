import { Check, Copy, Download } from "lucide-react";
import { useState, type ReactNode } from "react";
import { downloadText } from "@/lib/admin/download";
import { cn } from "@/lib/utils";

export function ActionButton({
  onClick,
  children,
  icon,
  tone = "default",
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "primary" | "destructive";
  disabled?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "micro-label inline-flex cursor-pointer items-center gap-2 border px-4 py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        tone === "primary" && "border-navy bg-navy text-paper hover:bg-navy-deep",
        tone === "default" && "border-rule text-ink hover:border-ink hover:bg-mist",
        tone === "destructive" &&
          "border-destructive/40 text-destructive hover:border-destructive hover:bg-destructive/5",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * A generated file: the path it belongs at, the contents, and the two ways to
 * get it out of the browser.
 */
export function FileOutput({
  path,
  contents,
  mime = "text/plain",
  note,
}: {
  path: string;
  contents: string;
  mime?: string;
  note?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const fileName = path.split("/").pop() ?? "file.txt";
  const lines = contents.split("\n").length;

  const copy = () => {
    void navigator.clipboard.writeText(contents).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false),
    );
  };

  return (
    <div className="border border-rule">
      <div className="flex flex-wrap items-center gap-3 border-b border-rule bg-mist px-4 py-3">
        <code className="text-sm text-ink">{path}</code>
        <span className="micro-label text-ink-soft">{lines} lines</span>
        <div className="ml-auto flex items-center gap-2">
          <ActionButton
            onClick={copy}
            icon={
              copied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )
            }
          >
            {copied ? "Copied" : "Copy"}
          </ActionButton>
          <ActionButton
            onClick={() => downloadText(fileName, contents, mime)}
            icon={<Download className="size-3.5" aria-hidden="true" />}
          >
            Download
          </ActionButton>
        </div>
      </div>
      {note && <div className="border-b border-rule px-4 py-3 text-sm text-ink-soft">{note}</div>}
      <pre className="max-h-96 overflow-auto bg-paper p-4 text-xs leading-relaxed text-ink">
        <code>{contents}</code>
      </pre>
    </div>
  );
}
