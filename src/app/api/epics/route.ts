import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { epics } from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { isValidStatus } from "@/lib/db/status";

export async function GET() {
  const rows = await db.query.epics.findMany({
    orderBy: [desc(epics.createdAt)],
    with: { pod: true, stories: { orderBy: (s) => [asc(s.title)] } },
  });
  return NextResponse.json({ epics: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, podId, status } = body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof podId !== "number") {
    return NextResponse.json({ error: "podId is required" }, { status: 400 });
  }

  const [epic] = await db
    .insert(epics)
    .values({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() || null : null,
      podId,
      status: isValidStatus(status) ? status : "todo",
    })
    .returning();

  return NextResponse.json({ epic }, { status: 201 });
}
