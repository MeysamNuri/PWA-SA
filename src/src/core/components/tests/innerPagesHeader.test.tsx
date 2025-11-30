// InnerPageHeader.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InnerPageHeader from "../innerPagesHeader";
import { useInfoModalStore } from "../../zustandStore";
import useLayoutHooks from "../../layouts/hooks";

// Mock zustand store
vi.mock("../../zustandStore", () => {
  return {
    useInfoModalStore: vi.fn(),
  };
});

// Mock custom hook
vi.mock("../../layouts/hooks", () => {
  return {
    default: vi.fn(),
  };
});

// Mock InfoDialogs (to not render the actual dialog)
vi.mock("../infoDialog", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (
    <div data-testid="info-dialog">{open ? "open" : "closed"}</div>
  ),
}));

// Mock DocumentInfo icon
vi.mock("../../icones", () => ({
  DocumentInfo: () => <svg data-testid="document-info-icon" />,
}));

describe("InnerPageHeader", () => {
  it("renders title", () => {
    (useInfoModalStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(() => {});
    (useLayoutHooks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ handleClick: vi.fn() });

    render(<InnerPageHeader title="Test Title" path="/test" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("calls setInfoDetails when clicking info button", () => {
    const setInfoDetails = vi.fn();
    (useInfoModalStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(setInfoDetails);
    (useLayoutHooks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ handleClick: vi.fn() });

    const infoIcon = { path: "/info", title: "Info Title" };

    render(<InnerPageHeader title="Test Title" path="/test" infoIcon={infoIcon} />);

    fireEvent.click(screen.getByLabelText("info-button"));

    expect(setInfoDetails).toHaveBeenCalledWith(infoIcon);
    expect(screen.getByTestId("info-dialog")).toHaveTextContent("open");
  });

  it("calls handleClick when clicking back button", () => {
    (useInfoModalStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(() => {});
    const handleClick = vi.fn();
    (useLayoutHooks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ handleClick });

    render(<InnerPageHeader title="Test Title" path="/test-path" />);

    fireEvent.click(screen.getByLabelText("back-button"));

    expect(handleClick).toHaveBeenCalledWith("/test-path");
  });
});
