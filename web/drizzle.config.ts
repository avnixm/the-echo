import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
import type { Config } from "drizzle-kit";

export default {
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
} satisfies Config;


