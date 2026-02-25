import { registerSchema } from "@/modules/auth/lib/validations/register";

const validPayload = {
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  password: "password123",
  password_confirmation: "password123",
};

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validPayload, name: "J" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects a surname shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validPayload, surname: "D" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.surname).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: "123",
      password_confirmation: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password_confirmation: "differentPassword",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.flatten().fieldErrors.password_confirmation,
      ).toBeDefined();
    }
  });
});
