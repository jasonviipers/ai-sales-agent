import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "@/config";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: config.database.url,
});

export const db = drizzle(pool);
