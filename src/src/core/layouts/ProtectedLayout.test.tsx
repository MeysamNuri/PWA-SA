import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// --- MOCKS FIRST ---
vi.mock("../helper/authentication", () => ({
  isAuthenticated: vi.fn(),
}));

vi.mock("./components/Header", () => ({
  default: () => <div data-testid="home-header">HEADER</div>,
}));

import { isAuthenticated } from "../helper/authentication";
import ProtectedLayout from "./ProtectedLayout";

function renderWithRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route
            path={path}
            element={<div data-testid="test-outlet">OUT</div>}
          />
        </Route>

        <Route path="/login" element={<div data-testid="login-page">LOGIN</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedLayout", () => {
  it("redirects to /login when NOT authenticated", () => {
    (isAuthenticated as any).mockReturnValue(false);

    renderWithRoute("/home");

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders outlet when authenticated", () => {
    (isAuthenticated as any).mockReturnValue(true);

    renderWithRoute("/dashboard");

    expect(screen.getByTestId("test-outlet")).toBeInTheDocument();
  });

  it("shows HomeHeader only on /home", () => {
    (isAuthenticated as any).mockReturnValue(true);

    renderWithRoute("/home");

    expect(screen.getByTestId("home-header")).toBeInTheDocument();
  });

  it("does NOT show HomeHeader on non-home routes", () => {
    (isAuthenticated as any).mockReturnValue(true);

    renderWithRoute("/profile");

    expect(screen.queryByTestId("home-header")).toBeNull();
  });
});
