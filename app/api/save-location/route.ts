import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("User location received:", data);

  // TODO: Save location to database or pass to AI agent
  return NextResponse.json({ status: "ok" });
}