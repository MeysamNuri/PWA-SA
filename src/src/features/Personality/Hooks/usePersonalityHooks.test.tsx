import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import PersonalityViewHooks from "../Hooks/usePersonalityHooks";

// ----------------------------
// MOCK react-router navigate
// ----------------------------
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// ----------------------------
// MOCK dependent hooks
// ----------------------------
const mockGetAll = vi.fn();
vi.mock("../Hooks/APIHooks/useGetAllPersonality", () => ({
  default: () => mockGetAll(),
}));

const mockGetUser = vi.fn();
vi.mock("../Hooks/APIHooks/useGetPersonality", () => ({
  default: () => mockGetUser(),
}));

const mockAdd = vi.fn();
vi.mock("../Hooks/APIHooks/useAddPersonality", () => ({
  default: () => mockAdd(),
}));

// ----------------------------
// DEFAULT MOCK RESPONSES
// ----------------------------
beforeEach(() => {
  vi.clearAllMocks();
  mockGetAll.mockReturnValue({
    personalitiesData: [],
    isPending: false,
    isError: false,
    error: null,
  });

  mockGetUser.mockReturnValue({
    userPersonality: null,
    isPending: false,
    refetch: vi.fn(),
  });

  mockAdd.mockReturnValue({
    handleAddPersonality: vi.fn(),
    isSuccess: false,
  });
});

// ----------------------------
// TEST SUITE
// ----------------------------
describe("PersonalityViewHooks", () => {
  it("returns default shape", () => {
    const { result } = renderHook(() => PersonalityViewHooks());

    expect(result.current.personalities).toEqual([]);
    expect(result.current.options).toEqual([]);
    expect(result.current.selectedId).toBe(null);
  });

  it("maps personalities into options", () => {
    mockGetAll.mockReturnValueOnce({
      personalitiesData: [
        { id: "1", name: "استراتژیست", summery: "sum", description: "desc" },
      ],
      isPending: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => PersonalityViewHooks());

    expect(result.current.options.length).toBe(1);
    expect(result.current.options[0]).toMatchObject({
      id: "1",
      name: "استراتژیست",
      summary: "sum",
      tone: "danger",
    });
  });

  it("auto-selects user personality when it matches", () => {
    mockGetAll.mockReturnValueOnce({
      personalitiesData: [{ id: "1", name: "User", summery: "", description: "" }],
      isPending: false,
      isError: false,
      error: null,
    });

    mockGetUser.mockReturnValueOnce({
      userPersonality: { id: "1" },
      isPending: false,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => PersonalityViewHooks());

    expect(result.current.selectedId).toBe("1");
  });

  it("handles personality change and calls API", () => {
    const mockAddFn = vi.fn();
    const mockRefetch = vi.fn();

    mockGetAll.mockReturnValueOnce({
      personalitiesData: [
        { id: "1", name: "Developer", summery: "", description: "" },
      ],
      isPending: false,
      isError: false,
      error: null,
    });

    mockGetUser.mockReturnValueOnce({
      userPersonality: null,
      isPending: false,
      refetch: mockRefetch,
    });

    mockAdd.mockReturnValueOnce({
      handleAddPersonality: mockAddFn,
      isSuccess: false,
    });

    const { result } = renderHook(() => PersonalityViewHooks());

    act(() => {
      result.current.handlePersonalityChange("1");
    });

    expect(result.current.selectedId).toBe("1");
    expect(mockAddFn).toHaveBeenCalled();
  });

  it("navigates to /user-profile when isSuccess becomes true", () => {
    mockAdd.mockReturnValue({
      handleAddPersonality: vi.fn(),
      isSuccess: true,
    });

    renderHook(() => PersonalityViewHooks());

    expect(mockNavigate).toHaveBeenCalledWith("/user-profile");
  });

  it("returns error when API indicates failure", () => {
    mockGetAll.mockReturnValueOnce({
      personalitiesData: [],
      isPending: false,
      isError: true,
      error: "ERR",
    });

    const { result } = renderHook(() => PersonalityViewHooks());

    expect(result.current.error).toBe("ERR");
  });
});
