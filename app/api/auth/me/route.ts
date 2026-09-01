import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function ownerToken(): string {
  return createHash("sha256")
    .update(`${process.env.OWNER_PIN ?? ""}:seo-tools-owner-v1`)
    .digest("hex");
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("owner_token")?.value;
  const isOwner = !!process.env.OWNER_PIN && token === ownerToken();
  return NextResponse.json({ isOwner });
}
