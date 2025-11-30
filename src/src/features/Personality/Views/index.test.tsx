import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalitySelectionView } from "./index";

// ------------------------
// MOCK MUI useTheme
// ------------------------
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<any>("@mui/material");
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        background: { default: "#fff" }
      }
    })
  };
});

// ------------------------
// MOCK theme context
// ------------------------
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({
    isDarkMode: false
  })
}));

// ------------------------
// MOCK components that are not relevant to logic
// ------------------------
vi.mock("@/core/components/ajaxLoadingComponent", () => ({
  default: () => <div data-testid="loading">Loading...</div>
}));

vi.mock("@/core/components/innerPagesHeader", () => ({
  default: () => <div>Inner Header</div>
}));

vi.mock("@/core/components/icons", () => ({
  Icon: () => <div data-testid="icon">ICON</div>
}));

vi.mock("../Components/PersonalityCard", () => ({
  default: ({ onChange }: any) => (
    <button data-testid="card" onClick={() => onChange("123")}>
      Personality Card
    </button>
  )
}));

// ------------------------
// DYNAMIC MOCK of PersonalityViewHooks
// ------------------------
const mockHook = vi.fn();

vi.mock("../Hooks/usePersonalityHooks", () => ({
  default: () => mockHook(),
}));

// ------------------------
// TEST SUITE
// ------------------------
describe("PersonalitySelectionView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockHook.mockReturnValue({
      userPersonality: null,
      options: [],
      isPending: true,
      isUserPersonalityPending: false,
      error: null,
      handlePersonalityChange: vi.fn(),
    });

    render(<PersonalitySelectionView />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockHook.mockReturnValue({
      userPersonality: null,
      options: [],
      isPending: false,
      isUserPersonalityPending: false,
      error: "ERR",
      handlePersonalityChange: vi.fn(),
    });

    render(<PersonalitySelectionView />);

    expect(
      screen.getByText(/خطا در بارگذاری شخصیت‌ها/i)
    ).toBeInTheDocument();
  });

  it("renders final UI with card and calls onChange", () => {
    const handleChange = vi.fn();

    mockHook.mockReturnValue({
      userPersonality: {
        id: "1",
        name: "Test Personality",
        picture: "test.png"
      },
      options: [{ id: "1", title: "Option 1" }],
      isPending: false,
      isUserPersonalityPending: false,
      error: null,
      handlePersonalityChange: handleChange,
    });

    render(<PersonalitySelectionView />);

    // Image should appear
    expect(screen.getByAltText("Test Personality")).toBeInTheDocument();

    // Card should appear
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();

    // Clicking should call hook handler
    fireEvent.click(card);

    expect(handleChange).toHaveBeenCalledWith("123");
  });
});
