import { deleteWebhook } from "@/modules/webhook/actions/delete-webhook-action";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { delete: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("deleteWebhook", () => {
  it("calls apiClient.delete with the correct URL including the id", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});

    await deleteWebhook(5);

    expect(apiClient.delete).toHaveBeenCalledWith("/api/web/v1/webhooks/5");
  });

  it("returns undefined (204 no body)", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteWebhook(5);

    expect(result).toBeUndefined();
  });
});
