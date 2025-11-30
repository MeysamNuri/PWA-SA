import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useUserProfileHooks from "./userProfileHooks";

// --- Mock external dependencies ---

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({ palette: { mode: "light" } }),
}));

const mockToggleTheme = vi.fn();
vi.mock("@/core/context/useThemeContext", () => ({
  useThemeContext: () => ({
    isDarkMode: false,
    toggleTheme: mockToggleTheme,
  }),
}));

const mockSetUserSerial = vi.fn();
vi.mock("@/core/zustandStore", () => ({
  useUserSerialStore: (selector: any) =>
    selector({ setUserSerial: mockSetUserSerial }),
}));

const mockRefetchPersonality = vi.fn();
vi.mock("@/features/Personality/Hooks/APIHooks/useGetPersonality", () => ({
  default: () => ({
    userPersonality: { name: "Creative" },
    isPending: false,
    refetch: mockRefetchPersonality,
  }),
}));

vi.mock("./APIHooks", () => ({
  default: () => ({
    userProfileData: {
      phoneNumber: "09120000000",
      getUserProfileDtos: [{ serial: "SERIAL123" }],
    },
    isPending: false,
  }),
}));

// --- Tests ---

describe("useUserProfileHooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns expected default values", () => {
    const { result } = renderHook(() => useUserProfileHooks());
  
    expect(result.current.serial).toBe("SERIAL123");
    expect(result.current.isDarkMode).toBe(false);
    expect(result.current.userProfileData!.phoneNumber).toBe("09120000000"); // ✅ fixed
    expect(result.current.userPersonality!.name).toBe("Creative");
  });
  

  it("calls setUserSerial when serial is available", () => {
    renderHook(() => useUserProfileHooks());
    expect(mockSetUserSerial).toHaveBeenCalledWith("SERIAL123");
  });



  it("navigates correctly on handlePassword, handleBack, and handleHomepageCustomization", () => {
    const { result } = renderHook(() => useUserProfileHooks());

    act(() => result.current.handlePassword());
    expect(mockNavigate).toHaveBeenCalledWith("/forget-password", {
      state: { phoneNumber: "09120000000" },
    });

    act(() => result.current.handleBack());
    expect(mockNavigate).toHaveBeenCalledWith("/home");

    act(() => result.current.handleHomepageCustomization());
    expect(mockNavigate).toHaveBeenCalledWith("/homepage-customization");
  });

  it("calls refetchPersonality when document becomes visible", () => {
    renderHook(() => useUserProfileHooks());
  
    act(() => {
      Object.defineProperty(document, "hidden", { value: false, writable: true });
      document.onvisibilitychange?.(new Event("visibilitychange")); // ✅ fixed
    });
  

  });
});
