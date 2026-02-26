import { updateSubscription } from "@/modules/subscription/actions/update-subscription";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { put: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const validPayload = {
  name: "Netflix Updated",
  price: 4500,
  currency: "BRL" as const,
  category: "streaming",
  billing_cycle: "monthly" as const,
  status: "active" as const,
  next_billing_date: "2025-04-01",
};

describe("updateSubscription", () => {
  it("calls apiClient.put with the correct URL and payload", async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Updated", data: {} },
    });

    await updateSubscription(7, validPayload);

    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/web/v1/subscriptions/7",
      validPayload,
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = { success: true, message: "Updated", data: { id: 7 } };
    (apiClient.put as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await updateSubscription(7, validPayload);

    expect(result).toEqual(mockResponse);
  });
});
