import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories } from "@/lib/db/schema";
import { isValidStatus } from "@/lib/db/status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, podId, epicId, status } = body ?? {};

  const [story] = await db
    .update(stories)
    .set({
      ...(typeof title === "string" ? { title: title.trim() } : {}),
      ...(typeof description === "string"
        ? { description: description.trim() || null }
        : {}),
      ...(typeof podId === "number" ? { podId } : {}),
      ...(epicId === null || typeof epicId === "number" ? { epicId } : {}),
      ...(isValidStatus(status) ? { status } : {}),
    })
    .where(eq(stories.id, Number(id)))
    .returning();

  if (!story) {
    return NextResponse.json({ error: "story not found" }, { status: 404 });
  }
  return NextResponse.json({ story });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(stories).where(eq(stories.id, Number(id)));
  return NextResponse.json({ ok: true });
}
