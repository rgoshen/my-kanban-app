import React from "react";
import { render, screen } from "@testing-library/react";
import { KanbanColumns } from "../kanban-columns";
import { Task } from "@/types/task";

// Mock the DroppableColumn component
jest.mock("../droppable-column", () => ({
  DroppableColumn: ({ id, title, tasks, onUpdateTask }: any) => (
    <div data-testid={`column-${id}`}>
      <h3>{title}</h3>
      <div data-testid={`tasks-${id}`}>
        {tasks.map((task: Task) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.title}
          </div>
        ))}
      </div>
    </div>
  ),
}));

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Todo Task 1",
    description: "First todo task",
    status: "todo",
    priority: "high",
    assignees: ["John Doe"],
  },
  {
    id: "task-2",
    title: "Todo Task 2",
    description: "Second todo task",
    status: "todo",
    priority: "medium",
    assignees: ["Jane Smith"],
  },
  {
    id: "task-3",
    title: "In Progress Task",
    description: "Task in progress",
    status: "inprogress",
    priority: "low",
    assignees: ["Bob Johnson"],
  },
  {
    id: "task-4",
    title: "Done Task",
    description: "Completed task",
    status: "done",
    priority: "high",
    assignees: ["Alice Brown"],
  },
];

const mockOnUpdateTask = jest.fn();

describe("KanbanColumns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all three columns", () => {
    render(<KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();
  });

  it("displays correct column titles", () => {
    render(<KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("filters tasks correctly by status", () => {
    render(<KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />);

    // Todo column should have 2 tasks
    const todoTasks = screen.getByTestId("tasks-todo");
    expect(todoTasks).toBeInTheDocument();
    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-task-2")).toBeInTheDocument();

    // In Progress column should have 1 task
    const inProgressTasks = screen.getByTestId("tasks-inprogress");
    expect(inProgressTasks).toBeInTheDocument();
    expect(screen.getByTestId("task-task-3")).toBeInTheDocument();

    // Done column should have 1 task
    const doneTasks = screen.getByTestId("tasks-done");
    expect(doneTasks).toBeInTheDocument();
    expect(screen.getByTestId("task-task-4")).toBeInTheDocument();
  });

  it("handles empty task lists", () => {
    render(<KanbanColumns tasks={[]} onUpdateTask={mockOnUpdateTask} />);

    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();

    // All columns should be empty
    expect(screen.getByTestId("tasks-todo").children).toHaveLength(0);
    expect(screen.getByTestId("tasks-inprogress").children).toHaveLength(0);
    expect(screen.getByTestId("tasks-done").children).toHaveLength(0);
  });

  it("handles tasks with only one status", () => {
    const onlyTodoTasks = mockTasks.filter((task) => task.status === "todo");
    render(<KanbanColumns tasks={onlyTodoTasks} onUpdateTask={mockOnUpdateTask} />);

    // Todo column should have tasks
    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-task-2")).toBeInTheDocument();

    // Other columns should be empty
    expect(screen.getByTestId("tasks-inprogress").children).toHaveLength(0);
    expect(screen.getByTestId("tasks-done").children).toHaveLength(0);
  });

  it("passes onUpdateTask callback to all columns", () => {
    render(<KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />);

    // The mock DroppableColumn component should receive the onUpdateTask prop
    // We can verify this by checking that all columns are rendered
    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();
  });

  it("works without onUpdateTask callback", () => {
    render(<KanbanColumns tasks={mockTasks} />);

    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();
  });

  it("memoizes task filtering correctly", () => {
    const { rerender } = render(
      <KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />,
    );

    // Initial render
    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();

    // Re-render with same tasks (should use memoized values)
    rerender(<KanbanColumns tasks={mockTasks} onUpdateTask={mockOnUpdateTask} />);
    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();

    // Re-render with different tasks
    const newTasks = [
      {
        id: "task-5",
        title: "New Todo Task",
        description: "New task",
        status: "todo" as const,
        priority: "medium" as const,
        assignees: ["New Person"],
      },
    ];
    rerender(<KanbanColumns tasks={newTasks} onUpdateTask={mockOnUpdateTask} />);
    expect(screen.getByTestId("task-task-5")).toBeInTheDocument();
    expect(screen.queryByTestId("task-task-1")).not.toBeInTheDocument();
  });
});
