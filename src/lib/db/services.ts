import { eq, asc, desc } from "drizzle-orm";
import { db } from "./index";
import { columns, tasks, type Column, type NewColumn, type Task, type NewTask } from "./schema";
import { validateUUID, validateRequiredString, validateOptionalString } from "../validation";

// Column services
export const columnService = {
  // Get all columns ordered by orderIndex
  async getAll(): Promise<Column[]> {
    return await db.select().from(columns).orderBy(asc(columns.orderIndex));
  },

  // Get a single column by ID
  async getById(id: string): Promise<Column | null> {
    if (!validateUUID(id)) {
      throw new Error("Invalid column ID format");
    }
    const result = await db.select().from(columns).where(eq(columns.id, id));
    return result[0] || null;
  },

  // Create a new column
  async create(data: NewColumn): Promise<Column> {
    const sanitizedData = {
      ...data,
      name: validateRequiredString(data.name, "Column name"),
    };
    const result = await db.insert(columns).values(sanitizedData).returning();
    return result[0];
  },

  // Update a column
  async update(id: string, data: Partial<NewColumn>): Promise<Column | null> {
    if (!validateUUID(id)) {
      throw new Error("Invalid column ID format");
    }
    const sanitizedData = {
      ...data,
      name: data.name ? validateRequiredString(data.name, "Column name") : undefined,
    };
    const result = await db
      .update(columns)
      .set({ updatedAt: new Date(), ...sanitizedData })
      .where(eq(columns.id, id))
      .returning();
    return result[0] || null;
  },

  // Delete a column (will cascade delete associated tasks)
  async delete(id: string): Promise<boolean> {
    if (!validateUUID(id)) {
      throw new Error("Invalid column ID format");
    }
    const result = await db.delete(columns).where(eq(columns.id, id)).returning();
    return result.length > 0;
  },

  // Reorder columns
  async reorder(columnIds: string[]): Promise<void> {
    if (columnIds.length === 0) return;

    // Use a transaction for atomicity
    await db.transaction(async (tx) => {
      // Batch updates for better performance
      const updates = columnIds.map((id, index) =>
        tx
          .update(columns)
          .set({ orderIndex: index, updatedAt: new Date() })
          .where(eq(columns.id, id)),
      );

      await Promise.all(updates);
    });
  },
};

// Task services
export const taskService = {
  // Get all tasks with their columns
  async getAll(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(asc(tasks.orderIndex));
  },

  // Get tasks by column ID
  async getByColumnId(columnId: string): Promise<Task[]> {
    if (!validateUUID(columnId)) {
      throw new Error("Invalid column ID format");
    }
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, columnId))
      .orderBy(asc(tasks.orderIndex));
  },

  // Get a single task by ID
  async getById(id: string): Promise<Task | null> {
    if (!validateUUID(id)) {
      throw new Error("Invalid task ID format");
    }
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0] || null;
  },

  // Create a new task
  async create(data: NewTask): Promise<Task> {
    const sanitizedData = {
      ...data,
      title: validateRequiredString(data.title, "Task title"),
      description: validateOptionalString(data.description),
    };
    const result = await db.insert(tasks).values(sanitizedData).returning();
    return result[0];
  },

  // Update a task
  async update(id: string, data: Partial<NewTask>): Promise<Task | null> {
    const result = await db
      .update(tasks)
      .set({ updatedAt: new Date(), ...data })
      .where(eq(tasks.id, id))
      .returning();
    return result[0] || null;
  },

  // Delete a task
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return result.length > 0;
  },

  // Move task to different column
  async moveTask(taskId: string, columnId: string, orderIndex: number): Promise<Task | null> {
    const result = await db
      .update(tasks)
      .set({
        columnId,
        orderIndex,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();
    return result[0] || null;
  },

  // Reorder tasks within a column
  async reorderTasks(columnId: string, taskIds: string[]): Promise<void> {
    if (taskIds.length === 0) return;

    // Use a transaction for atomicity
    await db.transaction(async (tx) => {
      // Batch updates for better performance
      const updates = taskIds.map((id, index) =>
        tx.update(tasks).set({ orderIndex: index, updatedAt: new Date() }).where(eq(tasks.id, id)),
      );

      await Promise.all(updates);
    });
  },

  // Get tasks by status
  async getByStatus(status: "todo" | "inprogress" | "done"): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.status, status))
      .orderBy(asc(tasks.orderIndex));
  },

  // Get tasks by priority
  async getByPriority(priority: "low" | "medium" | "high"): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.priority, priority))
      .orderBy(asc(tasks.orderIndex));
  },
};
