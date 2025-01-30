import dotenv from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const connection = postgres(process.env.DATABASE_URL as string, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./drizzle" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((error) => {
  console.log("❌ Migration failed");
  console.log(error);
  process.exit(1);
});
