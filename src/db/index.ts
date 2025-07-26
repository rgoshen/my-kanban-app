import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection configuration
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || "kanban_user"}:${process.env.DB_PASSWORD || "kanban_password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "kanban_db"}`;

// Create postgres client
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export the client for manual connection management if needed
export { client };

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database connections...");
  await client.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing database connections...");
  await client.end();
  process.exit(0);
});
