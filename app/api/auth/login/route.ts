import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function ownerToken(): string {
  return createHash("sha256")
    .update(`${process.env.OWNER_PIN ?? ""}:seo-tools-owner-v1`)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  if (!process.env.OWNER_PIN || pin !== process.env.OWNER_PIN) {
    return NextResponse.json({ ok: false, error: "PIN incorrect" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("owner_token", ownerToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
