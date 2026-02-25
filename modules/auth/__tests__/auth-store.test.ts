import { useAuthStore } from "@/modules/auth/store/auth-store";
import type { User } from "@/modules/auth/types/auth-types";

const mockUser: User = {
  id: "1",
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  profile_path: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
});

describe("useAuthStore", () => {
  it("has the correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it("setUser sets user and isAuthenticated=true and isLoading=false", () => {
    const { setUser } = useAuthStore.getState();
    setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("clearUser resets user, isAuthenticated, and isLoading", () => {
    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });

    const { clearUser } = useAuthStore.getState();
    clearUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("setLoading toggles the isLoading flag", () => {
    const { setLoading } = useAuthStore.getState();
    setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
