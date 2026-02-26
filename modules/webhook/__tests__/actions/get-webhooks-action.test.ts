import { getWebhooks } from "@/modules/webhook/actions/get-webhooks-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const mockPaginatedResponse = {
  success: true,
  message: "OK",
  data: {
    webhooks: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  },
};

describe("getWebhooks", () => {
  it("calls apiClient.get with the correct URL", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockPaginatedResponse,
    });

    await getWebhooks();

    expect(apiClient.get).toHaveBeenCalledWith("/api/web/v1/webhooks");
  });

  it("returns the API response data", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockPaginatedResponse,
    });

    const result = await getWebhooks();

    expect(result).toEqual(mockPaginatedResponse);
  });
});
