import { subscriptionKeys } from "@/modules/subscription/hooks/use-queries";

describe("subscriptionKeys", () => {
  it("all returns ['subscriptions']", () => {
    expect(subscriptionKeys.all).toEqual(["subscriptions"]);
  });

  it("lists() returns the 'list' key under 'subscriptions'", () => {
    expect(subscriptionKeys.lists()).toEqual(["subscriptions", "list"]);
  });

  it("list(params) includes params in the key", () => {
    const params = { page: 1, per_page: 10 };
    expect(subscriptionKeys.list(params)).toEqual([
      "subscriptions",
      "list",
      params,
    ]);
  });

  it("budget() returns the 'budget' key under 'subscriptions'", () => {
    expect(subscriptionKeys.budget()).toEqual(["subscriptions", "budget"]);
  });
});
