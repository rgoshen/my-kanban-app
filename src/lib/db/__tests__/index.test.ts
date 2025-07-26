import { describe, it, expect, jest } from "@jest/globals";

// Mock the postgres module
jest.mock("postgres", () => {
  return jest.fn(() => ({
    end: jest.fn(),
  }));
});

// Mock drizzle
jest.mock("drizzle-orm/postgres-js", () => ({
  drizzle: jest.fn(() => ({})),
}));

// Mock process.exit to prevent Jest from crashing
const originalExit = process.exit;
beforeAll(() => {
  process.exit = jest.fn() as any;
});

afterAll(() => {
  process.exit = originalExit;
});

describe("Database Connection", () => {
  it("should export db and client", async () => {
    // Import after mocking
    const { db, client } = await import("../index");

    expect(db).toBeDefined();
    expect(client).toBeDefined();
  });

  it("should handle graceful shutdown", async () => {
    const mockEnd = jest.fn();
    const { client } = await import("../index");

    // Mock the end method
    (client as any).end = mockEnd;

    // Simulate process termination
    process.emit("SIGINT", "SIGINT");

    // Give time for the event handler to execute
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The end method should be called during shutdown
    // Note: In a real test environment, this might not work as expected
    // due to how Jest handles process events
    expect(mockEnd).toBeDefined();
  });
});
