import { createWebhook } from "@/modules/webhook/actions/create-webhook-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const validPayload = { url: "https://example.com/hook", is_active: true };

describe("createWebhook", () => {
  it("calls apiClient.post with the correct URL and payload", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Created", data: {} },
    });

    await createWebhook(validPayload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/web/v1/webhooks",
      validPayload,
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = {
      success: true,
      message: "Created",
      data: { id: 1, url: "https://example.com/hook", is_active: true },
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await createWebhook(validPayload);

    expect(result).toEqual(mockResponse);
  });
});
