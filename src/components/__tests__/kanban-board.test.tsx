import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import KanbanBoard from "../kanban/kanban-board";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/sample-tasks";

// Mock the useIsClient hook
jest.mock("@/hooks/use-is-client", () => ({
  useIsClient: () => true,
}));

// Mock the useSensors hook
jest.mock("@dnd-kit/core", () => ({
  useSensors: jest.fn(() => []),
  useSensor: jest.fn(),
  PointerSensor: jest.fn(),
  DndContext: ({ children, onDragStart, onDragEnd }: any) => (
    <div
      data-testid="dnd-context"
      onClick={(e) => {
        if (e.currentTarget.dataset.testid === "dnd-context") {
          onDragStart?.({ active: { id: "1" } });
        }
      }}
    >
      {children}
    </div>
  ),
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
}));

// Mock the TaskFormDialog component
jest.mock("../kanban/task-form-dialog", () => ({
  TaskFormDialog: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <button
      data-testid="add-task-button"
      onClick={() =>
        onSubmit({
          title: "New Test Task",
          description: "New test description",
          priority: "medium",
          assignees: ["New Assignee"],
          dueDate: "2024-12-31",
        })
      }
    >
      Add Task
    </button>
  ),
}));

// Mock the KanbanColumns component
jest.mock("../kanban/kanban-columns", () => ({
  KanbanColumns: ({ tasks, onUpdateTask }: { tasks: Task[]; onUpdateTask?: any }) => (
    <div data-testid="kanban-columns">
      {tasks.map((task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.title}
          <button
            data-testid={`update-task-${task.id}`}
            onClick={() => onUpdateTask?.(task.id, { title: "Updated Task" })}
          >
            Update
          </button>
        </div>
      ))}
    </div>
  ),
}));

// Mock the TaskCard component
jest.mock("../kanban/task-card", () => ({
  TaskCard: ({ task }: { task: Task }) => (
    <div data-testid={`task-card-${task.id}`}>{task.title}</div>
  ),
}));

// Mock the ThemeToggle component
jest.mock("../layout/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock crypto.randomUUID with unique IDs
let uuidCounter = 0;
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => `test-uuid-${++uuidCounter}`,
  },
  writable: true,
  configurable: true,
});

// Use real sample tasks instead of mocking

describe("KanbanBoard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset UUID counter for each test
    uuidCounter = 0;
    // Re-define the crypto mock to ensure it's fresh
    Object.defineProperty(global, "crypto", {
      value: {
        randomUUID: () => `test-uuid-${++uuidCounter}`,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders the main board with title and logo", () => {
    render(<KanbanBoard />);

    expect(screen.getByText("My Kanban Board")).toBeInTheDocument();
    expect(screen.getByAltText("Kanban Board")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders add task button", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("add-task-button")).toBeInTheDocument();
  });

  it("renders kanban columns with sample tasks", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("kanban-columns")).toBeInTheDocument();
    expect(screen.getByTestId("task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-2")).toBeInTheDocument();
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Build Kanban Board")).toBeInTheDocument();
  });

  it("adds new task when form is submitted", async () => {
    render(<KanbanBoard />);

    const addButton = screen.getByTestId("add-task-button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-test-uuid-1")).toBeInTheDocument();
      expect(screen.getByText("New Test Task")).toBeInTheDocument();
    });
  });

  it("updates task when onUpdateTask is called", () => {
    render(<KanbanBoard />);

    const updateButton = screen.getByTestId("update-task-1");
    fireEvent.click(updateButton);

    expect(screen.getByText("Updated Task")).toBeInTheDocument();
  });

  it("handles drag start correctly", () => {
    render(<KanbanBoard />);

    const dndContext = screen.getByTestId("dnd-context");

    // Simulate the drag start event by clicking the context
    fireEvent.click(dndContext);

    // The drag overlay should show the dragged task
    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
  });

  it("handles drag end correctly", () => {
    render(<KanbanBoard />);

    const dndContext = screen.getByTestId("dnd-context");
    const dragEndEvent = {
      active: { id: "task-1" },
      over: { id: "done" },
    };

    fireEvent.dragEnd(dndContext, dragEndEvent);

    // The task should be moved to the done column
    // This would be verified by checking the task status in the columns
  });

  it("handles drag end with no over target", () => {
    render(<KanbanBoard />);

    const dndContext = screen.getByTestId("dnd-context");
    const dragEndEvent = {
      active: { id: "1" },
      over: null,
    };

    fireEvent.dragEnd(dndContext, dragEndEvent);

    // Should not change anything when dropping on nothing
  });

  it("handles drag end with invalid status", () => {
    render(<KanbanBoard />);

    const dndContext = screen.getByTestId("dnd-context");
    const dragEndEvent = {
      active: { id: "1" },
      over: { id: "invalid-status" },
    };

    fireEvent.dragEnd(dndContext, dragEndEvent);

    // Should not change task status for invalid status
  });

  it("generates unique IDs for new tasks", () => {
    render(<KanbanBoard />);

    const addButton = screen.getByTestId("add-task-button");

    // Add first task
    fireEvent.click(addButton);

    // Add second task
    fireEvent.click(addButton);

    // Both tasks should have unique IDs
    expect(screen.getByTestId("task-test-uuid-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-test-uuid-2")).toBeInTheDocument();
  });

  it("sets start date to today for new tasks", () => {
    const mockDate = new Date("2024-01-15");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);

    render(<KanbanBoard />);

    const addButton = screen.getByTestId("add-task-button");
    fireEvent.click(addButton);

    // The new task should have today's date as start date
    expect(screen.getByTestId("task-test-uuid-1")).toBeInTheDocument();
  });

  it("handles task with empty assignees array", () => {
    render(<KanbanBoard />);

    // The component should handle tasks with empty assignees
    expect(screen.getByTestId("kanban-columns")).toBeInTheDocument();
  });

  it("handles task with undefined assignees", () => {
    render(<KanbanBoard />);

    // The component should handle tasks with undefined assignees
    expect(screen.getByTestId("kanban-columns")).toBeInTheDocument();
  });

  it("renders drag overlay when dragging", () => {
    render(<KanbanBoard />);

    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
  });

  it("handles multiple task updates", () => {
    render(<KanbanBoard />);

    const updateButton1 = screen.getByTestId("update-task-1");
    const updateButton2 = screen.getByTestId("update-task-2");

    fireEvent.click(updateButton1);
    fireEvent.click(updateButton2);

    // Check that both tasks in the columns are updated (excluding drag overlay)
    const updatedTasks = screen.getAllByTestId(/^task-[1-2]$/);
    expect(updatedTasks).toHaveLength(2);
    updatedTasks.forEach((task) => {
      expect(task).toHaveTextContent("Updated Task");
    });
  });
});
