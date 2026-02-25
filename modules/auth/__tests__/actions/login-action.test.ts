import { loginAction } from "@/modules/auth/actions/login-action";
import { apiClient, setToken } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
  setToken: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe("loginAction", () => {
  it("calls apiClient.post with the correct URL and payload", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "OK", data: null },
    });

    await loginAction({ email: "user@example.com", password: "secret" });

    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/v1/login", {
      email: "user@example.com",
      password: "secret",
    });
  });

  it("calls setToken when the response contains an access_token", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        message: "Logged in",
        data: {
          access_token: "jwt-token",
          expires_in: 3600,
          token_type: "Bearer",
        },
      },
    });

    await loginAction({ email: "user@example.com", password: "secret" });

    expect(setToken).toHaveBeenCalledWith("jwt-token", 3600);
  });

  it("does not call setToken when response has no access_token", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: false, message: "Fail", data: null },
    });

    await loginAction({ email: "user@example.com", password: "secret" });

    expect(setToken).not.toHaveBeenCalled();
  });

  it("returns the API response data", async () => {
    const mockResponse = {
      success: true,
      message: "OK",
      data: { access_token: "tok", expires_in: 900, token_type: "Bearer" },
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await loginAction({ email: "a@b.com", password: "pass" });

    expect(result).toEqual(mockResponse);
  });
});
