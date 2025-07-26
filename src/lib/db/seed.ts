import { db } from "./index";
import { columns, tasks } from "./schema";
import { columnService, taskService } from "./services";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Wrap all operations in a single transaction for atomicity
    await db.transaction(async (tx) => {
      // Clear existing data
      await tx.delete(tasks);
      await tx.delete(columns);

      console.log("🗑️  Cleared existing data");

      // Create default columns
      const todoColumn = await tx
        .insert(columns)
        .values({
          name: "To Do",
          orderIndex: 0,
        })
        .returning();

      const inProgressColumn = await tx
        .insert(columns)
        .values({
          name: "In Progress",
          orderIndex: 1,
        })
        .returning();

      const doneColumn = await tx
        .insert(columns)
        .values({
          name: "Done",
          orderIndex: 2,
        })
        .returning();

      console.log("📋 Created default columns");

      // Create sample tasks
      const sampleTasks = [
        {
          title: "Learn React",
          description: "Study React fundamentals and hooks",
          priority: "high" as const,
          status: "todo" as const,
          columnId: todoColumn[0].id,
          orderIndex: 0,
          assignees: ["John Doe"],
          dueDate: "2025-08-15",
          startDate: "2025-07-25",
        },
        {
          title: "Build Kanban Board",
          description: "Create a drag and drop kanban board",
          priority: "medium" as const,
          status: "inprogress" as const,
          columnId: inProgressColumn[0].id,
          orderIndex: 0,
          assignees: ["Jane Smith", "Bob Johnson"],
          dueDate: "2025-09-20",
          startDate: "2025-08-05",
        },
        {
          title: "Write Tests",
          description: "Add unit tests for components",
          priority: "low" as const,
          status: "done" as const,
          columnId: doneColumn[0].id,
          orderIndex: 0,
          assignees: ["Bob Johnson"],
          dueDate: "2025-07-10",
          startDate: "2025-06-25",
        },
        {
          title: "Design System Implementation",
          description: "Implement consistent design tokens and components",
          priority: "high" as const,
          status: "inprogress" as const,
          columnId: inProgressColumn[0].id,
          orderIndex: 1,
          assignees: ["Alice Brown", "Charlie Wilson"],
          dueDate: "2025-08-18",
          startDate: "2025-07-28",
        },
        {
          title: "Documentation Update",
          description: "Update API documentation and user guides",
          priority: "low" as const,
          status: "inprogress" as const,
          columnId: inProgressColumn[0].id,
          orderIndex: 2,
          assignees: ["Charlie Wilson", "John Doe", "Jane Smith"],
          dueDate: "2025-09-25",
          startDate: "2025-08-12",
        },
        {
          title: "Review Code Quality",
          description: "Perform code review and refactoring",
          priority: "medium" as const,
          status: "todo" as const,
          columnId: todoColumn[0].id,
          orderIndex: 1,
          dueDate: "2025-08-30",
          startDate: "2025-08-15",
        },
      ];

      // Insert all tasks in batch for better performance
      await tx.insert(tasks).values(sampleTasks);

      console.log("✅ Created sample tasks");
      console.log("🎉 Database seeding completed successfully!");
    });
  } catch (error: unknown) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seed };
