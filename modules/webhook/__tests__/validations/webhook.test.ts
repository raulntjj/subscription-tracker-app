import { webhookSchema } from "@/modules/webhook/lib/validations/webhook";

describe("webhookSchema", () => {
  it("accepts a valid URL", () => {
    const result = webhookSchema.safeParse({ url: "https://example.com/hook" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid URL", () => {
    const result = webhookSchema.safeParse({ url: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.url).toBeDefined();
    }
  });

  it("rejects when url is missing", () => {
    const result = webhookSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("secret is optional", () => {
    const result = webhookSchema.safeParse({ url: "https://example.com/hook" });
    expect(result.success).toBe(true);

    const withSecret = webhookSchema.safeParse({
      url: "https://example.com/hook",
      secret: "my-secret",
    });
    expect(withSecret.success).toBe(true);
  });

  it("is_active defaults to true when not provided", () => {
    const result = webhookSchema.safeParse({ url: "https://example.com/hook" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_active).toBe(true);
    }
  });

  it("is_active can be set to false", () => {
    const result = webhookSchema.safeParse({
      url: "https://example.com/hook",
      is_active: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_active).toBe(false);
    }
  });
});
