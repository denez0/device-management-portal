import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(__dirname, ".env"), quiet: true });

// Resolve SQLite path from project root when tests run via Jest
if (process.env.DATABASE_URL?.startsWith("file:./dev.db")) {
  process.env.DATABASE_URL = `file:${path.resolve(__dirname, "prisma", "dev.db")}`;
}
