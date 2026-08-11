// Password hashing for the admin login, using Web Crypto so it runs unchanged
// on Cloudflare Workers (no Node crypto, no native dependency).
//
// Format: pbkdf2$<iterations>$<salt base64>$<derived key base64>
// Generate a hash for a new password with:  node scripts/hash-password.mjs

const PREFIX = "pbkdf2";
const HASH = "SHA-256";
const KEY_BITS = 256;
const SALT_BYTES = 16;

/**
 * Cloudflare Workers' WebCrypto refuses PBKDF2 above 100,000 iterations:
 *
 *   Pbkdf2 failed: iteration counts above 100000 are not supported
 *
 * Node has no such cap, so a higher count works locally and fails only once
 * deployed. Keep this at or below the Workers limit.
 */
export const MAX_ITERATIONS = 100_000;

/**
 * The most work the runtime allows. Below OWASP's recommended 210,000, so the
 * strength of the password itself carries more weight here — see the note on
 * choosing one in docs/content-admin.md.
 */
export const DEFAULT_ITERATIONS = MAX_ITERATIONS;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: HASH },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

/**
 * Why a stored hash is unusable, or null if it looks fine. Checked up front so
 * the setup screen can name the problem instead of login failing obscurely.
 */
export function describeHashProblem(stored: string): string | null {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== PREFIX) {
    return "is not in the expected format (run: node scripts/hash-password.mjs)";
  }
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1_000) {
    return "has an implausible iteration count (run: node scripts/hash-password.mjs)";
  }
  if (iterations > MAX_ITERATIONS) {
    return `uses ${iterations.toLocaleString("en-GB")} iterations, but Cloudflare Workers supports at most ${MAX_ITERATIONS.toLocaleString("en-GB")} — regenerate it with: node scripts/hash-password.mjs`;
  }
  return null;
}

export async function hashPassword(
  password: string,
  iterations: number = DEFAULT_ITERATIONS,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await derive(password, salt, iterations);
  return `${PREFIX}$${iterations}$${toBase64(salt)}$${toBase64(derived)}`;
}

/** Length-independent, value-constant-time comparison. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/**
 * Verify a password against a stored hash. Returns false rather than throwing
 * on a malformed hash, so a misconfigured secret cannot let anyone in.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1_000) return false;
  // Above the runtime cap deriveBits throws, which would surface to the editor
  // as an unexplained server error. Fail closed with a clear message instead.
  if (iterations > MAX_ITERATIONS) {
    throw new Error(`The stored password hash ${describeHashProblem(stored) ?? "is unusable"}.`);
  }

  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = fromBase64(parts[2] ?? "");
    expected = fromBase64(parts[3] ?? "");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length === 0) return false;

  const actual = await derive(password, salt, iterations);
  return timingSafeEqual(actual, expected);
}
