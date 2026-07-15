import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const rows = await db.query.users.findMany({
    orderBy: [asc(users.name)],
    with: { pod: true },
  });
  return NextResponse.json({ users: rows });
}
