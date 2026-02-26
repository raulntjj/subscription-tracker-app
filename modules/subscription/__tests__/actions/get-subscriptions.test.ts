import { getSubscriptions } from "@/modules/subscription/actions/get-subscriptions";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const mockPaginatedResponse = {
  success: true,
  message: "OK",
  data: {
    subscriptions: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  },
};

describe("getSubscriptions", () => {
  it("calls apiClient.get with the correct URL", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockPaginatedResponse,
    });

    await getSubscriptions();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/web/v1/subscriptions",
      expect.objectContaining({ params: undefined }),
    );
  });

  it("forwards pagination params to the request", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockPaginatedResponse,
    });

    const params = { page: 2, per_page: 5, search: "netflix" };
    await getSubscriptions(params);

    expect(apiClient.get).toHaveBeenCalledWith("/api/web/v1/subscriptions", {
      params,
    });
  });

  it("returns the API response data", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockPaginatedResponse,
    });

    const result = await getSubscriptions();

    expect(result).toEqual(mockPaginatedResponse);
  });
});
