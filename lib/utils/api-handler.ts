import { NextResponse } from "next/server";

export function handleApiError(error: unknown, context: string) {
  console.error(`${context} error:`, error);

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("Unauthorized") || error.message.includes("auth")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    if (error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes("duplicate") || error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    // Validation errors
    if (error.message.includes("required") || error.message.includes("invalid")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: false, error: `Failed to ${context}` },
    { status: 500 }
  );
}

export function handleApiSuccess(data: any, message?: string, status: number = 200) {
  return NextResponse.json(
    { success: true, data, ...(message && { message }) },
    { status }
  );
}
