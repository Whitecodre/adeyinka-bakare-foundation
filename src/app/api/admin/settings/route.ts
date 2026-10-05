import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Settings API endpoint" });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ message: "Settings API endpoint" });
}
