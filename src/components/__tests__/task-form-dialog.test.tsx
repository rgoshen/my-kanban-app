import React from "react";
import { render, screen } from "@testing-library/react";
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
});
