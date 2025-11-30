import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🧩 Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

// 🧩 Mock external components
vi.mock("@/core/components/innerPagesHeader", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));
vi.mock("../Components/userInfo", () => ({
  default: ({ userProfileData }: any) => (
    <div>
      User Info: <span>{userProfileData?.name}</span>
    </div>
  ),
}));
vi.mock("@/core/components/icons", () => ({
  Icon: ({ name }: { name: string }) => <div>Icon: {name}</div>,
}));

// 🧩 Mock theme context
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({
    isDarkMode: false,
    toggleTheme: vi.fn(),
  }),
}));

// 🧩 Mock custom hook — defined BEFORE importing the component
const mockHandlePassword = vi.fn();
const mockHandleHomepageCustomization = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock("../Hooks/userProfileHooks", () => ({
  default: () => ({
    handlePassword: mockHandlePassword,
    handleHomepageCustomization: mockHandleHomepageCustomization,
    toggleTheme: mockToggleTheme,
    serial: "12345",
    userProfileData: { name: "John Doe" },
    personalityLoading: false,
    userPersonality: { name: "Creative" },
  }),
}));

// ✅ Import component AFTER mocks
import UserProfileView from "./index";

// 🧩 Query Client
const queryClient = new QueryClient();

// 🧩 Helper render function
const theme = createTheme();
const renderComponent = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <UserProfileView />
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

describe("UserProfileView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header and user info", () => {
    renderComponent();
    // Use regex to allow spacing or nested elements
    expect(screen.getByText(/حساب کاربری/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it("renders user personality name", () => {
    renderComponent();
    expect(screen.getByText(/Creative/)).toBeInTheDocument();
  });

  it("calls handlePassword when 'تغییر کلمه عبور' is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/تغییر کلمه عبور/));
    expect(mockHandlePassword).toHaveBeenCalledTimes(1);
  });

  it("calls handleHomepageCustomization when 'سفارش سازی خانه' is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/سفارش سازی خانه/));
    expect(mockHandleHomepageCustomization).toHaveBeenCalledTimes(1);
  });

  it("navigates to personality page when 'انتخاب شخصیت' is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/انتخاب شخصیت/));
    expect(mockNavigate).toHaveBeenCalledWith("/personality");
  });
});
