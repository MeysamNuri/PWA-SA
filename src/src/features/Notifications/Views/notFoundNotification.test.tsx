// NotFoundNotice.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFoundNotice from "./notFoundNotification";
import { MemoryRouter } from "react-router";

// 🧩 Mock dependencies
vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({
    palette: {
      background: { default: "#fff", paper: "#f9f9f9" },
      primary: { light: "#1976d2" },
    },
  }),
}));

vi.mock("moment-jalaali", () => ({
  default: () => ({
    format: vi.fn(() => "1403/08/01"),
  }),
}));

vi.mock("@/core/helper/translationUtility", () => ({
  toPersianNumber: (val: string) => `persian(${val})`,
}));

vi.mock("@/core/helper/numberConverter", () => ({
  NumberConverter: {
    latinToArabic: (val: string) => `arabic(${val})`,
  },
}));

vi.mock("../Hooks/useNoticeHooks", () => ({
  default: () => ({
    formattedTime24HourNoSeconds: "12:45",
  }),
}));

vi.mock("@/core/components/innerPagesHeader", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("NotFoundNotice component", () => {
  it("renders correctly with mocked data", () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/notifications/notFoundNotice", state: { notification: { created: "2025-10-25T12:00:00" } } },
        ]}
      >
        <NotFoundNotice />
      </MemoryRouter>
    );

    // ✅ Check header
    expect(screen.getByTestId("header")).toHaveTextContent("پیام ها");

    // ✅ Check that the Persian time text is rendered
    expect(screen.getByText(/persian\(12:45\)/i)).toBeInTheDocument();

    // ✅ Check that the Arabic formatted date appears
    expect(screen.getByText(/arabic\(1403\/08\/01\)/i)).toBeInTheDocument();

    // ✅ Check that the title "گزارشات پرکاربرد" is visible
    expect(screen.getByText("گزارشات پرکاربرد")).toBeInTheDocument();
  });
});
