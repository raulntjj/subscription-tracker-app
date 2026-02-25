import { registerAction } from "@/modules/auth/actions/register-action";
import { apiClient, setToken } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
  setToken: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

const payload = {
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  password: "password123",
  password_confirmation: "password123",
};

describe("registerAction", () => {
  it("calls apiClient.post with the correct URL and payload", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "OK", data: null },
    });

    await registerAction(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/auth/v1/register",
      payload,
    );
  });

  it("calls setToken when the response contains an access_token", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        message: "Created",
        data: {
          access_token: "new-token",
          expires_in: 7200,
          token_type: "Bearer",
        },
      },
    });

    await registerAction(payload);

    expect(setToken).toHaveBeenCalledWith("new-token", 7200);
  });

  it("does not call setToken when response has no token", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: false, message: "Error", data: null },
    });

    await registerAction(payload);

    expect(setToken).not.toHaveBeenCalled();
  });

  it("returns the full API response", async () => {
    const mockResponse = {
      success: true,
      message: "Registered",
      data: { access_token: "tok", expires_in: 900, token_type: "Bearer" },
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await registerAction(payload);

    expect(result).toEqual(mockResponse);
  });
});
