// Registry of the insight images bundled under src/assets/insights.
//
// Bundled images are imported by Vite, so at runtime `insights[].image` is a
// hashed URL, not the original path. To round-trip an article back into
// TypeScript source the admin needs to recover the import identifier from that
// URL — hence this table. Add a line here whenever a new image is committed to
// src/assets/insights.

import arbitration from "@/assets/insights/arbitration.jpg";
import corporateCama from "@/assets/insights/corporate-cama.jpg";
import dataProtection from "@/assets/insights/data-protection.jpg";
import electricity from "@/assets/insights/electricity.jpg";
import financeCapital from "@/assets/insights/finance-capital.jpg";
import forex from "@/assets/insights/forex.jpg";

export interface InsightAsset {
  /** The import identifier emitted into the generated data file. */
  ident: string;
  /** File name under src/assets/insights. */
  file: string;
  /** Resolved URL at runtime. */
  url: string;
  /** Human label for the picker. */
  label: string;
}

export const insightAssets: InsightAsset[] = [
  {
    ident: "arbitration",
    file: "arbitration.jpg",
    url: arbitration,
    label: "Arbitration hearing room",
  },
  {
    ident: "corporateCama",
    file: "corporate-cama.jpg",
    url: corporateCama,
    label: "Lagos office towers",
  },
  {
    ident: "dataProtection",
    file: "data-protection.jpg",
    url: dataProtection,
    label: "Glass facade panels",
  },
  { ident: "electricity", file: "electricity.jpg", url: electricity, label: "Transmission lines" },
  {
    ident: "financeCapital",
    file: "finance-capital.jpg",
    url: financeCapital,
    label: "Documents on a desk",
  },
  { ident: "forex", file: "forex.jpg", url: forex, label: "Lagos marina cranes" },
];

const byIdent = new Map(insightAssets.map((asset) => [asset.ident, asset]));
const byUrl = new Map(insightAssets.map((asset) => [asset.url, asset]));

export function getAssetByIdent(ident: string): InsightAsset | undefined {
  return byIdent.get(ident);
}

export function getAssetByUrl(url: string): InsightAsset | undefined {
  return byUrl.get(url);
}

/** Where uploaded images must be saved, relative to the repo root. */
export const UPLOAD_DIR = "public/insights";

/** Public URL prefix that uploaded images resolve to once saved. */
export const UPLOAD_URL_PREFIX = "/insights";

/**
 * Uploads are base64-inlined into localStorage, which caps out around 5 MB for
 * the whole store. Keep individual images well under that.
 */
export const MAX_UPLOAD_BYTES = 1_500_000;

/** Normalise a chosen file name into something safe for a URL path. */
export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "jpg";
  const cleanStem =
    stem
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  const cleanExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
  return `${cleanStem}.${cleanExt}`;
}
