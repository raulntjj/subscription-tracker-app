import { testWebhook } from "@/modules/webhook/actions/test-webhook-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("testWebhook", () => {
  it("calls apiClient.post with the correct URL, null body, and async=true param", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Dispatched", data: null },
    });

    await testWebhook(3);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/web/v1/webhooks/3/test",
      null,
      { params: { async: true } },
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = { success: true, message: "Test sent", data: null };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await testWebhook(3);

    expect(result).toEqual(mockResponse);
  });
});
