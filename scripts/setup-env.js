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
    .replace("NODE_ENV=production", "NODE_ENV=development")
    .replace(
      "DATABASE_URL=postgres://your_user:your_password@your_host:5432/your_database",
      "DATABASE_URL=postgres://kanban_user:kanban_password@localhost:5432/kanban_db",
    )
    .replace("DB_HOST=your_host", "DB_HOST=localhost")
    .replace("DB_USER=your_user", "DB_USER=kanban_user")
    .replace("DB_PASSWORD=your_password", "DB_PASSWORD=kanban_password")
    .replace("DB_NAME=your_database", "DB_NAME=kanban_db")
    .replace(
      "NEXT_PUBLIC_APP_URL=https://your-domain.com",
      "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    )
    .replace(
      "AVATAR_SERVICE_URL=https://your-avatar-service.com",
      "AVATAR_SERVICE_URL=https://api.example.com/avatars",
    )
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
    .replace("NODE_ENV=production", "NODE_ENV=test")
    .replace(
      "DATABASE_URL=postgres://your_user:your_password@your_host:5432/your_database",
      "DATABASE_URL=postgres://kanban_user:kanban_password@localhost:5432/kanban_test_db",
    )
    .replace("DB_HOST=your_host", "DB_HOST=localhost")
    .replace("DB_USER=your_user", "DB_USER=kanban_user")
    .replace("DB_PASSWORD=your_password", "DB_PASSWORD=kanban_password")
    .replace("DB_NAME=your_database", "DB_NAME=kanban_test_db")
    .replace(
      "NEXT_PUBLIC_APP_URL=https://your-domain.com",
      "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    )
    .replace(
      "AVATAR_SERVICE_URL=https://your-avatar-service.com",
      "AVATAR_SERVICE_URL=https://api.example.com/avatars",
    );

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
