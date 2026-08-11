#!/usr/bin/env node
// Generates the ADMIN_PASSWORD_HASH value for the content admin.
//
//   node scripts/hash-password.mjs
//
// Prompts for a password without echoing it, prints the hash, and never writes
// it anywhere. Set the result on the deployed site with:
//
//   npx wrangler secret put ADMIN_PASSWORD_HASH
//
// The algorithm here must stay in step with src/lib/server/password.server.ts.

import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 100_000; // Cloudflare Workers rejects anything above this
const SALT_BYTES = 16;
const KEY_BITS = 256;

/** Ask for input with the typed characters suppressed. */
function askHidden(question) {
  return new Promise((resolve) => {
    let muted = false;
    const output = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) process.stdout.write(chunk, encoding);
        callback();
      },
    });
    const rl = createInterface({ input: process.stdin, output, terminal: true });
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}

async function hash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    KEY_BITS,
  );
  const b64 = (bytes) => Buffer.from(bytes).toString("base64");
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

const password = await askHidden("Password for the content admin: ");
if (password.length < 12) {
  console.error("Use at least 12 characters — this one password protects the whole site.");
  process.exit(1);
}
const again = await askHidden("Type it again: ");
if (password !== again) {
  console.error("Those did not match.");
  process.exit(1);
}

console.log(`\nADMIN_PASSWORD_HASH=${await hash(password)}\n`);
console.log("Set it on the deployed site with:");
console.log("  npx wrangler secret put ADMIN_PASSWORD_HASH");
console.log("then paste the value after the = sign when prompted.\n");
