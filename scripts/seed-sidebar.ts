import "dotenv/config"; // Load environment variables
import { MongoClient } from "mongodb";
import { SidebarGroupDoc } from "@/types/sidebar.types";
import { sidebarSeedData } from "@/lib/sidebar-seed-data";
import { getCollection } from "@/lib/db";

async function seedSidebar() {
  if (!process.env.DB_URI) {
    throw new Error("DB_URI not defined in .env");
  }

  const collection = await getCollection<SidebarGroupDoc>("sidebar_groups");
  try {
    // drop existing data
    await collection.drop();

    console.log("Cleared existing sidebar_groups collection.");

    // Insert seed data
    await collection.insertMany(sidebarSeedData);
    console.log(`Inserted ${sidebarSeedData.length} sidebar groups.`);
  } catch (err) {
    console.error("Failed to seed sidebar:", err);
  }
}

// Run the seeding script
seedSidebar()
  .then(() => {
    console.log("Sidebar seeded successfully.");
    console.log("⚠ Restart the Next.js server to refresh sidebar cache.");
  })
  .catch(console.error);
