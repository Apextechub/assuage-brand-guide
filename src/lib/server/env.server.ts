// Server configuration for the admin.
//
// On Cloudflare, environment variables only exist during a request, never in
// module scope — so everything here reads process.env when called, not on
// import. Set these with `wrangler secret put <NAME>` in production and in
// .dev.vars locally (see docs/content-admin.md).

export interface AdminConfig {
  /** Encrypts and signs the session cookie. At least 32 characters. */
  sessionSecret: string;
  /** pbkdf2$... hash produced by scripts/hash-password.mjs. */
  passwordHash: string;
  /** GitHub token with contents:write on the repository below. */
  githubToken: string;
  owner: string;
  repo: string;
  branch: string;
  /** Name recorded as the commit author. */
  authorName: string;
  authorEmail: string;
}

export class ConfigError extends Error {
  readonly missing: string[];
  constructor(missing: string[]) {
    super(
      `The publishing setup is incomplete. Missing or invalid: ${missing.join(", ")}. ` +
        `See docs/content-admin.md for how to set these.`,
    );
    this.name = "ConfigError";
    this.missing = missing;
  }
}

function read(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** Defaults matching this repository, overridable by env. */
const DEFAULT_REPO = "Apextechub/assuage-brand-guide";
const DEFAULT_BRANCH = "main";

/**
 * Read and validate everything the admin needs. Throws ConfigError listing
 * exactly what is missing, so the admin can show an actionable message instead
 * of a generic 500.
 */
export function readAdminConfig(): AdminConfig {
  const missing: string[] = [];

  const sessionSecret = read("ADMIN_SESSION_SECRET");
  // Sealed sessions require at least 32 characters of key material.
  if (sessionSecret.length < 32) missing.push("ADMIN_SESSION_SECRET (needs 32+ characters)");

  const passwordHash = read("ADMIN_PASSWORD_HASH");
  if (!passwordHash.startsWith("pbkdf2$")) {
    missing.push("ADMIN_PASSWORD_HASH (run: node scripts/hash-password.mjs)");
  }

  const githubToken = read("GITHUB_TOKEN");
  if (!githubToken) missing.push("GITHUB_TOKEN");

  const repoSlug = read("PUBLISH_REPO") || DEFAULT_REPO;
  const [owner, repo] = repoSlug.split("/");
  if (!owner || !repo) missing.push('PUBLISH_REPO (expected "owner/name")');

  if (missing.length > 0) throw new ConfigError(missing);

  return {
    sessionSecret,
    passwordHash,
    githubToken,
    owner: owner as string,
    repo: repo as string,
    branch: read("PUBLISH_BRANCH") || DEFAULT_BRANCH,
    authorName: read("PUBLISH_AUTHOR_NAME") || "Assuage content admin",
    authorEmail: read("PUBLISH_AUTHOR_EMAIL") || "noreply@users.noreply.github.com",
  };
}

/**
 * Whether publishing is configured, without throwing. Used to tell the editor
 * up front that the Publish button will not work, rather than failing on click.
 */
export function publishingStatus(): { ready: true } | { ready: false; missing: string[] } {
  try {
    readAdminConfig();
    return { ready: true };
  } catch (error) {
    if (error instanceof ConfigError) return { ready: false, missing: error.missing };
    throw error;
  }
}
