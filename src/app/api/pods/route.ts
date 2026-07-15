import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pods } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const rows = await db.query.pods.findMany({
    orderBy: [asc(pods.name)],
  });
  return NextResponse.json({ pods: rows });
}
