import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskFormDialog } from "../task-form-dialog";
import { Task } from "@/types/task";

// Mock the useIsClient hook
jest.mock("@/hooks/use-is-client", () => ({
  useIsClient: () => true,
}));

const mockOnSubmit = jest.fn();

describe("TaskFormDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog trigger button", () => {
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("");
  });

  it("populates form with task data", () => {
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-20")).toBeInTheDocument();
  });

  it("handles empty task data", () => {
    const emptyTask: Task = {
      id: "new-task",
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignees: [],
    };

    render(
      <TaskFormDialog open={true} task={emptyTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    // Clear required title field
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);

    // Try to save
    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("saves task with valid data", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    // Update task data
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task Title");

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    // Save
    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockTask,
      title: "Updated Task Title",
      description: "Updated description",
    });
  });

  it("cancels form submission", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("handles priority selection", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.selectOptions(prioritySelect, "high");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockTask,
      priority: "high",
    });
  });

  it("handles assignee input validation", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    const assigneesInput = screen.getByLabelText(/assignees/i);
    await user.clear(assigneesInput);
    await user.type(assigneesInput, "John123, Jane@Smith");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(
      screen.getByText(/Assignee names can only contain letters, spaces, hyphens, and apostrophes/),
    ).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("handles valid assignee input", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    const assigneesInput = screen.getByLabelText(/assignees/i);
    await user.clear(assigneesInput);
    await user.type(assigneesInput, "Alice Johnson, Bob Smith");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockTask,
      assignees: ["Alice Johnson", "Bob Smith"],
    });
  });

  it("handles date inputs", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    const startDateInput = screen.getByLabelText(/start date/i);
    const dueDateInput = screen.getByLabelText(/due date/i);

    await user.clear(startDateInput);
    await user.type(startDateInput, "2024-02-01");
    await user.clear(dueDateInput);
    await user.type(dueDateInput, "2024-02-15");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockTask,
      startDate: "2024-02-01",
      dueDate: "2024-02-15",
    });
  });

  it("clears validation errors when user types", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    // Trigger validation error
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();

    // Type valid input
    await user.type(titleInput, "New Title");

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  it("handles keyboard shortcuts", async () => {
    const user = userEvent.setup();
    render(
      <TaskFormDialog open={true} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    // Test Escape key
    await user.keyboard("{Escape}");
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(
      <TaskFormDialog open={false} task={mockTask} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );

    expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
  });
});
