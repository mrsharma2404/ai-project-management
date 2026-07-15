import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { pods, users } from "./schema";
import { userGroups } from "@/lib/data/users";

const podSeed = [
  { name: "SND", slug: "snd", description: "Search & Discovery" },
  { name: "Checkout", slug: "checkout", description: "Cart, payments & order placement" },
  { name: "Consumer Post Order", slug: "consumer-post-order", description: "Order tracking, returns & support" },
  { name: "Supply Chain", slug: "supply-chain", description: "Inventory, fulfillment & logistics" },
  { name: "Devops", slug: "devops", description: "Infrastructure & release engineering" },
  { name: "Data", slug: "data", description: "Data platform & analytics" },
  { name: "UAE", slug: "uae", description: "UAE market engineering" },
  { name: "Testing", slug: "testing", description: "Quality engineering" },
];

async function seed() {
  console.log("Seeding pods...");
  const insertedPods = await db.insert(pods).values(podSeed).returning();
  const podIdByName = new Map(insertedPods.map((p) => [p.name, p.id]));

  console.log("Seeding users...");
  const userRows = userGroups.flatMap((group) => {
    const podId = podIdByName.get(group.pod);
    if (!podId) return [];
    return group.members.map((member) => ({
      name: member.name,
      position: member.position,
      podId,
    }));
  });
  await db.insert(users).values(userRows);

  console.log(`Seeded ${insertedPods.length} pods and ${userRows.length} users.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
