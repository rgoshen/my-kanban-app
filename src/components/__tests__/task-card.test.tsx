import React from "react";
import { render, screen } from "@testing-library/react";
import { TaskCard } from "../task-card";
import { Task } from "@/types/task";

// Mock the useDraggable hook
jest.mock("@dnd-kit/core", () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  }),
}));

const mockTask: Task = {
  id: "task-1",
  title: "Test Task",
  description: "This is a test task description",
  status: "todo",
  priority: "medium",
  assignees: ["John Doe", "Jane Smith"],
  startDate: "2024-01-15",
  dueDate: "2024-01-20",
};

const mockOnUpdateTask = jest.fn();

describe("TaskCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task information correctly", () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test task description")).toBeInTheDocument();
    expect(screen.getByText("🟡")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders task without description", () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskCard task={taskWithoutDescription} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.queryByText("This is a test task description")).not.toBeInTheDocument();
  });

  it("renders task without assignees", () => {
    const taskWithoutAssignees = { ...mockTask, assignees: [] };
    render(<TaskCard task={taskWithoutAssignees} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("renders task without dates", () => {
    const taskWithoutDates = { ...mockTask, startDate: undefined, dueDate: undefined };
    render(<TaskCard task={taskWithoutDates} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("No start date")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();
  });

  it("shows overdue indicator for past due date", () => {
    const overdueTask = { ...mockTask, dueDate: "2020-01-01" };
    render(<TaskCard task={overdueTask} onUpdateTask={mockOnUpdateTask} />);

    // Dynamically generate the expected due date string
    const formattedDueDate = new Date("2020-01-01").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const dueDateRegex = new RegExp(`Due\\s+${formattedDueDate}`);
    const dueDateElement = screen.getByText(dueDateRegex);
    expect(dueDateElement).toHaveClass("text-red-600");
  });

  it("shows completed task styling", () => {
    const completedTask = { ...mockTask, status: "done" as const };
    render(<TaskCard task={completedTask} onUpdateTask={mockOnUpdateTask} />);

    const titleElement = screen.getByText("Test Task");
    expect(titleElement).toHaveClass("line-through", "opacity-60");
  });

  it("displays priority colors correctly", () => {
    const { rerender } = render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Medium priority (default)
    expect(screen.getByText("🟡")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();

    // High priority
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    rerender(<TaskCard task={highPriorityTask} onUpdateTask={mockOnUpdateTask} />);
    expect(screen.getByText("🔴")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();

    // Low priority
    const lowPriorityTask = { ...mockTask, priority: "low" as const };
    rerender(<TaskCard task={lowPriorityTask} onUpdateTask={mockOnUpdateTask} />);
    expect(screen.getByText("🟢")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("works without onUpdateTask callback", () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
});
