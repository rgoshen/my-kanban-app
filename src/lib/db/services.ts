import { eq, asc, desc } from "drizzle-orm";
import { db } from "./index";
import { columns, tasks, type Column, type NewColumn, type Task, type NewTask } from "./schema";

// Column services
export const columnService = {
  // Get all columns ordered by orderIndex
  async getAll(): Promise<Column[]> {
    return await db.select().from(columns).orderBy(asc(columns.orderIndex));
  },

  // Get a single column by ID
  async getById(id: string): Promise<Column | null> {
    const result = await db.select().from(columns).where(eq(columns.id, id));
    return result[0] || null;
  },

  // Create a new column
  async create(data: NewColumn): Promise<Column> {
    const result = await db.insert(columns).values(data).returning();
    return result[0];
  },

  // Update a column
  async update(id: string, data: Partial<NewColumn>): Promise<Column | null> {
    const result = await db
      .update(columns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(columns.id, id))
      .returning();
    return result[0] || null;
  },

  // Delete a column (will cascade delete associated tasks)
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(columns).where(eq(columns.id, id)).returning();
    return result.length > 0;
  },

  // Reorder columns
  async reorder(columnIds: string[]): Promise<void> {
    for (let i = 0; i < columnIds.length; i++) {
      await db
        .update(columns)
        .set({ orderIndex: i, updatedAt: new Date() })
        .where(eq(columns.id, columnIds[i]));
    }
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
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.columnId, columnId))
      .orderBy(asc(tasks.orderIndex));
  },

  // Get a single task by ID
  async getById(id: string): Promise<Task | null> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0] || null;
  },

  // Create a new task
  async create(data: NewTask): Promise<Task> {
    const result = await db.insert(tasks).values(data).returning();
    return result[0];
  },

  // Update a task
  async update(id: string, data: Partial<NewTask>): Promise<Task | null> {
    const result = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
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
    for (let i = 0; i < taskIds.length; i++) {
      await db
        .update(tasks)
        .set({ orderIndex: i, updatedAt: new Date() })
        .where(eq(tasks.id, taskIds[i]));
    }
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
