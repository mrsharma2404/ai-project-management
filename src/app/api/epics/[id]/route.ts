import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { epics } from "@/lib/db/schema";
import { isValidStatus } from "@/lib/db/status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, podId, status } = body ?? {};

  const [epic] = await db
    .update(epics)
    .set({
      ...(typeof title === "string" ? { title: title.trim() } : {}),
      ...(typeof description === "string"
        ? { description: description.trim() || null }
        : {}),
      ...(typeof podId === "number" ? { podId } : {}),
      ...(isValidStatus(status) ? { status } : {}),
    })
    .where(eq(epics.id, Number(id)))
    .returning();

  if (!epic) {
    return NextResponse.json({ error: "epic not found" }, { status: 404 });
  }
  return NextResponse.json({ epic });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(epics).where(eq(epics.id, Number(id)));
  return NextResponse.json({ ok: true });
}
