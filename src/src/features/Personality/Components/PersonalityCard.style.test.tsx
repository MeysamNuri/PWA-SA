import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  PickerHeaderCard,
  PickerHeaderContent,
  PickerDivider,
  PickerBodyCard,
  PickerBodyContent,
  OptionRow,
  OptionTitle,
  OptionSummary,
  OptionDesc,
} from "./PersonalityCard.style";

// Helper: render with MUI theme
const renderWithTheme = (ui: React.ReactElement, darkMode = false) => {
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("PersonalityCard Styled Components", () => {
  describe("PickerHeaderCard", () => {
    it("renders with proper styling", () => {
      const { container } = renderWithTheme(
        <PickerHeaderCard data-testid="header-card">
          Header Content
        </PickerHeaderCard>
      );

      const headerCard = container.firstChild as HTMLElement;
      expect(headerCard).toBeInTheDocument();
      expect(headerCard).toHaveTextContent("Header Content");
    });
  });

  describe("PickerHeaderContent", () => {
    it("renders header content with padding", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderContent data-testid="header-content">
          <h2>Title</h2>
        </PickerHeaderContent>
      );

      const headerContent = getByTestId("header-content");
      expect(headerContent).toBeInTheDocument();
      expect(headerContent).toHaveTextContent("Title");
    });
  });

  describe("PickerDivider", () => {
    it("renders as a divider line", () => {
      const { getByTestId } = renderWithTheme(
        <PickerDivider data-testid="divider" />
      );

      const divider = getByTestId("divider");
      expect(divider).toBeInTheDocument();
    });
  });

  describe("PickerBodyCard", () => {
    it("renders body card container", () => {
      const { getByTestId } = renderWithTheme(
        <PickerBodyCard data-testid="body-card">
          Body Content
        </PickerBodyCard>
      );

      const bodyCard = getByTestId("body-card");
      expect(bodyCard).toBeInTheDocument();
      expect(bodyCard).toHaveTextContent("Body Content");
    });
  });

  describe("PickerBodyContent", () => {
    it("renders body content area", () => {
      const { getByTestId } = renderWithTheme(
        <PickerBodyContent data-testid="body-content">
          Options go here
        </PickerBodyContent>
      );

      const bodyContent = getByTestId("body-content");
      expect(bodyContent).toBeInTheDocument();
      expect(bodyContent).toHaveTextContent("Options go here");
    });
  });

  describe("OptionRow", () => {
    it("renders option row with default state", () => {
      const { getByTestId } = renderWithTheme(
        <OptionRow
          data-testid="option-row"
          selected={false}
          danger={false}
          withDivider={false}
        >
          Option Content
        </OptionRow>
      );

      const optionRow = getByTestId("option-row");
      expect(optionRow).toBeInTheDocument();
      expect(optionRow).toHaveTextContent("Option Content");
    });

    it("renders option row when selected", () => {
      const { getByTestId } = renderWithTheme(
        <OptionRow
          data-testid="option-row-selected"
          selected={true}
          danger={false}
          withDivider={false}
        >
          Selected Option
        </OptionRow>
      );

      const optionRow = getByTestId("option-row-selected");
      expect(optionRow).toBeInTheDocument();
      expect(optionRow).toHaveTextContent("Selected Option");
    });

    it("renders option row with danger state", () => {
      const { getByTestId } = renderWithTheme(
        <OptionRow
          data-testid="option-row-danger"
          selected={false}
          danger={true}
          withDivider={false}
        >
          Danger Option
        </OptionRow>
      );

      const optionRow = getByTestId("option-row-danger");
      expect(optionRow).toBeInTheDocument();
      expect(optionRow).toHaveTextContent("Danger Option");
    });

    it("renders option row with divider", () => {
      const { getByTestId } = renderWithTheme(
        <OptionRow
          data-testid="option-row-divider"
          selected={false}
          danger={false}
          withDivider={true}
        >
          Option with Divider
        </OptionRow>
      );

      const optionRow = getByTestId("option-row-divider");
      expect(optionRow).toBeInTheDocument();
      expect(optionRow).toHaveTextContent("Option with Divider");
    });
  });

  describe("OptionTitle", () => {
    it("renders option title with default styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionTitle
          data-testid="option-title"
          selected={false}
          danger={false}
        >
          Option Title
        </OptionTitle>
      );

      const optionTitle = getByTestId("option-title");
      expect(optionTitle).toBeInTheDocument();
      expect(optionTitle).toHaveTextContent("Option Title");
    });

    it("renders option title when selected", () => {
      const { getByTestId } = renderWithTheme(
        <OptionTitle
          data-testid="option-title-selected"
          selected={true}
          danger={false}
        >
          Selected Title
        </OptionTitle>
      );

      const optionTitle = getByTestId("option-title-selected");
      expect(optionTitle).toBeInTheDocument();
      expect(optionTitle).toHaveTextContent("Selected Title");
    });

    it("renders option title with danger styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionTitle
          data-testid="option-title-danger"
          selected={false}
          danger={true}
        >
          Danger Title
        </OptionTitle>
      );

      const optionTitle = getByTestId("option-title-danger");
      expect(optionTitle).toBeInTheDocument();
      expect(optionTitle).toHaveTextContent("Danger Title");
    });
  });

  describe("OptionSummary", () => {
    it("renders option summary with default styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionSummary
          data-testid="option-summary"
          selected={false}
          danger={false}
        >
          (default)
        </OptionSummary>
      );

      const optionSummary = getByTestId("option-summary");
      expect(optionSummary).toBeInTheDocument();
      expect(optionSummary).toHaveTextContent("(default)");
    });

    it("renders option summary when selected", () => {
      const { getByTestId } = renderWithTheme(
        <OptionSummary
          data-testid="option-summary-selected"
          selected={true}
          danger={false}
        >
          (selected)
        </OptionSummary>
      );

      const optionSummary = getByTestId("option-summary-selected");
      expect(optionSummary).toBeInTheDocument();
      expect(optionSummary).toHaveTextContent("(selected)");
    });

    it("renders option summary with danger styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionSummary
          data-testid="option-summary-danger"
          selected={false}
          danger={true}
        >
          (danger)
        </OptionSummary>
      );

      const optionSummary = getByTestId("option-summary-danger");
      expect(optionSummary).toBeInTheDocument();
      expect(optionSummary).toHaveTextContent("(danger)");
    });
  });

  describe("OptionDesc", () => {
    it("renders option description with default styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionDesc
          data-testid="option-desc"
          selected={false}
          danger={false}
        >
          This is a description
        </OptionDesc>
      );

      const optionDesc = getByTestId("option-desc");
      expect(optionDesc).toBeInTheDocument();
      expect(optionDesc).toHaveTextContent("This is a description");
    });

    it("renders option description when selected", () => {
      const { getByTestId } = renderWithTheme(
        <OptionDesc
          data-testid="option-desc-selected"
          selected={true}
          danger={false}
        >
          Selected description
        </OptionDesc>
      );

      const optionDesc = getByTestId("option-desc-selected");
      expect(optionDesc).toBeInTheDocument();
      expect(optionDesc).toHaveTextContent("Selected description");
    });

    it("renders option description with danger styling", () => {
      const { getByTestId } = renderWithTheme(
        <OptionDesc
          data-testid="option-desc-danger"
          selected={false}
          danger={true}
        >
          Danger description
        </OptionDesc>
      );

      const optionDesc = getByTestId("option-desc-danger");
      expect(optionDesc).toBeInTheDocument();
      expect(optionDesc).toHaveTextContent("Danger description");
    });
  });

  describe("Theme Integration", () => {
    it("renders components in light theme", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="light-theme">
          <OptionTitle selected={false} danger={false}>Light Theme</OptionTitle>
        </PickerHeaderCard>,
        false
      );

      const component = getByTestId("light-theme");
      expect(component).toBeInTheDocument();
    });

    it("renders components in dark theme", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="dark-theme">
          <OptionTitle selected={false} danger={false}>Dark Theme</OptionTitle>
        </PickerHeaderCard>,
        true
      );

      const component = getByTestId("dark-theme");
      expect(component).toBeInTheDocument();
    });
  });

  describe("Combined Components", () => {
    it("renders a complete option structure", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="complete-option">
          <PickerHeaderContent>
            <h3>Personality Picker</h3>
          </PickerHeaderContent>
          <PickerDivider />
          <PickerBodyCard>
            <PickerBodyContent>
              <OptionRow selected={true} danger={false} withDivider={true}>
                <OptionTitle selected={true} danger={false}>
                  <span>Friendly</span>
                  <OptionSummary selected={true} danger={false}>
                    <span>(recommended)</span>
                  </OptionSummary>
                </OptionTitle>
                <OptionDesc selected={true} danger={false}>
                  <span>A warm and helpful personality</span>
                </OptionDesc>
              </OptionRow>
            </PickerBodyContent>
          </PickerBodyCard>
        </PickerHeaderCard>
      );

      const completeOption = getByTestId("complete-option");
      expect(completeOption).toBeInTheDocument();
      expect(completeOption).toHaveTextContent("Personality Picker");
      expect(completeOption).toHaveTextContent("Friendly");
      expect(completeOption).toHaveTextContent("(recommended)");
      expect(completeOption).toHaveTextContent("A warm and helpful personality");
    });

    it("renders multiple options with different states", () => {
      const { getByTestId } = renderWithTheme(
        <PickerBodyCard data-testid="multiple-options">
          <PickerBodyContent>
            <OptionRow selected={false} danger={false} withDivider={true}>
              <OptionTitle selected={false} danger={false}>
                Calm
                <OptionSummary selected={false} danger={false}>
                  (default)
                </OptionSummary>
              </OptionTitle>
              <OptionDesc selected={false} danger={false}>
                Low key and measured
              </OptionDesc>
            </OptionRow>
            <OptionRow selected={true} danger={true} withDivider={true}>
              <OptionTitle selected={true} danger={true}>
                Bold
                <OptionSummary selected={true} danger={true}>
                  (risky)
                </OptionSummary>
              </OptionTitle>
              <OptionDesc selected={true} danger={true}>
                Direct and assertive
              </OptionDesc>
            </OptionRow>
            <OptionRow selected={false} danger={false} withDivider={false}>
              <OptionTitle selected={false} danger={false}>
                Neutral
              </OptionTitle>
              <OptionDesc selected={false} danger={false}>
                Balanced approach
              </OptionDesc>
            </OptionRow>
          </PickerBodyContent>
        </PickerBodyCard>
      );

      const multipleOptions = getByTestId("multiple-options");
      expect(multipleOptions).toBeInTheDocument();
      expect(multipleOptions).toHaveTextContent("Calm");
      expect(multipleOptions).toHaveTextContent("Bold");
      expect(multipleOptions).toHaveTextContent("Neutral");
      expect(multipleOptions).toHaveTextContent("(default)");
      expect(multipleOptions).toHaveTextContent("(risky)");
    });
  });

  describe("Edge Cases and Props", () => {
    it("handles all OptionRow prop combinations", () => {
      const combinations = [
        { selected: false, danger: false, withDivider: false },
        { selected: false, danger: false, withDivider: true },
        { selected: false, danger: true, withDivider: false },
        { selected: false, danger: true, withDivider: true },
        { selected: true, danger: false, withDivider: false },
        { selected: true, danger: false, withDivider: true },
        { selected: true, danger: true, withDivider: false },
        { selected: true, danger: true, withDivider: true },
      ];

      combinations.forEach((combo, index) => {
        const { getByTestId } = renderWithTheme(
          <OptionRow
            data-testid={`combo-${index}`}
            selected={combo.selected}
            danger={combo.danger}
            withDivider={combo.withDivider}
          >
            Option {index}
          </OptionRow>
        );

        const optionRow = getByTestId(`combo-${index}`);
        expect(optionRow).toBeInTheDocument();
        expect(optionRow).toHaveTextContent(`Option ${index}`);
      });
    });

    it("handles all OptionTitle prop combinations", () => {
      const combinations = [
        { selected: false, danger: false },
        { selected: false, danger: true },
        { selected: true, danger: false },
        { selected: true, danger: true },
      ];

      combinations.forEach((combo, index) => {
        const { getByTestId } = renderWithTheme(
          <OptionTitle
            data-testid={`title-combo-${index}`}
            selected={combo.selected}
            danger={combo.danger}
          >
            Title {index}
          </OptionTitle>
        );

        const optionTitle = getByTestId(`title-combo-${index}`);
        expect(optionTitle).toBeInTheDocument();
        expect(optionTitle).toHaveTextContent(`Title ${index}`);
      });
    });

    it("handles all OptionSummary prop combinations", () => {
      const combinations = [
        { selected: false, danger: false },
        { selected: false, danger: true },
        { selected: true, danger: false },
        { selected: true, danger: true },
      ];

      combinations.forEach((combo, index) => {
        const { getByTestId } = renderWithTheme(
          <OptionSummary
            data-testid={`summary-combo-${index}`}
            selected={combo.selected}
            danger={combo.danger}
          >
            (summary {index})
          </OptionSummary>
        );

        const optionSummary = getByTestId(`summary-combo-${index}`);
        expect(optionSummary).toBeInTheDocument();
        expect(optionSummary).toHaveTextContent(`(summary ${index})`);
      });
    });

    it("handles all OptionDesc prop combinations", () => {
      const combinations = [
        { selected: false, danger: false },
        { selected: false, danger: true },
        { selected: true, danger: false },
        { selected: true, danger: true },
      ];

      combinations.forEach((combo, index) => {
        const { getByTestId } = renderWithTheme(
          <OptionDesc
            data-testid={`desc-combo-${index}`}
            selected={combo.selected}
            danger={combo.danger}
          >
            Description {index}
          </OptionDesc>
        );

        const optionDesc = getByTestId(`desc-combo-${index}`);
        expect(optionDesc).toBeInTheDocument();
        expect(optionDesc).toHaveTextContent(`Description ${index}`);
      });
    });

    it("renders empty content correctly", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="empty-content">
          <PickerHeaderContent></PickerHeaderContent>
          <PickerDivider />
          <PickerBodyCard>
            <PickerBodyContent></PickerBodyContent>
          </PickerBodyCard>
        </PickerHeaderCard>
      );

      const emptyContent = getByTestId("empty-content");
      expect(emptyContent).toBeInTheDocument();
    });

    it("renders with nested content", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="nested-content">
          <PickerHeaderContent>
            <div>
              <span>Nested</span>
              <strong>Content</strong>
            </div>
          </PickerHeaderContent>
          <PickerDivider />
          <PickerBodyCard>
            <PickerBodyContent>
              <div>
                <OptionRow selected={false} danger={false} withDivider={false}>
                  <div>
                    <OptionTitle selected={false} danger={false}>
                      <span>Nested Title</span>
                    </OptionTitle>
                    <OptionDesc selected={false} danger={false}>
                      <em>Nested Description</em>
                    </OptionDesc>
                  </div>
                </OptionRow>
              </div>
            </PickerBodyContent>
          </PickerBodyCard>
        </PickerHeaderCard>
      );

      const nestedContent = getByTestId("nested-content");
      expect(nestedContent).toBeInTheDocument();
      expect(nestedContent).toHaveTextContent("Nested");
      expect(nestedContent).toHaveTextContent("Content");
      expect(nestedContent).toHaveTextContent("Nested Title");
      expect(nestedContent).toHaveTextContent("Nested Description");
    });
  });

  describe("Responsive and Accessibility", () => {
    it("renders components with proper structure for screen readers", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard data-testid="accessible-structure" role="group">
          <PickerHeaderContent>
            <h3 id="picker-title">Choose Personality</h3>
          </PickerHeaderContent>
          <PickerDivider role="separator" />
          <PickerBodyCard>
            <PickerBodyContent role="radiogroup" aria-labelledby="picker-title">
              <OptionRow selected={false} danger={false} withDivider={false} role="radio" tabIndex={0}>
                <OptionTitle selected={false} danger={false}>
                  Option 1
                </OptionTitle>
                <OptionDesc selected={false} danger={false}>
                  First option description
                </OptionDesc>
              </OptionRow>
            </PickerBodyContent>
          </PickerBodyCard>
        </PickerHeaderCard>
      );

      const accessibleStructure = getByTestId("accessible-structure");
      expect(accessibleStructure).toBeInTheDocument();
      expect(accessibleStructure).toHaveAttribute("role", "group");
    });

    it("handles custom props and attributes", () => {
      const { getByTestId } = renderWithTheme(
        <PickerHeaderCard
          data-testid="custom-props"
          className="custom-class"
          id="custom-id"
          style={{ margin: "10px" }}
        >
          <OptionRow
            selected={false}
            danger={false}
            withDivider={false}
            className="option-class"
            data-value="test"
          >
            Custom Props Test
          </OptionRow>
        </PickerHeaderCard>
      );

      const customProps = getByTestId("custom-props");
      expect(customProps).toBeInTheDocument();
      expect(customProps).toHaveAttribute("id", "custom-id");
      expect(customProps).toHaveTextContent("Custom Props Test");
    });
  });
});
