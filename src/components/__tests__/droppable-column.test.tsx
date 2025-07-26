import React from "react";
import { render, screen } from "@testing-library/react";
import { DroppableColumn } from "../kanban/droppable-column";
import { Task } from "@/types/task";

// Mock the useDroppable hook
jest.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  }),
}));

// Mock the useIsClient hook
jest.mock("@/hooks/use-is-client", () => ({
  useIsClient: () => true,
}));

// Mock the TaskCard component
jest.mock("../kanban/task-card", () => ({
  TaskCard: ({ task }: { task: Task }) => (
    <div data-testid={`task-card-${task.id}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  ),
}));

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Test Task 1",
    description: "First test task",
    status: "todo",
    priority: "high",
    assignees: ["John Doe"],
    startDate: "2024-01-15",
    dueDate: "2024-01-20",
  },
  {
    id: "task-2",
    title: "Test Task 2",
    description: "Second test task",
    status: "todo",
    priority: "medium",
    assignees: ["Jane Smith"],
    startDate: "2024-01-16",
    dueDate: "2024-01-25",
  },
];

const mockOnUpdateTask = jest.fn();

describe("DroppableColumn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders column with title and task count", () => {
    render(
      <DroppableColumn id="todo" title="To Do" tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Task count
  });

  it("renders all tasks in the column", () => {
    render(
      <DroppableColumn id="todo" title="To Do" tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("shows empty state when no tasks", () => {
    render(<DroppableColumn id="todo" title="To Do" tasks={[]} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument(); // Task count
  });

  it("applies correct badge colors for different statuses", () => {
    const { rerender } = render(
      <DroppableColumn id="todo" title="To Do" tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );

    // Todo status - should have gray badge
    const todoBadge = screen.getByText("2");
    expect(todoBadge).toHaveClass("bg-gray-200", "text-gray-700");

    // In-progress status
    rerender(
      <DroppableColumn
        id="in-progress"
        title="In Progress"
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
      />,
    );
    const inProgressBadge = screen.getByText("2");
    expect(inProgressBadge).toHaveClass("bg-blue-200", "text-blue-700");

    // Done status
    rerender(
      <DroppableColumn id="done" title="Done" tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );
    const doneBadge = screen.getByText("2");
    expect(doneBadge).toHaveClass("bg-green-200", "text-green-700");
  });

  it("applies default badge color for unknown status", () => {
    render(
      <DroppableColumn
        id="unknown"
        title="Unknown"
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
      />,
    );

    const badge = screen.getByText("2");
    expect(badge).toHaveClass("bg-gray-200", "text-gray-700");
  });

  it("passes onUpdateTask callback to TaskCard components", () => {
    render(
      <DroppableColumn id="todo" title="To Do" tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );

    // Verify that TaskCard components are rendered (they receive the onUpdateTask prop)
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
  });

  it("works without onUpdateTask callback", () => {
    render(<DroppableColumn id="todo" title="To Do" tasks={mockTasks} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        className="custom-class"
      />,
    );

    // The className is applied to the main container div, not the title's parent
    const column = screen.getByText("To Do").closest("div")?.parentElement;
    expect(column).toHaveClass("custom-class");
  });

  it("handles single task correctly", () => {
    const singleTask = [mockTasks[0]];
    render(
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={singleTask}
        onUpdateTask={mockOnUpdateTask}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument(); // Task count
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.queryByTestId("task-card-task-2")).not.toBeInTheDocument();
  });

  it("handles tasks with undefined assignees", () => {
    const taskWithoutAssignees = {
      ...mockTasks[0],
      assignees: undefined,
    };
    render(
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={[taskWithoutAssignees]}
        onUpdateTask={mockOnUpdateTask}
      />,
    );

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Task count
  });

  it("handles tasks with null assignees", () => {
    const taskWithNullAssignees = {
      ...mockTasks[0],
      assignees: null as any,
    };
    render(
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={[taskWithNullAssignees]}
        onUpdateTask={mockOnUpdateTask}
      />,
    );

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Task count
  });

  it("handles tasks without dates", () => {
    const taskWithoutDates = {
      ...mockTasks[0],
      startDate: undefined,
      dueDate: undefined,
    };
    render(
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={[taskWithoutDates]}
        onUpdateTask={mockOnUpdateTask}
      />,
    );

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // Task count
  });
});
