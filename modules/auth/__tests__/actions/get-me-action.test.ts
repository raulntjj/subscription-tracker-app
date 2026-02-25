import { getMeAction } from "@/modules/auth/actions/get-me-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("getMeAction", () => {
  it("calls apiClient.get with the correct URL", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, message: "OK", data: null },
    });

    await getMeAction();

    expect(apiClient.get).toHaveBeenCalledWith("/api/auth/v1/me");
  });

  it("returns the API response data", async () => {
    const mockUser = {
      id: "1",
      name: "John",
      surname: "Doe",
      email: "john@example.com",
      profile_path: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, message: "OK", data: mockUser },
    });

    const result = await getMeAction();

    expect(result).toEqual({ success: true, message: "OK", data: mockUser });
  });
});
