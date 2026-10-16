import { NextResponse } from "next/server";

/** Thrown by the auth guards so routes can answer 401/403 instead of 500. */
export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Call first inside a route's catch block:
 *   const denied = authErrorResponse(error); if (denied) return denied;
 * Also recognises the legacy plain "Unauthorized" / "Forbidden" errors.
 */
export function authErrorResponse(error: unknown): NextResponse | null {
  let status: number | null = null;
  let message = "";

  if (error instanceof AuthError) {
    status = error.status;
    message = error.message;
  } else if (error instanceof Error && error.message === "Unauthorized") {
    status = 401;
    message = "You are not signed in";
  } else if (error instanceof Error && error.message === "Forbidden") {
    status = 403;
    message = "You do not have permission to do this";
  }

  return status ? NextResponse.json({ success: false, error: message }, { status }) : null;
}
