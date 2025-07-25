import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "../theme-provider";

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div data-testid="next-themes-provider" {...props}>
      {children}
    </div>
  ),
}));

describe("ThemeProvider", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>,
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    const testProps = {
      attribute: "data-theme" as const,
      defaultTheme: "system" as const,
      enableSystem: true,
    };

    const { getByTestId } = render(
      <ThemeProvider {...testProps}>
        <div>Test Content</div>
      </ThemeProvider>,
    );

    const provider = getByTestId("next-themes-provider");
    expect(provider).toHaveAttribute("attribute", "data-theme");
    expect(provider).toHaveAttribute("defaultTheme", "system");
    expect(provider).toHaveAttribute("enableSystem", "true");
  });

  it("renders multiple children", () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </ThemeProvider>,
    );

    expect(getByText("First Child")).toBeInTheDocument();
    expect(getByText("Second Child")).toBeInTheDocument();
    expect(getByText("Third Child")).toBeInTheDocument();
  });

  it("handles empty children", () => {
    const { container } = render(<ThemeProvider />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles null children", () => {
    const { container } = render(<ThemeProvider>{null}</ThemeProvider>);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles undefined children", () => {
    const { container } = render(<ThemeProvider>{undefined}</ThemeProvider>);

    expect(container.firstChild).toBeInTheDocument();
  });
});
