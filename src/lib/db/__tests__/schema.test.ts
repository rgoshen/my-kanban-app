import { describe, it, expect } from "@jest/globals";
import {
  columns,
  tasks,
  taskStatusEnum,
  taskPriorityEnum,
  columnsRelations,
  tasksRelations,
} from "../schema";

describe("Database Schema", () => {
  describe("columns table", () => {
    it("should have correct structure", () => {
      expect(columns.id).toBeDefined();
      expect(columns.name).toBeDefined();
      expect(columns.orderIndex).toBeDefined();
      expect(columns.createdAt).toBeDefined();
      expect(columns.updatedAt).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(columns.id.name).toBe("id");
      expect(columns.name.name).toBe("name");
      expect(columns.orderIndex.name).toBe("order_index");
      expect(columns.createdAt.name).toBe("created_at");
      expect(columns.updatedAt.name).toBe("updated_at");
    });
  });

  describe("tasks table", () => {
    it("should have correct structure", () => {
      expect(tasks.id).toBeDefined();
      expect(tasks.title).toBeDefined();
      expect(tasks.description).toBeDefined();
      expect(tasks.priority).toBeDefined();
      expect(tasks.status).toBeDefined();
      expect(tasks.columnId).toBeDefined();
      expect(tasks.orderIndex).toBeDefined();
      expect(tasks.assignees).toBeDefined();
      expect(tasks.dueDate).toBeDefined();
      expect(tasks.startDate).toBeDefined();
      expect(tasks.createdAt).toBeDefined();
      expect(tasks.updatedAt).toBeDefined();
    });

    it("should have correct column types", () => {
      expect(tasks.id.name).toBe("id");
      expect(tasks.title.name).toBe("title");
      expect(tasks.description.name).toBe("description");
      expect(tasks.priority.name).toBe("priority");
      expect(tasks.status.name).toBe("status");
      expect(tasks.columnId.name).toBe("column_id");
      expect(tasks.orderIndex.name).toBe("order_index");
      expect(tasks.assignees.name).toBe("assignees");
      expect(tasks.dueDate.name).toBe("due_date");
      expect(tasks.startDate.name).toBe("start_date");
      expect(tasks.createdAt.name).toBe("created_at");
      expect(tasks.updatedAt.name).toBe("updated_at");
    });
  });

  describe("enums", () => {
    it("should have task status enum values", () => {
      expect(taskStatusEnum.enumValues).toEqual(["todo", "inprogress", "done"]);
    });

    it("should have task priority enum values", () => {
      expect(taskPriorityEnum.enumValues).toEqual(["low", "medium", "high"]);
    });
  });

  describe("relations", () => {
    it("should have column relations defined", () => {
      expect(columnsRelations).toBeDefined();
    });

    it("should have task relations defined", () => {
      expect(tasksRelations).toBeDefined();
    });
  });
});
