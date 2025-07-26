#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🌍 Setting up environment variables...\n");

// Check if .env.local already exists
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  console.log("⚠️  .env.local already exists. Skipping creation.");
  console.log("   If you want to recreate it, delete the existing file first.\n");
} else {
  // Read the example file
  const examplePath = path.join(process.cwd(), "config", "env.example");

  if (!fs.existsSync(examplePath)) {
    console.error("❌ config/env.example not found!");
    process.exit(1);
  }

  const exampleContent = fs.readFileSync(examplePath, "utf8");

  // Create .env.local with development defaults
  const envLocalContent = exampleContent
    .replace("NODE_ENV=development", "NODE_ENV=development")
    .replace("DEBUG=false", "DEBUG=true")
    .replace("DB_LOGGING=false", "DB_LOGGING=true");

  fs.writeFileSync(envLocalPath, envLocalContent);

  console.log("✅ Created .env.local with development settings");
  console.log("   - Database logging enabled");
  console.log("   - Debug mode enabled");
  console.log("   - Using local PostgreSQL connection\n");
}

// Check if .env.test exists for testing
const envTestPath = path.join(process.cwd(), ".env.test");
if (fs.existsSync(envTestPath)) {
  console.log("✅ .env.test already exists");
} else {
  const examplePath = path.join(process.cwd(), "config", "env.example");
  const exampleContent = fs.readFileSync(examplePath, "utf8");

  // Create .env.test with test-specific settings
  const envTestContent = exampleContent
    .replace("NODE_ENV=development", "NODE_ENV=test")
    .replace("DB_NAME=kanban_db", "DB_NAME=kanban_test_db")
    .replace(
      "DATABASE_URL=postgres://kanban_user:kanban_password@localhost:5432/kanban_db",
      "DATABASE_URL=postgres://kanban_user:kanban_password@localhost:5432/kanban_test_db",
    )
    .replace("DEBUG=true", "DEBUG=false")
    .replace("DB_LOGGING=true", "DB_LOGGING=false");

  fs.writeFileSync(envTestPath, envTestContent);

  console.log("✅ Created .env.test with test settings");
  console.log("   - Test database configuration");
  console.log("   - Logging disabled for clean test output\n");
}

console.log("🎉 Environment setup complete!");
console.log("\n📋 Next steps:");
console.log("   1. Start the database: npm run db:up");
console.log("   2. Run migrations: npm run db:push");
console.log("   3. Seed the database: npm run db:seed");
console.log("   4. Start development: npm run dev");
console.log("\n📚 For more information, see docs/DATABASE_SETUP.md");
