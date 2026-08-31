import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { apps as defaultApps } from "@/data/apps";

const BLOB_KEY = "apps-list.json";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, limit: 1 });

    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // First deployment: seed blob from apps.json
    await put(BLOB_KEY, JSON.stringify(defaultApps), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json(defaultApps);
  } catch {
    // Blob not configured or unreachable: fallback to local file
    return NextResponse.json(defaultApps);
  }
}

export async function PUT(req: Request) {
  try {
    const tools = await req.json();
    if (!Array.isArray(tools)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await put(BLOB_KEY, JSON.stringify(tools), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
