// ChatBotContainer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import ChatBotContainer from "./containerChatBot";

// Mock zustand store
vi.mock("@/core/zustandStore", () => ({
  useUserSerialStore: (selector: any) =>
    selector({ userSerial: "mock-serial" }),
}));

// Mock AjaxLoadingComponent
vi.mock("@/core/components/ajaxLoadingComponent", () => ({
  default: () => <div data-testid="ajax-loading">Loading...</div>,
}));

describe("ChatBotContainer", () => {
  beforeEach(() => {
    // Reset WebChat mock before each test
    (window as any).WebChat = {
      selfMount: vi.fn(),
    };
  });

  it("renders container and AjaxLoadingComponent", () => {
    render(<ChatBotContainer />);
  
    // Ensure container div is rendered by ID
    const container = document.getElementById("contanerForChatBot");
    expect(container).toBeInTheDocument();
  
    // AjaxLoadingComponent is shown
    expect(screen.getByTestId("ajax-loading")).toBeInTheDocument();
  });
  

  it("calls window.WebChat.selfMount after script loads", () => {
    render(<ChatBotContainer />);

    // Simulate script load event
    const script = document.querySelector("script[src*='app.bundle.js']");
    expect(script).toBeTruthy();
    script?.dispatchEvent(new Event("load"));

    expect(window.WebChat?.selfMount).toHaveBeenCalledWith(
      expect.objectContaining({
        faq: true,
        serial: "mock-serial",
      }),
      "#contanerForChatBot"
    );
  });
});
