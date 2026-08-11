// Commits files to GitHub using the Git Data API.
//
// The Contents API can only write one file per call, which would land an
// article and its image as two separate commits — and leave the repository
// briefly broken if the second one failed. This builds a tree instead, so every
// change in a publish arrives as one atomic commit.

const API = "https://api.github.com";

export interface FileChange {
  /** Repository-relative path, e.g. src/data/insights.data.ts */
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
}

export interface CommitRequest {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: FileChange[];
  authorName: string;
  authorEmail: string;
}

export type CommitResult =
  { status: "committed"; sha: string; url: string } | { status: "unchanged" };

export class GitHubError extends Error {
  readonly httpStatus: number;
  constructor(message: string, httpStatus: number) {
    super(message);
    this.name = "GitHubError";
    this.httpStatus = httpStatus;
  }
}

/** Turn GitHub's failure modes into something an editor can act on. */
function describeFailure(status: number, body: string, context: string): GitHubError {
  if (status === 401) {
    return new GitHubError(
      "GitHub rejected the access token. It may have expired or been revoked — a new one needs to be set with `wrangler secret put GITHUB_TOKEN`.",
      status,
    );
  }
  if (status === 403) {
    return new GitHubError(
      "GitHub refused the request. The token is probably missing Contents write permission on this repository, or a rate limit has been hit.",
      status,
    );
  }
  if (status === 404) {
    return new GitHubError(
      "GitHub could not find the repository or branch. Check PUBLISH_REPO and PUBLISH_BRANCH, and that the token can see this repository.",
      status,
    );
  }
  if (status === 409 || status === 422) {
    return new GitHubError(
      "The branch moved while publishing — someone else pushed at the same time. Try publishing again.",
      status,
    );
  }
  return new GitHubError(`GitHub request failed (${context}, HTTP ${status}): ${body}`, status);
}

async function call<T>(
  request: Pick<CommitRequest, "token">,
  path: string,
  init: RequestInit,
  context: string,
): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${request.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      // GitHub rejects API requests without one.
      "User-Agent": "assuage-content-admin",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  if (!response.ok) {
    throw describeFailure(response.status, (await response.text()).slice(0, 300), context);
  }
  return (await response.json()) as T;
}

export async function commitFiles(request: CommitRequest): Promise<CommitResult> {
  const { owner, repo, branch, files } = request;
  const base = `/repos/${owner}/${repo}`;

  if (files.length === 0) return { status: "unchanged" };

  // 1. Where the branch currently points.
  const ref = await call<{ object: { sha: string } }>(
    request,
    `${base}/git/ref/heads/${encodeURIComponent(branch)}`,
    { method: "GET" },
    "reading branch",
  );
  const parentSha = ref.object.sha;

  const parent = await call<{ tree: { sha: string } }>(
    request,
    `${base}/git/commits/${parentSha}`,
    { method: "GET" },
    "reading parent commit",
  );

  // 2. Upload each file as a blob.
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await call<{ sha: string }>(
        request,
        `${base}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({ content: file.content, encoding: file.encoding }),
        },
        `uploading ${file.path}`,
      );
      return { path: file.path, sha: blob.sha };
    }),
  );

  // 3. Build a tree on top of the parent.
  const tree = await call<{ sha: string }>(
    request,
    `${base}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: parent.tree.sha,
        tree: blobs.map((blob) => ({
          path: blob.path,
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        })),
      }),
    },
    "building tree",
  );

  // An identical tree means the content already matches the branch. Committing
  // would create an empty commit and trigger a pointless rebuild.
  if (tree.sha === parent.tree.sha) return { status: "unchanged" };

  // 4. Commit, then move the branch.
  const commit = await call<{ sha: string; html_url: string }>(
    request,
    `${base}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: request.message,
        tree: tree.sha,
        parents: [parentSha],
        author: {
          name: request.authorName,
          email: request.authorEmail,
          date: new Date().toISOString(),
        },
      }),
    },
    "creating commit",
  );

  await call(
    request,
    `${base}/git/refs/heads/${encodeURIComponent(branch)}`,
    {
      method: "PATCH",
      // Never force: if the branch moved underneath us, fail and let the editor retry.
      body: JSON.stringify({ sha: commit.sha, force: false }),
    },
    "updating branch",
  );

  return { status: "committed", sha: commit.sha, url: commit.html_url };
}
