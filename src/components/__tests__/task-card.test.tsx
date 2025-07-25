import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "../task-card";
import { Task } from "@/types/task";

// Mock the useIsClient hook
jest.mock("@/hooks/use-is-client", () => ({
  useIsClient: () => true,
}));

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

// Mock the SimpleAvatar component
jest.mock("@/components/ui/simple-avatar", () => ({
  SimpleAvatar: ({ assigneeName }: { assigneeName: string }) => (
    <div data-testid={`avatar-${assigneeName}`}>Avatar: {assigneeName}</div>
  ),
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
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Started Jan 15")).toBeInTheDocument();
    expect(screen.getByText("Due Jan 20")).toBeInTheDocument();
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

    const dueDateElement = screen.getByText(/Due Jan 1/);
    expect(dueDateElement).toHaveClass("text-red-600");
    expect(screen.getByTestId("alert-triangle")).toBeInTheDocument();
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

  it("shows edit button on hover", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });
  });

  it("enters edit mode when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);

    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    expect(
      screen.getByPlaceholderText("Enter assignee names (comma separated)"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
  });

  it("saves assignees when valid input is provided", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Update assignees
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "Alice Johnson, Bob Smith");

    // Save
    const saveButton = screen.getByRole("button", { name: /check/i });
    await user.click(saveButton);

    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: ["Alice Johnson", "Bob Smith"],
    });
    expect(
      screen.queryByPlaceholderText("Enter assignee names (comma separated)"),
    ).not.toBeInTheDocument();
  });

  it("shows validation error for invalid assignee names", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Enter invalid assignee names
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "John123, Jane@Smith");

    // Try to save
    const saveButton = screen.getByRole("button", { name: /check/i });
    await user.click(saveButton);

    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();
    expect(mockOnUpdateTask).not.toHaveBeenCalled();
  });

  it("cancels edit mode and restores original assignees", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Modify input
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "New Assignee");

    // Cancel
    const cancelButton = screen.getByRole("button", { name: /x/i });
    await user.click(cancelButton);

    expect(mockOnUpdateTask).not.toHaveBeenCalled();
    expect(
      screen.queryByPlaceholderText("Enter assignee names (comma separated)"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles keyboard shortcuts in edit mode", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "Alice Johnson");

    // Test Enter key
    await user.keyboard("{Enter}");
    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: ["Alice Johnson"],
    });
  });

  it("handles escape key in edit mode", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "New Assignee");

    // Test Escape key
    await user.keyboard("{Escape}");
    expect(mockOnUpdateTask).not.toHaveBeenCalled();
    expect(
      screen.queryByPlaceholderText("Enter assignee names (comma separated)"),
    ).not.toBeInTheDocument();
  });

  it("shows more assignees indicator when there are many assignees", () => {
    const taskWithManyAssignees = {
      ...mockTask,
      assignees: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"],
    };
    render(<TaskCard task={taskWithManyAssignees} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("+3 more")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.queryByText("David")).not.toBeInTheDocument();
  });

  it("clears validation error when user types", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button");
    fireEvent.mouseEnter(card);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Enter invalid input and trigger error
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    await user.clear(input);
    await user.type(input, "John123");

    const saveButton = screen.getByRole("button", { name: /check/i });
    await user.click(saveButton);

    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();

    // Type valid input
    await user.clear(input);
    await user.type(input, "John Doe");

    expect(
      screen.queryByText(
        /Assignee names can only contain letters, spaces, hyphens, and apostrophes/,
      ),
    ).not.toBeInTheDocument();
  });

  it("works without onUpdateTask callback", () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
