import { createSubscription } from "@/modules/subscription/actions/create-subscription";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { post: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const validPayload = {
  name: "Netflix",
  price: 3990,
  currency: "BRL" as const,
  category: "streaming",
  billing_cycle: "monthly" as const,
  status: "active" as const,
  next_billing_date: "2025-03-01",
};

describe("createSubscription", () => {
  it("calls apiClient.post with the correct URL and payload", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, message: "Created", data: {} },
    });

    await createSubscription(validPayload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/web/v1/subscriptions",
      validPayload,
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = {
      success: true,
      message: "Created",
      data: { id: 1, name: "Netflix" },
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await createSubscription(validPayload);

    expect(result).toEqual(mockResponse);
  });
});
