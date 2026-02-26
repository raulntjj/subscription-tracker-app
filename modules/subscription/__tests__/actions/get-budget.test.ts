import { getBudget } from "@/modules/subscription/actions/get-budget";
import { apiClient } from "@/modules/shared/lib/api-client";

jest.mock("@/modules/shared/lib/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

const mockBudget = {
  total_committed: 5000,
  total_committed_formatted: "R$ 50,00",
  upcoming_bills: 1000,
  upcoming_bills_formatted: "R$ 10,00",
  total_monthly: 5000,
  total_monthly_formatted: "R$ 50,00",
  currency: "BRL",
  breakdown: [],
};

describe("getBudget", () => {
  it("calls apiClient.get with the budget URL", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, message: "OK", data: mockBudget },
    });

    await getBudget();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/web/v1/subscriptions/budget",
    );
  });

  it("returns the API response data", async () => {
    const mockResponse = { success: true, message: "OK", data: mockBudget };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await getBudget();

    expect(result).toEqual(mockResponse);
  });
});
