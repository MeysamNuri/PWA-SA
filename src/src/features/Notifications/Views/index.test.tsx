import { render, screen, fireEvent } from "@testing-library/react";
import NotificationsView from "./index";
import {vi} from "vitest";

// Mock the hook
const mockHandlePageChange = vi.fn();
const mockHandlePageSizeChange = vi.fn();
const mockHandleIsReadOnchange = vi.fn();

vi.mock("../Hooks/useNoticeHooks", () => ({
  default: () => ({
    isPending: false,
    notificationsData: { items: [], totalPages: 2 },
    pageModel: { pageNumber: 1, itemsPerPage: 5 },
    isRead: "all",
    handlePageChange: mockHandlePageChange,
    handlePageSizeChange: mockHandlePageSizeChange,
    handleIsReadOnchange: mockHandleIsReadOnchange,
  }),
}));

vi.mock("@/core/components/innerPagesHeader", () => ({
  default: ({ title }: any) => <div data-testid="inner-header">{title}</div>,
}));

vi.mock("../Components/cards", () => ({
  default: ({ notificationsData }: any) => (
    <div data-testid="notice-cards">{JSON.stringify(notificationsData)}</div>
  ),
}));

vi.mock("@/core/components/DateFilter", () => ({
  default: ({ options, onChange, value }: any) => (
    <select
      data-testid="date-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<any>("@mui/material");
  return {
    ...actual,
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    MenuItem: ({ value, children }: any) => <option value={value}>{children}</option>,
    Select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
    Pagination: ({ onChange, page }: any) => (
      <button onClick={() => onChange({}, page)} data-testid="pagination">
        Pagination
      </button>
    ),
  };
})

describe("NotificationsView", () => {
  it("renders correctly with initial state", () => {
    render(<NotificationsView />);

    expect(screen.getByTestId("inner-header")).toHaveTextContent("پیام ها");
    expect(screen.getByTestId("notice-cards")).toHaveTextContent(
      JSON.stringify({ items: [], totalPages: 2 })
    );

    const dateFilter = screen.getByTestId("date-filter") as HTMLSelectElement;
    expect(dateFilter.value).toBe("all");

    const select = screen.getByDisplayValue("5") as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const pagination = screen.getByTestId("pagination");
    expect(pagination).toBeInTheDocument();
  });

  it("calls handlers on user actions", () => {
    render(<NotificationsView />);

    // Change date filter
    const dateFilter = screen.getByTestId("date-filter") as HTMLSelectElement;
    fireEvent.change(dateFilter, { target: { value: "true" } });
    expect(mockHandleIsReadOnchange).toHaveBeenCalledWith("true");

    // Change page size
    const select = screen.getByDisplayValue("5") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "10" } });
    expect(mockHandlePageSizeChange).toHaveBeenCalled();

    // Click pagination
    const pagination = screen.getByTestId("pagination");
    fireEvent.click(pagination);
    expect(mockHandlePageChange).toHaveBeenCalled();
  });
});
