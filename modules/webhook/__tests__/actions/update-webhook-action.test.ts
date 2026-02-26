import { updateWebhook } from "@/modules/webhook/actions/update-webhook-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { put: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const validPayload = {
  url: "https://example.com/updated-hook",
  is_active: true,
};

describe("updateWebhook", () => {
  it("calls apiClient.put with the correct URL and payload", async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Updated", data: {} },
    });

    await updateWebhook(9, validPayload);

    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/web/v1/webhooks/9",
      validPayload,
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = {
      success: true,
      message: "Updated",
      data: { id: 9, url: "https://example.com/updated-hook", is_active: true },
    };
    (apiClient.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await updateWebhook(9, validPayload);

    expect(result).toEqual(mockResponse);
  });
});
