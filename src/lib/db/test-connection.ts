import { db } from "./index";
import { columnService, taskService } from "./services";

async function testConnection() {
  console.log("🔍 Testing database connection...");

  try {
    // Test basic connection
    const columns = await columnService.getAll();
    console.log("✅ Database connection successful");
    console.log(`📋 Found ${columns.length} columns`);

    // Test task retrieval
    const tasks = await taskService.getAll();
    console.log(`📝 Found ${tasks.length} tasks`);

    // Display sample data
    if (columns.length > 0) {
      console.log("\n📊 Sample Columns:");
      columns.forEach((column) => {
        console.log(`  - ${column.name} (ID: ${column.id})`);
      });
    }

    if (tasks.length > 0) {
      console.log("\n📋 Sample Tasks:");
      tasks.slice(0, 3).forEach((task) => {
        console.log(`  - ${task.title} (${task.status})`);
      });
    }

    console.log("\n🎉 Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(() => {
      console.log("Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

export { testConnection };
