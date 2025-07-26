import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { columnService, taskService } from "../services";
import { columns, tasks } from "../schema";

// Mock the database
jest.mock("../index", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => Promise.resolve([])),
        orderBy: jest.fn(() => Promise.resolve([])),
      })),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ id: "test-id" }])),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => Promise.resolve([])),
      })),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve([])),
    })),
    transaction: jest.fn((callback: any) =>
      callback({
        select: jest.fn(() => ({
          from: jest.fn(() => ({
            where: jest.fn(() => Promise.resolve([])),
            orderBy: jest.fn(() => Promise.resolve([])),
          })),
        })),
        insert: jest.fn(() => ({
          values: jest.fn(() => ({
            returning: jest.fn(() => Promise.resolve([{ id: "test-id" }])),
          })),
        })),
        update: jest.fn(() => ({
          set: jest.fn(() => ({
            where: jest.fn(() => Promise.resolve([])),
          })),
        })),
        delete: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([])),
        })),
      }),
    ),
  },
}));

describe("Database Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Column Service", () => {
    it("should have getAll method", () => {
      expect(columnService.getAll).toBeDefined();
      expect(typeof columnService.getAll).toBe("function");
    });

    it("should have getById method", () => {
      expect(columnService.getById).toBeDefined();
      expect(typeof columnService.getById).toBe("function");
    });

    it("should have create method", () => {
      expect(columnService.create).toBeDefined();
      expect(typeof columnService.create).toBe("function");
    });

    it("should have update method", () => {
      expect(columnService.update).toBeDefined();
      expect(typeof columnService.update).toBe("function");
    });

    it("should have delete method", () => {
      expect(columnService.delete).toBeDefined();
      expect(typeof columnService.delete).toBe("function");
    });

    it("should have reorder method", () => {
      expect(columnService.reorder).toBeDefined();
      expect(typeof columnService.reorder).toBe("function");
    });
  });

  describe("Task Service", () => {
    it("should have getAll method", () => {
      expect(taskService.getAll).toBeDefined();
      expect(typeof taskService.getAll).toBe("function");
    });

    it("should have getById method", () => {
      expect(taskService.getById).toBeDefined();
      expect(typeof taskService.getById).toBe("function");
    });

    it("should have create method", () => {
      expect(taskService.create).toBeDefined();
      expect(typeof taskService.create).toBe("function");
    });

    it("should have update method", () => {
      expect(taskService.update).toBeDefined();
      expect(typeof taskService.update).toBe("function");
    });

    it("should have delete method", () => {
      expect(taskService.delete).toBeDefined();
      expect(typeof taskService.delete).toBe("function");
    });

    it("should have moveTask method", () => {
      expect(taskService.moveTask).toBeDefined();
      expect(typeof taskService.moveTask).toBe("function");
    });

    it("should have reorderTasks method", () => {
      expect(taskService.reorderTasks).toBeDefined();
      expect(typeof taskService.reorderTasks).toBe("function");
    });

    it("should have getByStatus method", () => {
      expect(taskService.getByStatus).toBeDefined();
      expect(typeof taskService.getByStatus).toBe("function");
    });

    it("should have getByPriority method", () => {
      expect(taskService.getByPriority).toBeDefined();
      expect(typeof taskService.getByPriority).toBe("function");
    });
  });
});
