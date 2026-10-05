import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Media upload URL API endpoint" });
}
