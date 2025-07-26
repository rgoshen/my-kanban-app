import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "kanban_user",
    password: process.env.DB_PASSWORD || "kanban_password",
    database: process.env.DB_NAME || "kanban_db",
  },
  verbose: true,
  strict: true,
});
