/** @vitest-environment jsdom */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { fireEvent } from "@testing-library/dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PersonalityPickerCard, {
  type PersonalityOption,
} from "./PersonalityCard";

// -- MOCK styled components so tests don't depend on styles implementation.
// -- Keep roles/ARIA passed through from the real component.
vi.mock("./PersonalityCard.style", () => {
  const PickerHeaderContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="picker-header">{children}</div>
  );
  const PickerDivider = () => <hr data-testid="picker-divider" />;
  const OptionRow = ({
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selected,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    danger,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    withDivider,
    ...rest
  }: React.PropsWithChildren<{
    selected?: boolean;
    danger?: boolean;
    withDivider?: boolean;
  }> &
    React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  );
  const OptionTitle = ({
    children,
  }: React.PropsWithChildren<{
    selected?: boolean;
    danger?: boolean;
  }>) => <div>{children}</div>;
  const OptionDesc = ({
    children,
  }: React.PropsWithChildren<{
    selected?: boolean;
    danger?: boolean;
  }>) => <div>{children}</div>;

  return {
    PickerHeaderContent,
    PickerDivider,
    OptionRow,
    OptionTitle,
    OptionDesc,
  };
});

// -- Helper: render with MUI theme (component uses useTheme)
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

const options: PersonalityOption[] = [
  {
    id: "calm",
    name: "Calm",
    summery: "default",
    description: "Low key and measured",
  },
  {
    id: "bold",
    name: "Bold",
    tone: "danger",
    summery: "risky",
    description: "Direct and assertive",
  },
  { id: "neutral", name: "Neutral" },
];

describe("PersonalityPickerCard", () => {
  it("renders title, radiogroup, options, and optional icon", () => {
    // -- Arrange
    const onChange = vi.fn();
    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        iconSrc="/icon.svg"
        options={options}
        value={"bold"}
        onChange={onChange}
      />
    );

    // -- Assert basic structure
    expect(
      screen.getByRole("radiogroup", { name: "Personality" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);

    // -- Icon is rendered when provided
    const img = screen.getByRole("img", { name: "Personality" });
    expect(img).toHaveAttribute("src", "/icon.svg");

    // -- Selected state reflected via aria-checked
    const radios = screen.getAllByRole("radio");
    const selected = radios.find((el: Element) => el.getAttribute("aria-checked") === "true");
    expect(selected).toBeTruthy();
    expect(selected).toHaveTextContent(/Bold/);
  });

  it("calls onChange when clicking an option", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={"bold"}
        onChange={onChange}
      />
    );

    // -- Click on 'Calm' should trigger onChange with its id
    const calmRadio = screen.getByRole("radio", { name: /Calm/ });
    fireEvent.click(calmRadio);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("calm");
  });

  it("supports keyboard selection with Enter and Space", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    const neutralRadio = screen.getByRole("radio", { name: /Neutral/ });

    // -- Enter key
    neutralRadio.focus();
    fireEvent.keyDown(neutralRadio, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("neutral");

    // -- Space key
    fireEvent.keyDown(neutralRadio, { key: " " });
    expect(onChange).toHaveBeenCalledWith("neutral"); 
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("shows summary (in parentheses) and description when provided", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={"calm"}
        onChange={onChange}
      />
    );

    // -- Summary text appears as '(default)' and '(risky)'
    expect(screen.getByText("(default)")).toBeInTheDocument();
    expect(screen.getByText("(risky)")).toBeInTheDocument();

    // -- Descriptions are rendered
    expect(screen.getByText("Low key and measured")).toBeInTheDocument();
    expect(screen.getByText("Direct and assertive")).toBeInTheDocument();
  });

  it("does not render an icon when iconSrc is not provided", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    // -- No image element should be present
    expect(screen.queryByRole("img", { name: "Personality" })).toBeNull();
  });

  it("handles empty options array", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={[]}
        value={null}
        onChange={onChange}
      />
    );

    // -- Should still render title and radiogroup
    expect(screen.getByRole("radiogroup", { name: "Personality" })).toBeInTheDocument();
    // -- But no radio options
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("handles options without summary or description", () => {
    const onChange = vi.fn();
    const simpleOptions: PersonalityOption[] = [
      { id: "simple", name: "Simple Option" }
    ];

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={simpleOptions}
        value={null}
        onChange={onChange}
      />
    );

    // -- Should render the option name
    expect(screen.getByText("Simple Option")).toBeInTheDocument();
    // -- But no summary or description
    expect(screen.queryByText(/\(.*\)/)).toBeNull();
  });

  it("prevents default behavior for Enter and Space keys", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    const neutralRadio = screen.getByRole("radio", { name: /Neutral/ });
    
    // -- Enter key should prevent default
    fireEvent.keyDown(neutralRadio, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("neutral");
    
    // -- Space key should prevent default
    fireEvent.keyDown(neutralRadio, { key: " " });
    expect(onChange).toHaveBeenCalledWith("neutral");
  });

  it("handles selection state changes correctly", () => {
    const onChange = vi.fn();

    const { rerender } = renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    // -- Initially no option is selected
    const radios = screen.getAllByRole("radio");
    radios.forEach((radio: Element) => {
      expect(radio).toHaveAttribute("aria-checked", "false");
    });

    // -- Rerender with selected value
    rerender(
      <ThemeProvider theme={createTheme()}>
        <PersonalityPickerCard
          title="Personality"
          options={options}
          value="calm"
          onChange={onChange}
        />
      </ThemeProvider>
    );

    // -- Now 'calm' should be selected
    const calmRadio = screen.getByRole("radio", { name: /Calm/ });
    expect(calmRadio).toHaveAttribute("aria-checked", "true");
    
    // -- Other options should not be selected
    const boldRadio = screen.getByRole("radio", { name: /Bold/ });
    const neutralRadio = screen.getByRole("radio", { name: /Neutral/ });
    expect(boldRadio).toHaveAttribute("aria-checked", "false");
    expect(neutralRadio).toHaveAttribute("aria-checked", "false");
  });

  it("allows multiple clicks on the same option", () => {
    const onChange = vi.fn();

    renderWithTheme(
      <PersonalityPickerCard
        title="Personality"
        options={options}
        value="calm"
        onChange={onChange}
      />
    );

    const calmRadio = screen.getByRole("radio", { name: /Calm/ });
    
    // -- Click the same option multiple times
    fireEvent.click(calmRadio);
    fireEvent.click(calmRadio);
    fireEvent.click(calmRadio);
    
    // -- onChange should be called each time (new behavior)
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith("calm");
  });
});