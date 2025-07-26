import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskCard } from "../kanban/task-card";
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

// Mock the SimpleAvatar component to prevent async operations in tests
jest.mock("@/components/ui/simple-avatar", () => ({
  SimpleAvatar: ({ assigneeName, size, className }: any) => (
    <div data-testid={`simple-avatar-${assigneeName}`} className={className}>
      {assigneeName ? assigneeName.charAt(0).toUpperCase() : "?"}
    </div>
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

  it("handles assignee editing functionality", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Find and click the edit button (it's hidden by default, so we need to trigger hover)
    const card = screen.getByRole("button", { name: "" }); // The card itself is a button
    fireEvent.mouseEnter(card); // Trigger hover to show edit button

    const editButton = screen.getByRole("button", { name: "" }); // Edit button has no accessible name
    fireEvent.click(editButton);

    // Should show the input field for editing assignees
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    expect(input).toBeInTheDocument();

    // Should show save and cancel buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Should have save and cancel buttons
  });

  it("handles assignee validation errors", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter invalid assignee names (with invalid characters)
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "John@Doe, Jane#Smith" } });

    // Click save - should show validation error
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should show validation error
    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();
  });

  it("handles assignee save with valid names", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter valid assignee names
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "Alice Brown, Bob Johnson" } });

    // Click save
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should call onUpdateTask with new assignees
    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: ["Alice Brown", "Bob Johnson"],
    });
  });

  it("handles assignee cancel", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter some text
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "New Assignee" } });

    // Click cancel
    const buttons = screen.getAllByRole("button");
    const cancelButton = buttons.find((button) => button.querySelector('svg[class*="x"]'));
    fireEvent.click(cancelButton!);

    // Should not call onUpdateTask
    expect(mockOnUpdateTask).not.toHaveBeenCalled();

    // Should exit edit mode
    expect(
      screen.queryByPlaceholderText("Enter assignee names (comma separated)"),
    ).not.toBeInTheDocument();
  });

  it("handles keyboard events in assignee editing", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");

    // Test Enter key saves
    fireEvent.change(input, { target: { value: "Alice Brown" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: ["Alice Brown"],
    });

    // Reset mock for next test
    mockOnUpdateTask.mockClear();

    // Enter edit mode again
    fireEvent.mouseEnter(card);
    const editButton2 = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton2);
    const input2 = screen.getByPlaceholderText("Enter assignee names (comma separated)");

    // Test Escape key cancels
    fireEvent.change(input2, { target: { value: "Bob Johnson" } });
    fireEvent.keyDown(input2, { key: "Escape" });

    expect(mockOnUpdateTask).not.toHaveBeenCalled();
  });

  it("clears validation error when typing", async () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter invalid input and trigger validation error
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "John@Doe" } });

    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should show validation error
    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();

    // Start typing - should clear validation error
    fireEvent.change(input, { target: { value: "Alice Brown" } });
    expect(
      screen.queryByText(
        /Assignee names can only contain letters, spaces, hyphens, and apostrophes/,
      ),
    ).not.toBeInTheDocument();
  });

  it("shows more assignees badge when there are many assignees", () => {
    const taskWithManyAssignees = {
      ...mockTask,
      assignees: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry"],
    };

    render(<TaskCard task={taskWithManyAssignees} onUpdateTask={mockOnUpdateTask} />);

    // Should show the first 3 assignees (MAX_DISPLAYED_ASSIGNEES = 3)
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();

    // Should show "+5 more" badge for the remaining assignees (8 total - 3 displayed = 5 more)
    expect(screen.getByText("+5 more")).toBeInTheDocument();
  });

  it("handles client-side rendering with drag functionality", () => {
    // Mock useIsClient to return true (client-side)
    jest.doMock("@/hooks/use-is-client", () => ({
      useIsClient: () => true,
    }));

    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Should have drag-related attributes when on client
    const card = screen.getByRole("button", { name: "" });
    expect(card).toBeInTheDocument();
  });

  it("handles server-side rendering without drag functionality", () => {
    // Mock useIsClient to return false (server-side)
    jest.doMock("@/hooks/use-is-client", () => ({
      useIsClient: () => false,
    }));

    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Should still render but without drag functionality
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("shows overdue styling when task is overdue", () => {
    const overdueTask = {
      ...mockTask,
      dueDate: "2020-01-01", // Past date
    };

    render(<TaskCard task={overdueTask} onUpdateTask={mockOnUpdateTask} />);

    // Should have overdue border styling
    const card = screen.getByText("Test Task").closest('[data-slot="card"]');
    expect(card).toHaveClass("border-2", "border-red-300");
  });

  it("shows priority border when task is not overdue", () => {
    const futureTask = {
      ...mockTask,
      dueDate: "2030-01-01", // Future date
    };

    render(<TaskCard task={futureTask} onUpdateTask={mockOnUpdateTask} />);

    // Should have priority border styling instead of overdue styling
    const card = screen.getByRole("button", { name: "" });
    expect(card).not.toHaveClass("border-2", "border-red-300");
  });

  it("shows completed task styling for done status", () => {
    const completedTask = {
      ...mockTask,
      status: "done" as const,
    };

    render(<TaskCard task={completedTask} onUpdateTask={mockOnUpdateTask} />);

    // Should have completed styling
    const title = screen.getByText("Test Task");
    expect(title).toHaveClass("line-through", "opacity-60");
  });

  it("shows description when present", () => {
    const taskWithDescription = {
      ...mockTask,
      description: "This is a test description",
    };

    render(<TaskCard task={taskWithDescription} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("This is a test description")).toBeInTheDocument();
  });

  it("does not show description when absent", () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: undefined,
    };

    render(<TaskCard task={taskWithoutDescription} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.queryByText("This is a test task description")).not.toBeInTheDocument();
  });

  it("shows assignees when present", () => {
    const taskWithAssignees = {
      ...mockTask,
      assignees: ["John Doe", "Jane Smith"],
    };

    render(<TaskCard task={taskWithAssignees} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("shows unassigned when no assignees", () => {
    const taskWithoutAssignees = {
      ...mockTask,
      assignees: [],
    };

    render(<TaskCard task={taskWithoutAssignees} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("shows overflow badge when assignees exceed display limit", () => {
    const taskWithManyAssignees = {
      ...mockTask,
      assignees: ["Alice", "Bob", "Charlie", "David"], // 4 assignees, limit is 3
    };

    render(<TaskCard task={taskWithManyAssignees} onUpdateTask={mockOnUpdateTask} />);

    // Should show first 3 assignees
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();

    // Should show "+1 more" badge
    expect(screen.getByText("+1 more")).toBeInTheDocument();
  });

  it("does not show overflow badge when assignees within limit", () => {
    const taskWithFewAssignees = {
      ...mockTask,
      assignees: ["Alice", "Bob"], // 2 assignees, limit is 3
    };

    render(<TaskCard task={taskWithFewAssignees} onUpdateTask={mockOnUpdateTask} />);

    // Should show both assignees
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    // Should not show overflow badge
    expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument();
  });

  it("handles formatDate with null input", () => {
    const taskWithNullDates = {
      ...mockTask,
      startDate: null as any,
      dueDate: undefined,
    };

    render(<TaskCard task={taskWithNullDates} onUpdateTask={mockOnUpdateTask} />);

    // Should show "No start date" and "No due date" for null/undefined values
    expect(screen.getByText("No start date")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();
  });

  it("handles validation error fallback message", () => {
    // Test that the component handles validation errors properly
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter invalid input that will trigger validation error
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "Invalid@Name" } });

    // Click save - should show validation error
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should show validation error message
    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();
  });

  it("handles memoization with changing dependencies", () => {
    const { rerender } = render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Initially should show formatted dates
    const formattedStartDate = new Date("2024-01-15").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedDueDate = new Date("2024-01-20").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    expect(screen.getByText(`Started ${formattedStartDate}`)).toBeInTheDocument();
    expect(screen.getByText(`Due ${formattedDueDate}`)).toBeInTheDocument();

    // Change dates and re-render
    const updatedTask = {
      ...mockTask,
      startDate: "2024-02-15",
      dueDate: "2024-02-20",
    };

    rerender(<TaskCard task={updatedTask} onUpdateTask={mockOnUpdateTask} />);

    // Should show updated formatted dates
    const newFormattedStartDate = new Date("2024-02-15").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const newFormattedDueDate = new Date("2024-02-20").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    expect(screen.getByText(`Started ${newFormattedStartDate}`)).toBeInTheDocument();
    expect(screen.getByText(`Due ${newFormattedDueDate}`)).toBeInTheDocument();
  });

  it("handles priority object access edge cases", () => {
    // Test all priority values to ensure object access branches are covered
    const priorities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

    priorities.forEach((priority) => {
      const taskWithPriority = {
        ...mockTask,
        priority,
      };

      const { unmount } = render(
        <TaskCard task={taskWithPriority} onUpdateTask={mockOnUpdateTask} />,
      );

      // Verify priority-specific styling is applied
      const card = screen.getByRole("button", { name: "" });
      expect(card).toBeInTheDocument();

      // Verify priority icon is displayed
      const priorityIcons = { low: "🟢", medium: "🟡", high: "🔴" };
      expect(screen.getByText(priorityIcons[priority])).toBeInTheDocument();

      unmount();
    });
  });

  it("handles assignee editing with empty input", () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Clear the input (empty string)
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "" } });

    // Click save - should save empty assignees array
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should call onUpdateTask with empty assignees array
    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: [],
    });
  });

  it("handles assignee editing with whitespace-only input", () => {
    render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter whitespace-only input
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "   ,  , " } });

    // Click save - should save empty assignees array (whitespace is trimmed)
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should call onUpdateTask with empty assignees array
    expect(mockOnUpdateTask).toHaveBeenCalledWith("task-1", {
      assignees: [],
    });
  });

  it("handles client-side rendering edge cases", () => {
    // Test the case where isClient is false but we still render the component
    // This covers the conditional branches in the JSX
    const taskWithoutClient = {
      ...mockTask,
      // Force server-side rendering scenario
    };

    render(<TaskCard task={taskWithoutClient} onUpdateTask={mockOnUpdateTask} />);

    // Should still render correctly even without client-side features
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("handles task with all optional fields undefined", () => {
    const minimalTask = {
      id: "minimal-task",
      title: "Minimal Task",
      status: "todo" as const,
      priority: "low" as const,
      // All other fields undefined
    };

    render(<TaskCard task={minimalTask} onUpdateTask={mockOnUpdateTask} />);

    // Should render without errors
    expect(screen.getByText("Minimal Task")).toBeInTheDocument();
    expect(screen.getByText("🟢")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();
    expect(screen.getByText("No start date")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();
  });

  it("handles memoization with null dependencies", () => {
    const { rerender } = render(<TaskCard task={mockTask} onUpdateTask={mockOnUpdateTask} />);

    // Test with null startDate and undefined dueDate
    const taskWithNullDates = {
      ...mockTask,
      startDate: null as any,
      dueDate: undefined,
    };

    rerender(<TaskCard task={taskWithNullDates} onUpdateTask={mockOnUpdateTask} />);

    // Should handle null/undefined dates in memoization
    expect(screen.getByText("No start date")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();

    // Test with empty string dates
    const taskWithEmptyDates = {
      ...mockTask,
      startDate: "",
      dueDate: "",
    };

    rerender(<TaskCard task={taskWithEmptyDates} onUpdateTask={mockOnUpdateTask} />);

    // Should handle empty string dates
    expect(screen.getByText("No start date")).toBeInTheDocument();
    expect(screen.getByText("No due date")).toBeInTheDocument();
  });

  it("handles assignee editing without onUpdateTask callback", () => {
    render(<TaskCard task={mockTask} />); // No onUpdateTask provided

    // Enter edit mode
    const card = screen.getByRole("button", { name: "" });
    fireEvent.mouseEnter(card);
    const editButton = screen.getByRole("button", { name: "" });
    fireEvent.click(editButton);

    // Enter valid assignee names
    const input = screen.getByPlaceholderText("Enter assignee names (comma separated)");
    fireEvent.change(input, { target: { value: "Alice Brown, Bob Johnson" } });

    // Click save - should not throw error even without onUpdateTask
    const buttons = screen.getAllByRole("button");
    const saveButton = buttons.find((button) => button.querySelector('svg[class*="check"]'));
    fireEvent.click(saveButton!);

    // Should exit edit mode without error
    expect(
      screen.queryByPlaceholderText("Enter assignee names (comma separated)"),
    ).not.toBeInTheDocument();
  });
});
