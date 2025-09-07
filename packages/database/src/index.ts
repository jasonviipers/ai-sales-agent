import { drizzle } from "drizzle-orm/node-postgres";
// import { config } from "@/config";
import { Pool } from "pg";

const pool = new Pool({
	// connectionString: config.database.url,
	connectionString: process.env.DATABASE_URL || "",
});

export const db = drizzle(pool);
