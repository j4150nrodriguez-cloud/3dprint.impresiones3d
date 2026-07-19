import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("X-Wompi-Webhook-Token");
  if (signature !== process.env.WOMPI_EVENTS_KEY) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const payload = await req.json();
  // TODO: process payload (e.g., update order status, send email, etc.)
  console.log("Wompi webhook received", payload);
  return NextResponse.json({ received: true });
}
