import {
  subscriptionSchema,
  CATEGORY_OPTIONS,
} from "@/modules/subscription/lib/validations/subscription";

const validPayload = {
  name: "Netflix",
  price: 3990,
  currency: "BRL" as const,
  category: "streaming",
  billing_cycle: "monthly" as const,
  status: "active" as const,
  next_billing_date: "2025-03-01",
};

describe("subscriptionSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = subscriptionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = subscriptionSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects price of zero", () => {
    const result = subscriptionSchema.safeParse({ ...validPayload, price: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toBeDefined();
    }
  });

  it("rejects a negative price", () => {
    const result = subscriptionSchema.safeParse({
      ...validPayload,
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid currency", () => {
    const result = subscriptionSchema.safeParse({
      ...validPayload,
      currency: "GBP",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.currency).toBeDefined();
    }
  });

  it("rejects an invalid billing_cycle", () => {
    const result = subscriptionSchema.safeParse({
      ...validPayload,
      billing_cycle: "weekly",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.billing_cycle).toBeDefined();
    }
  });

  it("rejects an invalid status", () => {
    const result = subscriptionSchema.safeParse({
      ...validPayload,
      status: "expired",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.status).toBeDefined();
    }
  });

  it("rejects an empty next_billing_date", () => {
    const result = subscriptionSchema.safeParse({
      ...validPayload,
      next_billing_date: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.next_billing_date,
      ).toBeDefined();
    }
  });

  it("accepts all valid currencies: BRL, USD, EUR", () => {
    for (const currency of ["BRL", "USD", "EUR"] as const) {
      const result = subscriptionSchema.safeParse({
        ...validPayload,
        currency,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid statuses: active, paused, cancelled", () => {
    for (const status of ["active", "paused", "cancelled"] as const) {
      const result = subscriptionSchema.safeParse({ ...validPayload, status });
      expect(result.success).toBe(true);
    }
  });
});

describe("CATEGORY_OPTIONS", () => {
  it("contains the expected categories", () => {
    const values = CATEGORY_OPTIONS.map((c) => c.value);
    expect(values).toContain("streaming");
    expect(values).toContain("software");
    expect(values).toContain("hosting");
    expect(values).toContain("gym");
    expect(values).toContain("other");
  });
});
