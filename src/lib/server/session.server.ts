// Admin login sessions.
//
// Uses TanStack Start's sealed sessions: the cookie holds an AES-encrypted,
// SHA-256-signed payload keyed on ADMIN_SESSION_SECRET, so it cannot be read or
// forged by the browser. Rotating that secret invalidates every session.

import {
  clearSession,
  getRequestProtocol,
  getSession,
  updateSession,
} from "@tanstack/react-start/server";
import type { SessionConfig } from "@tanstack/start-server-core";

export interface AdminSessionData {
  /** Set once the password has been checked. */
  loggedInAt: number;
  [key: string]: unknown;
}

const NAME = "assuage_admin";
/** A working day; editors re-enter the password the next morning. */
const MAX_AGE_SECONDS = 60 * 60 * 8;

function config(sessionSecret: string): SessionConfig {
  return {
    password: sessionSecret,
    name: NAME,
    maxAge: MAX_AGE_SECONDS,
    cookie: {
      httpOnly: true,
      // Local development runs over http, where a secure cookie is dropped.
      secure: getRequestProtocol() === "https",
      sameSite: "lax",
      path: "/",
    },
  };
}

export async function startSession(sessionSecret: string): Promise<void> {
  await updateSession<AdminSessionData>(config(sessionSecret), { loggedInAt: Date.now() });
}

export async function endSession(sessionSecret: string): Promise<void> {
  await clearSession(config(sessionSecret));
}

export async function isLoggedIn(sessionSecret: string): Promise<boolean> {
  try {
    const session = await getSession<AdminSessionData>(config(sessionSecret));
    return typeof session.data.loggedInAt === "number";
  } catch {
    // A cookie sealed with a previous secret fails to open — treat as logged out.
    return false;
  }
}

/** Thrown when a server function is called without a valid session. */
export class NotAuthenticatedError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "NotAuthenticatedError";
  }
}

export async function requireLogin(sessionSecret: string): Promise<void> {
  if (!(await isLoggedIn(sessionSecret))) throw new NotAuthenticatedError();
}
