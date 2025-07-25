import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskFormDialog } from "../task-form-dialog";

const mockOnSubmit = jest.fn();

describe("TaskFormDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog trigger button", () => {
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has plus icon", () => {
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("opens dialog when trigger button is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(
      screen.getByText("Add a new task to your kanban board. Fill in the details below."),
    ).toBeInTheDocument();
  });

  it("renders all form fields when dialog is open", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority *")).toBeInTheDocument();
    expect(screen.getByLabelText("Assignees *")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form fields
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe, Jane Smith");
    await user.type(screen.getByLabelText("Due Date"), "2024-12-31");

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        assignees: ["John Doe", "Jane Smith"],
        dueDate: "2024-12-31",
      });
    });
  });

  it("shows validation error for empty title", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Try to submit without title
    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for empty assignees", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in title but not assignees
    await user.type(screen.getByLabelText("Title *"), "Test Task");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    expect(screen.getByText("At least one assignee is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid assignee names", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form with invalid assignee names
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John@Doe, Jane#Smith");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    expect(screen.getByText("Invalid assignee names")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for past due date", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form with past date
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");
    await user.type(screen.getByLabelText("Due Date"), "2020-01-01");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    expect(screen.getByText("Due date cannot be in the past")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("allows submission without due date", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in required fields only
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "",
        priority: "medium",
        assignees: ["John Doe"],
        dueDate: "",
      });
    });
  });

  it("allows submission without description", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in required fields only
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "",
        priority: "medium",
        assignees: ["John Doe"],
        dueDate: "",
      });
    });
  });

  it("changes priority selection", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Open priority dropdown
    const prioritySelect = screen.getByLabelText("Priority *");
    await user.click(prioritySelect);

    // Select high priority
    const highOption = screen.getByText("High");
    await user.click(highOption);

    // Fill in other required fields
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "",
        priority: "high",
        assignees: ["John Doe"],
        dueDate: "",
      });
    });
  });

  it("closes dialog after successful submission", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
    });
  });

  it("resets form after submission", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    // Open dialog again
    await user.click(button);

    // Form should be reset
    expect(screen.getByLabelText("Title *")).toHaveValue("");
    expect(screen.getByLabelText("Assignees *")).toHaveValue("");
  });

  it("handles single assignee correctly", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form with single assignee
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "John Doe");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "",
        priority: "medium",
        assignees: ["John Doe"],
        dueDate: "",
      });
    });
  });

  it("handles multiple assignees with extra spaces", async () => {
    const user = userEvent.setup();
    render(<TaskFormDialog onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Fill in form with assignees that have extra spaces
    await user.type(screen.getByLabelText("Title *"), "Test Task");
    await user.type(screen.getByLabelText("Assignees *"), "  John Doe  ,  Jane Smith  ");

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "",
        priority: "medium",
        assignees: ["John Doe", "Jane Smith"],
        dueDate: "",
      });
    });
  });
});
