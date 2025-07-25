import React from "react";
import { render, screen } from "@testing-library/react";
import { KanbanColumn } from "../kanban-column";
import { Task } from "@/types/task";

// Mock the TaskCard component
jest.mock("../task-card", () => ({
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

describe("KanbanColumn", () => {
  it("renders column with title", () => {
    render(<KanbanColumn title="To Do" tasks={mockTasks} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders all tasks in the column", () => {
    render(<KanbanColumn title="To Do" tasks={mockTasks} />);

    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("shows empty column when no tasks", () => {
    render(<KanbanColumn title="To Do" tasks={[]} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    // Should not render any task cards
    expect(screen.queryByTestId("task-card-task-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-card-task-2")).not.toBeInTheDocument();
  });

  it("handles single task correctly", () => {
    const singleTask = [mockTasks[0]];
    render(<KanbanColumn title="To Do" tasks={singleTask} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.queryByTestId("task-card-task-2")).not.toBeInTheDocument();
  });

  it("handles tasks with undefined assignees", () => {
    const taskWithoutAssignees = {
      ...mockTasks[0],
      assignees: undefined,
    };
    render(<KanbanColumn title="To Do" tasks={[taskWithoutAssignees]} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
  });

  it("handles tasks with null assignees", () => {
    const taskWithNullAssignees = {
      ...mockTasks[0],
      assignees: null as any,
    };
    render(<KanbanColumn title="To Do" tasks={[taskWithNullAssignees]} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
  });

  it("handles tasks without dates", () => {
    const taskWithoutDates = {
      ...mockTasks[0],
      startDate: undefined,
      dueDate: undefined,
    };
    render(<KanbanColumn title="To Do" tasks={[taskWithoutDates]} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
  });

  it("handles tasks with empty assignees array", () => {
    const taskWithEmptyAssignees = {
      ...mockTasks[0],
      assignees: [],
    };
    render(<KanbanColumn title="To Do" tasks={[taskWithEmptyAssignees]} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
  });

  it("handles tasks with different statuses", () => {
    const tasksWithDifferentStatuses = [
      { ...mockTasks[0], status: "todo" as const },
      { ...mockTasks[1], status: "inprogress" as const },
    ];
    render(<KanbanColumn title="Mixed Status" tasks={tasksWithDifferentStatuses} />);

    expect(screen.getByText("Mixed Status")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
  });

  it("handles tasks with different priorities", () => {
    const tasksWithDifferentPriorities = [
      { ...mockTasks[0], priority: "low" as const },
      { ...mockTasks[1], priority: "high" as const },
    ];
    render(<KanbanColumn title="Mixed Priority" tasks={tasksWithDifferentPriorities} />);

    expect(screen.getByText("Mixed Priority")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-card-task-2")).toBeInTheDocument();
  });

  it("renders with different title variations", () => {
    const titles = ["To Do", "In Progress", "Done", "Custom Column", ""];

    titles.forEach((title) => {
      const { unmount } = render(<KanbanColumn title={title} tasks={mockTasks} />);
      expect(screen.getByText(title)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders individual titles correctly", () => {
    const { unmount } = render(<KanbanColumn title="Test Column" tasks={mockTasks} />);
    expect(screen.getByText("Test Column")).toBeInTheDocument();
    unmount();
  });
});
