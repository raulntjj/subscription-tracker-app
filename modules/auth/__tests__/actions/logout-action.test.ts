import { logoutAction } from "@/modules/auth/actions/logout-action";
import { apiClient, removeToken } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
  removeToken: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe("logoutAction", () => {
  it("calls apiClient.post with the correct URL", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Logged out", data: null },
    });

    await logoutAction();

    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/v1/logout");
  });

  it("calls removeToken on successful logout", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Logged out", data: null },
    });

    await logoutAction();

    expect(removeToken).toHaveBeenCalled();
  });

  it("calls removeToken even when the API throws an error", async () => {
    (apiClient.post as jest.Mock).mockRejectedValue(new Error("Network error"));

    await expect(logoutAction()).rejects.toThrow("Network error");

    // removeToken must always run (finally block)
    expect(removeToken).toHaveBeenCalled();
  });

  it("returns the API response data on success", async () => {
    const mockResponse = { success: true, message: "Logged out", data: null };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await logoutAction();

    expect(result).toEqual(mockResponse);
  });
});
