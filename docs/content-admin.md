# Content admin

A browser-based editor for the site's **Insights** (articles) and **Firm news**
(announcements), at `/admin`. A writer signs in with a password, writes, and
presses **Publish to the live site**. No developer is involved.

```
Writer clicks Publish
  → server function (holds the GitHub token, never the browser)
  → one commit to main: insights.data.ts, news.data.ts, any new images
  → GitHub Actions builds and deploys to Cloudflare Workers
  → live in about 90 seconds
```

Nothing is stored on a server between sessions. Unpublished drafts live in the
writer's own browser; publishing is what moves them into the repository, and the
repository is the site's source of truth. Every published change is therefore an
ordinary commit — reviewable, revertable, and attributable.

---

## One-time setup

Four steps. You need admin access to the GitHub repository and to the Cloudflare
account that hosts the Worker (`assuage-attorneys`).

### 1. Choose the admin password

```sh
node scripts/hash-password.mjs
```

It asks for a password twice and prints `ADMIN_PASSWORD_HASH=pbkdf2$...`. The
password itself is never stored anywhere — only this hash, which cannot be
reversed. Keep the password somewhere the firm can find it, such as a password
manager.

### 2. Create a GitHub token for publishing

GitHub → Settings → Developer settings → **Fine-grained personal access tokens**
→ Generate new token.

| Field | Value |
| --- | --- |
| Repository access | Only select repositories → `assuageattorneys/assuage-brand-guide` |
| Permissions → Contents | **Read and write** |
| Expiration | Your choice — publishing stops working the day it expires |

Nothing else needs to be granted. Copy the token; GitHub shows it once.

> Pushes made with a personal access token **do** trigger GitHub Actions, which
> is what lets publishing reach the live site. (Pushes made with the built-in
> Actions token do not — that is what stops a deploy re-triggering itself.)

### 3. Put the secrets on the Worker

The Worker must exist in your Cloudflare account first — `wrangler secret put`
has nothing to attach to otherwise. If it has never been deployed from your
account, do that once:

```sh
npx wrangler login
npm run build
npx wrangler deploy
```

A brand-new Cloudflare account also needs a **workers.dev subdomain** registered
before its first deploy — a one-time choice at
`dash.cloudflare.com/<account-id>/workers/onboarding`. Wrangler tries to pick
one automatically and fails if the name is taken.

`wrangler.json` in the project root pins the Worker name so every wrangler
command resolves it without `--name`. Nitro merges that file into the generated
`.output/server/wrangler.json` at build time; put any future bindings there.

With the Worker in place, these secrets live on it and survive deploys:

```sh
npx wrangler secret put ADMIN_SESSION_SECRET   # any random string, 32+ characters
npx wrangler secret put ADMIN_PASSWORD_HASH    # the pbkdf2$... value from step 1
npx wrangler secret put GITHUB_TOKEN           # the token from step 2
```

A session secret can be generated with:

```sh
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

Optional overrides, only if you move the repository or branch:
`PUBLISH_REPO` (default `assuageattorneys/assuage-brand-guide`), `PUBLISH_BRANCH`
(default `main`), `PUBLISH_AUTHOR_NAME`, `PUBLISH_AUTHOR_EMAIL`.

### 4. Let GitHub Actions deploy

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. Give
it credentials in GitHub → Settings → Secrets and variables → **Actions**:

| Secret | Where to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → Account ID |

Also commit `package-lock.json` if it is not already tracked, so builds are
reproducible. The workflow falls back to `npm install` without it, but pinned
dependencies are worth having.

**Publish from one place.** Once this workflow is live, both it and Lovable's
own deploy button target the same Worker. Deploy through Actions and leave the
Lovable button alone, or the two will overwrite each other. Editing in the
Lovable editor still works — that is only git sync.

### Checking it worked

Visit `/admin`. You should see a password prompt. If you see **"Not set up
yet"**, it lists exactly which variables are missing.

---

## Local development

Copy `.dev.vars.example` to `.dev.vars` and fill it in, keeping every value in
single quotes. `vite dev` does not read the file itself, so source it first:

```sh
set -a && . ./.dev.vars && set +a && npm run dev
```

**Quote the values.** The password hash contains `$`, and an unquoted
`pbkdf2$210000$v229...` is silently mangled by the shell into `pbkdf2` — the
admin then reports `ADMIN_PASSWORD_HASH` as missing even though it is set.
Wrangler strips the quotes, so one quoted file works for both.

Publishing from a local dev server commits to the **real** repository and
deploys the **real** site. Point `PUBLISH_BRANCH` at a scratch branch while
testing.

---

## Day-to-day use

**Writing.** `/admin` lists every article and announcement. Each shows its
status: *Draft* (not published), *Edited here* (changed since it went live),
*Also changed in code*, or *N things to fix*. Editors get a live preview using
the same markup as the real page, so what they see is what ships.

**Publishing.** The Publish screen shows what will go live, blocks on anything
incomplete, then commits everything in one go. It reports back with a link to
the change. If the content already matches the site, it says so and skips the
commit rather than triggering a pointless rebuild.

**Drafts** stay in the browser and are left out of the published files — the way
to park unfinished work.

**Keep a copy.** Unpublished work exists only in that one browser. The Publish
screen can download everything as a single `.json` file, which another browser
can open to pick up exactly where it left off.

---

## How the code is organised

Each content type is split three ways so regenerating content never overwrites
hand-written code:

| File | Written by | Notes |
| --- | --- | --- |
| `src/data/insights.types.ts` | by hand | Types and the fixed category list |
| `src/data/insights.data.ts` | **publishing** | The articles. Never edit by hand |
| `src/data/insights.ts` | by hand | Helpers, and what the rest of the app imports |

News follows the same pattern. Pages keep importing `@/data/insights` and
`@/data/news`, so nothing else needs to know about the split.

The generated files are excluded from Prettier and ESLint. Publishing writes
them byte for byte, so reformatting would make every publish a large,
meaningless diff. Publishing unchanged content produces an identical file and
therefore no commit at all — a useful sanity check.

### Server code

| File | Responsibility |
| --- | --- |
| `src/lib/admin/api.ts` | The server functions: `login`, `logout`, `getAdminSession`, `publish` |
| `src/lib/server/password.server.ts` | PBKDF2-SHA256 hashing and constant-time verification |
| `src/lib/server/session.server.ts` | Sealed (encrypted + signed) session cookie |
| `src/lib/server/github.server.ts` | Git Data API: many files, one atomic commit |
| `src/lib/server/env.server.ts` | Reads and validates the secrets, per request |

Cloudflare only exposes environment variables during a request, so nothing here
reads `process.env` at module scope.

### Security properties

- The GitHub token exists only on the server. The build is checked to confirm no
  server module reaches the client bundle.
- The session cookie is AES-encrypted and signed with `ADMIN_SESSION_SECRET`,
  `httpOnly`, `sameSite=lax`, and `secure` over HTTPS. A hand-made or tampered
  cookie is rejected. Rotating the secret signs everyone out.
- The browser never sends file contents — only structured drafts. The server
  re-validates with the same rules the editor uses and re-serialises before
  committing, so a malformed payload cannot write arbitrary content.
- Uploaded image names are restricted by pattern, which rules out path traversal.
- Server functions are CSRF-protected by TanStack Start, which requires a
  matching `Origin`.
- PBKDF2 runs at 100,000 iterations, which makes verification deliberately slow
  and so rate-limits guessing. That is the **maximum Cloudflare Workers allows**
  — its WebCrypto rejects anything higher outright — and is below OWASP's
  recommended 210,000. Choose a long, random password: with a shared secret and
  no lockout, password entropy is what actually carries this. If the firm needs
  per-person accounts or an audit trail, that means a real user store.

---

## When something goes wrong

| Symptom | Cause and fix |
| --- | --- |
| "Not set up yet" | A secret is missing. The screen names it. Set it with `wrangler secret put`. |
| "That password is not right" | Wrong password, or `ADMIN_PASSWORD_HASH` was regenerated. |
| "GitHub rejected the access token" | The token expired or was revoked. Issue a new one and set `GITHUB_TOKEN` again. |
| "the token is probably missing Contents write permission" | The fine-grained token lacks Contents: Read and write on this repository. |
| "GitHub could not find the repository or branch" | `PUBLISH_REPO` / `PUBLISH_BRANCH` are wrong, or the token cannot see the repository. |
| "The branch moved while publishing" | Someone pushed at the same time. Press Publish again. |
| Published, but the site does not change | The commit landed but the deploy did not. Check the Actions tab for a failed run. |
| Signed out unexpectedly | Sessions last 8 hours; rotating `ADMIN_SESSION_SECRET` also ends them. |

A failed publish changes nothing: the branch only moves after every file has
been uploaded successfully, and the work stays in the browser either way.

---

## Changing the serializer

`src/lib/admin/serialize.ts` must reproduce the committed data files exactly. If
you change it, confirm the round-trip still holds: serializing `seededState()`
from `src/lib/admin/store.ts` must equal the contents of
`src/data/insights.data.ts` and `src/data/news.data.ts` on disk. Loading those
modules through Vite (`createServer` + `ssrLoadModule`) is the easiest way to
check, since it resolves the `@/` alias and image imports exactly as the browser
does.

## Adding a bundled image

Images committed to `src/assets/insights/` are optimised by Vite. After adding a
file there, add a line to `insightAssets` in `src/lib/admin/assets.ts` so the
admin can offer it in the picker and turn it back into an `import` when
publishing. Images uploaded through the admin instead go to `public/insights/`
and are referenced by path — simpler, but not optimised at build time.
