import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const verification = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    { method: "POST" }
  );
  const data = await verification.json();
  if (data.success && data.score >= 0.5) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: data["error-codes"] }, { status: 400 });
}
