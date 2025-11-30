import { render, screen, fireEvent } from "@testing-library/react";
import NoticeCards from "./cards";
import { useTheme } from "@mui/material/styles";
import usneHandleNoticeByIdHook from "../Hooks/useHandleNoticeByIdHook";

import { vi } from "vitest";

// --- MOCKS ---

// Mock MUI useTheme
vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual("@mui/material/styles");
  return {
    ...actual,
    useTheme: vi.fn(),
  };
});

// Mock custom hook
vi.mock("../Hooks/useHandleNoticeByIdHook", () => ({
  default: vi.fn(),
}));

// Mock moment-jalaali
vi.mock("moment-jalaali", () => ({
  default: () => ({
    format: () => "1402/08/03", // mocked Jalali date
  }),
}));

// Mock NumberConverter
vi.mock("@/core/helper/numberConverter", () => ({
  NumberConverter: {
    latinToArabic: (input: string) => input,
  },
}));

describe("NoticeCards", () => {
  const mockPalette = { primary: { main: "#000", light: "#666" } };
  const mockHandleUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({ palette: mockPalette });
    (usneHandleNoticeByIdHook as any).mockReturnValue({ handleUpdateNoticeById: mockHandleUpdate });
  });

it("renders message when no notifications are present", () => {
  const emptyNotifications = {
    items: [],
    skip: 0,
    take: 10,
    totalCount: 0,
    totalPages: 0,
  };

  render(<NoticeCards notificationsData={emptyNotifications} />);
  expect(screen.getByText("هیچ پیامی موجود نیست")).toBeInTheDocument();
});

  it("renders notifications correctly and displays date/time", () => {
    const notificationsData = {
      items: [
        {
          id: "1",
          isRead: false,
          title: "Test title",
          body: "Test body",
          created: "2025-11-25T12:34:56",
          description: "desc",
          link: "",
          backgroundColor: "#fff",
          viewDate: "",
          url: "",
        },
      ],
      skip: 0,
      take: 10,
      totalCount: 1,
      totalPages: 1,
    };

    render(<NoticeCards notificationsData={notificationsData} />);

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test body")).toBeInTheDocument();
    expect(screen.getByText("1402/08/03")).toBeInTheDocument(); // mocked moment format
    expect(screen.getByText("12:34")).toBeInTheDocument(); // time part
  });

  it("calls handleUpdateNoticeById when card is clicked", () => {
    const notificationsData = {
      items: [
        {
          id: "1",
          isRead: false,
          title: "Test title",
          body: "Test body",
          created: "2025-11-25T12:34:56",
          description: "desc",
          link: "",
          backgroundColor: "#fff",
          viewDate: "",
          url: "",
        },
      ],
      skip: 0,
      take: 10,
      totalCount: 1,
      totalPages: 1,
    };

    render(<NoticeCards notificationsData={notificationsData} />);

    const card = screen.getByText("Test title").closest("div[role='button'],div"); // get the clickable card div
    fireEvent.click(card!);
    expect(mockHandleUpdate).toHaveBeenCalledWith(notificationsData.items[0]);
  });
});
