import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { isValidStatus } from "@/lib/db/status";

export async function GET() {
  const rows = await db.query.tasks.findMany({
    orderBy: [desc(tasks.createdAt)],
    with: { pod: true, story: true, assignee: true },
  });
  return NextResponse.json({ tasks: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, podId, storyId, assigneeId, status } = body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof podId !== "number") {
    return NextResponse.json({ error: "podId is required" }, { status: 400 });
  }

  const [task] = await db
    .insert(tasks)
    .values({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() || null : null,
      podId,
      storyId: typeof storyId === "number" ? storyId : null,
      assigneeId: typeof assigneeId === "number" ? assigneeId : null,
      status: isValidStatus(status) ? status : "todo",
    })
    .returning();

  return NextResponse.json({ task }, { status: 201 });
}
