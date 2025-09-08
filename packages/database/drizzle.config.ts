import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "@workspace/env/server";

export default defineConfig({
  schema: "./src/schema/*",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
