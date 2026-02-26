import { webhookKeys } from "@/modules/webhook/hooks/use-queries";

describe("webhookKeys", () => {
  it("all returns ['webhooks']", () => {
    expect(webhookKeys.all).toEqual(["webhooks"]);
  });

  it("lists() returns the 'list' key under 'webhooks'", () => {
    expect(webhookKeys.lists()).toEqual(["webhooks", "list"]);
  });

  it("detail(id) returns the 'detail' key with the id under 'webhooks'", () => {
    expect(webhookKeys.detail(42)).toEqual(["webhooks", "detail", 42]);
  });
});
