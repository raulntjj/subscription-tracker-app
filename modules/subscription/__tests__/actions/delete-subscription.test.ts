import { deleteSubscription } from "@/modules/subscription/actions/delete-subscription";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { delete: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("deleteSubscription", () => {
  it("calls apiClient.delete with the correct URL including the id", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});

    await deleteSubscription(42);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/web/v1/subscriptions/42",
    );
  });

  it("returns undefined (204 no body)", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteSubscription(1);

    expect(result).toBeUndefined();
  });
});
