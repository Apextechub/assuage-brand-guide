import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { ContentBlock } from "@/data/insights.types";
import { blockTypeLabels } from "@/data/insights.types";
import { cn } from "@/lib/utils";

const BLOCK_TYPES = Object.keys(blockTypeLabels) as ContentBlock["type"][];

const HELP: Record<ContentBlock["type"], string> = {
  p: "Body text. One idea per paragraph.",
  h2: "Section heading. Keep it short — it also helps readers skim.",
  quote: "A single sentence, pulled out and set large beside a gold rule.",
};

function blockClasses(type: ContentBlock["type"]): string {
  if (type === "h2") return "font-display text-xl text-ink";
  if (type === "quote") return "font-display text-lg italic text-navy";
  return "text-[0.95rem] text-ink";
}

export function BlockEditor({
  blocks,
  onChange,
  error,
}: {
  blocks: ContentBlock[];
  onChange: (next: ContentBlock[]) => void;
  error?: string | undefined;
}) {
  const groupId = useId();

  const update = (index: number, patch: Partial<ContentBlock>) => {
    onChange(
      blocks.map((block, i) => (i === index ? ({ ...block, ...patch } as ContentBlock) : block)),
    );
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const moved = blocks[index];
    if (!moved) return;
    const next = [...blocks];
    next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  const insertAfter = (index: number, type: ContentBlock["type"]) => {
    const next = [...blocks];
    next.splice(index + 1, 0, { type, text: "" } as ContentBlock);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">
          Article body
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        </span>
        <span className="micro-label text-ink-soft">
          {blocks.length} block{blocks.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="border border-rule">
        {blocks.map((block, index) => {
          const fieldId = `${groupId}-block-${index}`;
          return (
            <div key={index} className="border-b border-rule last:border-b-0">
              <div className="flex flex-wrap items-center gap-2 bg-mist px-3 py-2">
                <label htmlFor={`${fieldId}-type`} className="sr-only">
                  Block {index + 1} type
                </label>
                <select
                  id={`${fieldId}-type`}
                  value={block.type}
                  onChange={(event) =>
                    update(index, { type: event.target.value as ContentBlock["type"] })
                  }
                  className="micro-label cursor-pointer border border-rule bg-paper px-2 py-1.5 text-ink"
                >
                  {BLOCK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {blockTypeLabels[type]}
                    </option>
                  ))}
                </select>
                <span className="hidden text-xs text-ink-soft sm:inline">{HELP[block.type]}</span>

                <div className="ml-auto flex items-center gap-1">
                  <IconButton
                    label={`Move block ${index + 1} up`}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={`Move block ${index + 1} down`}
                    onClick={() => move(index, 1)}
                    disabled={index === blocks.length - 1}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={`Delete block ${index + 1}`}
                    onClick={() => remove(index)}
                    disabled={blocks.length === 1}
                    tone="destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </div>

              <label htmlFor={fieldId} className="sr-only">
                {blockTypeLabels[block.type]} text
              </label>
              <textarea
                id={fieldId}
                value={block.text}
                onChange={(event) => update(index, { text: event.target.value })}
                rows={block.type === "p" ? 5 : 2}
                placeholder={
                  block.type === "h2"
                    ? "Section heading"
                    : block.type === "quote"
                      ? "A sentence worth pulling out"
                      : "Write here…"
                }
                className={cn(
                  "w-full resize-y bg-paper px-4 py-3 leading-relaxed transition-colors placeholder:text-ink-soft/40 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-navy",
                  blockClasses(block.type),
                )}
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-rule px-3 py-2">
                <span className="micro-label text-ink-soft">Insert below</span>
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => insertAfter(index, type)}
                    className="micro-label inline-flex cursor-pointer items-center gap-1 border border-rule px-2 py-1 text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    <Plus className="size-3" aria-hidden="true" />
                    {blockTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean | undefined;
  tone?: "default" | "destructive";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "cursor-pointer border border-transparent p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        tone === "destructive"
          ? "text-ink-soft hover:border-destructive/40 hover:text-destructive"
          : "text-ink-soft hover:border-rule hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
