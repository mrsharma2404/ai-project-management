import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { isValidStatus } from "@/lib/db/status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, podId, storyId, assigneeId, status } = body ?? {};

  const [task] = await db
    .update(tasks)
    .set({
      ...(typeof title === "string" ? { title: title.trim() } : {}),
      ...(typeof description === "string"
        ? { description: description.trim() || null }
        : {}),
      ...(typeof podId === "number" ? { podId } : {}),
      ...(storyId === null || typeof storyId === "number" ? { storyId } : {}),
      ...(assigneeId === null || typeof assigneeId === "number"
        ? { assigneeId }
        : {}),
      ...(isValidStatus(status) ? { status } : {}),
    })
    .where(eq(tasks.id, Number(id)))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "task not found" }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(tasks).where(eq(tasks.id, Number(id)));
  return NextResponse.json({ ok: true });
}
