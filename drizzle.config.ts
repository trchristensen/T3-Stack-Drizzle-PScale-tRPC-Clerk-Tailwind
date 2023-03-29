import type { Config } from "drizzle-kit";
import "dotenv/config";

/** @type { import("drizzle-kit").Config } */

export default {
    connectionString: process.env.DB_URL,
    out: "./db/generated",
    schema: "./db/schema.ts"
} satisfies Config;