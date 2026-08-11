import { Upload } from "lucide-react";
import { useId, useState } from "react";
import { Field, TextInput } from "@/components/site/Field";
import {
  insightAssets,
  MAX_UPLOAD_BYTES,
  safeFileName,
  UPLOAD_DIR,
  UPLOAD_URL_PREFIX,
} from "@/lib/admin/assets";
import { imagePreviewUrl } from "@/lib/admin/serialize";
import type { ImageRef } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Mode = ImageRef["kind"];

const MODE_LABELS: Record<Mode, string> = {
  asset: "From the library",
  upload: "Upload a new image",
  path: "Enter a path",
};

export function ImagePicker({
  value,
  onChange,
  alt,
  onAltChange,
  altError,
  imageError,
}: {
  value: ImageRef;
  onChange: (next: ImageRef) => void;
  alt: string;
  onAltChange: (next: string) => void;
  altError?: string | undefined;
  imageError?: string | undefined;
}) {
  const id = useId();
  const [mode, setMode] = useState<Mode>(value.kind);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const preview = imagePreviewUrl(value);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("That file is not an image.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(
        `That image is ${(file.size / 1_000_000).toFixed(1)} MB. Please resize it to under ${(MAX_UPLOAD_BYTES / 1_000_000).toFixed(1)} MB first — large images also slow the site down.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        kind: "upload",
        fileName: safeFileName(file.name),
        dataUrl: String(reader.result),
      });
    };
    reader.onerror = () => setUploadError("That image could not be read.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-rule">
      <div className="flex flex-wrap gap-2 border-b border-rule bg-mist px-3 py-2">
        {(Object.keys(MODE_LABELS) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => setMode(option)}
            className={cn(
              "micro-label cursor-pointer border px-3 py-1.5 transition-colors",
              mode === option
                ? "border-navy bg-navy text-paper"
                : "border-rule text-ink-soft hover:border-ink hover:text-ink",
            )}
          >
            {MODE_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 p-4 md:grid-cols-2">
        <div>
          {mode === "asset" && (
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-ink">
                Images already in the site
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {insightAssets.map((asset) => {
                  const selected = value.kind === "asset" && value.ident === asset.ident;
                  return (
                    <button
                      key={asset.ident}
                      type="button"
                      aria-pressed={selected}
                      title={asset.label}
                      onClick={() => onChange({ kind: "asset", ident: asset.ident })}
                      className={cn(
                        "block cursor-pointer border-2 transition-colors",
                        selected ? "border-navy" : "border-transparent hover:border-rule",
                      )}
                    >
                      <img
                        src={asset.url}
                        alt={asset.label}
                        loading="lazy"
                        className="aspect-[3/2] w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {mode === "upload" && (
            <div>
              <label
                htmlFor={`${id}-file`}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-rule bg-mist px-4 py-8 text-center transition-colors hover:border-ink-soft"
              >
                <Upload className="size-5 text-ink-soft" aria-hidden="true" />
                <span className="text-sm text-ink">Choose an image from this computer</span>
                <span className="text-xs text-ink-soft">
                  Landscape, roughly 1600 × 1067. Under {(MAX_UPLOAD_BYTES / 1_000_000).toFixed(1)}{" "}
                  MB.
                </span>
              </label>
              <input
                id={`${id}-file`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
              {uploadError && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {uploadError}
                </p>
              )}
              {value.kind === "upload" && (
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                  Held in this browser only. When you publish, download{" "}
                  <code className="text-ink">{value.fileName}</code> from the Publish screen and
                  save it into <code className="text-ink">{UPLOAD_DIR}/</code> in the repository.
                  The article will point at{" "}
                  <code className="text-ink">
                    {UPLOAD_URL_PREFIX}/{value.fileName}
                  </code>
                  .
                </p>
              )}
            </div>
          )}

          {mode === "path" && (
            <Field label="Image path or URL" htmlFor={`${id}-path`} error={imageError} required>
              <TextInput
                id={`${id}-path`}
                value={value.kind === "path" ? value.value : ""}
                placeholder="/insights/my-image.jpg"
                onChange={(event) => onChange({ kind: "path", value: event.target.value })}
              />
              <p className="mt-2 text-xs text-ink-soft">
                A file already served from <code>public/</code>, or a full https:// address.
              </p>
            </Field>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink">Preview</p>
          <div className="aspect-[3/2] overflow-hidden border border-rule bg-mist">
            {preview ? (
              <img src={preview} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <span className="micro-label text-ink-soft">No image chosen</span>
              </div>
            )}
          </div>
          <Field
            label="Image description"
            htmlFor={`${id}-alt`}
            error={altError}
            required
            className="mt-4"
          >
            <TextInput
              id={`${id}-alt`}
              value={alt}
              placeholder="High-voltage power lines against a hazy sky"
              onChange={(event) => onAltChange(event.target.value)}
              aria-invalid={altError ? true : undefined}
            />
            <p className="mt-2 text-xs text-ink-soft">
              Describe what is in the picture, for readers using a screen reader. Do not repeat the
              headline.
            </p>
          </Field>
        </div>
      </div>
    </div>
  );
}
