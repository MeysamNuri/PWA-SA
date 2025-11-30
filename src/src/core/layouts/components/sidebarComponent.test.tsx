import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./sidebarComponent";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// -------------------- Mock: useThemeContext --------------------
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({ isDarkMode: false }),
}));

// -------------------- Mock: NumberConverter --------------------
vi.mock("@/core/helper/numberConverter", () => ({
  NumberConverter: {
    latinToArabic: vi.fn((x) => x),
  },
}));

// -------------------- Mock: useLayoutHooks --------------------
const mockHandleLogout = vi.fn();
const mockHandleClick = vi.fn();
const mockHandleClickMenu = vi.fn();
const mockHandleUserProfile = vi.fn();

let mockOpenMenu = "";
let mockMenuItems: any[] = [];
let mockUserProfile: any = null;

vi.mock("../hooks", () => ({
  default: () => ({
    openMenu: mockOpenMenu,
    menuItems: mockMenuItems,
    userProfileData: mockUserProfile,
    handleLogout: mockHandleLogout,
    handleClick: mockHandleClick,
    handleClickMenu: mockHandleClickMenu,
    handleUserProfile: mockHandleUserProfile,
  }),
}));

// -------------------- Helper render wrapper --------------------
const renderWithTheme = (ui: React.ReactElement, mode: "light" | "dark") => {
  return render(
    <ThemeProvider theme={createTheme({ palette: { mode } })}>
      {ui}
    </ThemeProvider>
  );
};

// -------------------- TESTS --------------------
describe("SidebarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUserProfile = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "09120000000",
    };

    mockMenuItems = [
      {
        Name: "Dashboard",
        Icon: <span data-testid="icon">📌</span>,
        SubMenuItems: [],
      },
      {
        Name: "Settings",
        Icon: <span data-testid="icon">⚙️</span>,
        SubMenuItems: [
          { Name: "Account", Navigation: "/account" },
          { Name: "Security", Navigation: "/security" },
        ],
      },
    ];
  });

  // -----------------------------------------------------------
  it("renders user profile correctly", () => {
    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("09120000000")).toBeInTheDocument();
  });

  // -----------------------------------------------------------
  it("renders menu items", () => {
    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  // -----------------------------------------------------------
it("applies correct background & boxShadow in light mode", () => {
  renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

  const drawerPaper = document.querySelector(".MuiDrawer-paper") as HTMLElement;
  const style = window.getComputedStyle(drawerPaper);

  expect(style.backgroundColor).toBe("rgb(245, 245, 245)"); // grey[100]
  expect(style.boxShadow).toContain("rgba(0,0,0,0.08)");
});


  // -----------------------------------------------------------
it("applies correct background & boxShadow in dark mode", () => {
  renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "dark");

  const drawerPaper = document.querySelector(".MuiDrawer-paper") as HTMLElement;
  const style = window.getComputedStyle(drawerPaper);

  expect(style.backgroundColor).toBe("rgb(33, 33, 33)"); // grey[900]
  expect(style.boxShadow).toContain("rgba(255,255,255,0.1)");
});


  // -----------------------------------------------------------
  it("renders arrow with rotate(0deg) when submenu is open", () => {
    mockOpenMenu = "Settings";

    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    const arrow = screen.getByTestId("ExpandMoreIcon");

    expect(arrow).toHaveStyle("transform: rotate(0deg)");
  });

  // -----------------------------------------------------------
  it("renders arrow with rotate(90deg) when submenu is closed", () => {
    mockOpenMenu = "";

    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    const arrow = screen.getByTestId("ExpandMoreIcon");

    expect(arrow).toHaveStyle("transform: rotate(90deg)");
  });

  // -----------------------------------------------------------
  it("renders submenu items when menu is open", () => {
    mockOpenMenu = "Settings";

    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  // -----------------------------------------------------------
  it("calls handleClickMenu when clicking a menu item", () => {
    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    fireEvent.click(screen.getByText("Settings"));

    expect(mockHandleClickMenu).toHaveBeenCalledWith(mockMenuItems[1]);
  });

  // -----------------------------------------------------------
  it("calls handleUserProfile when profile box is clicked", () => {
    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    fireEvent.click(screen.getByText("John Doe"));

    expect(mockHandleUserProfile).toHaveBeenCalled();
  });

  // -----------------------------------------------------------
  it("calls handleLogout when logout item is clicked", () => {
    renderWithTheme(<SidebarComponent open={true} onClose={() => {}} />, "light");

    fireEvent.click(screen.getByText("خروج"));

    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
