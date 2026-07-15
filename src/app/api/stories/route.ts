import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { isValidStatus } from "@/lib/db/status";

export async function GET() {
  const rows = await db.query.stories.findMany({
    orderBy: [desc(stories.createdAt)],
    with: { pod: true, epic: true, tasks: true },
  });
  return NextResponse.json({ stories: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, podId, epicId, status } = body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof podId !== "number") {
    return NextResponse.json({ error: "podId is required" }, { status: 400 });
  }

  const [story] = await db
    .insert(stories)
    .values({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() || null : null,
      podId,
      epicId: typeof epicId === "number" ? epicId : null,
      status: isValidStatus(status) ? status : "todo",
    })
    .returning();

  return NextResponse.json({ story }, { status: 201 });
}
