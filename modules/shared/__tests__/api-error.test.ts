import { AxiosError } from "axios";
import {
  applyValidationErrors,
  getApiErrorMessage,
} from "@/modules/shared/lib/api-error";

function makeAxiosError(
  status: number,
  data: Record<string, unknown>,
): AxiosError {
  const error = new AxiosError("Request failed");
  error.response = {
    status,
    data,
    headers: {},
    config: { headers: {} } as never,
    statusText: "Error",
  };
  return error;
}

describe("getApiErrorMessage", () => {
  it("returns default message for non-axios errors", () => {
    expect(getApiErrorMessage(new Error("generic"))).toBe(
      "An unexpected error occurred",
    );
  });

  it("returns default message for plain objects", () => {
    expect(getApiErrorMessage({ code: 500 })).toBe(
      "An unexpected error occurred",
    );
  });

  it("returns API message from axios error response", () => {
    const error = makeAxiosError(400, { message: "Bad credentials" });
    expect(getApiErrorMessage(error)).toBe("Bad credentials");
  });

  it("returns default message when axios error has no message", () => {
    const error = makeAxiosError(500, {});
    expect(getApiErrorMessage(error)).toBe("An unexpected error occurred");
  });
});

describe("applyValidationErrors", () => {
  it("does nothing for non-axios errors", () => {
    const setError = jest.fn();
    applyValidationErrors(new Error("generic"), setError);
    expect(setError).not.toHaveBeenCalled();
  });

  it("does nothing for non-422 axios errors", () => {
    const setError = jest.fn();
    const error = makeAxiosError(400, { errors: { email: ["Invalid email"] } });
    applyValidationErrors(error, setError);
    expect(setError).not.toHaveBeenCalled();
  });

  it("applies field errors for 422 responses", () => {
    const setError = jest.fn();
    const error = makeAxiosError(422, {
      errors: {
        email: ["Email is required", "Invalid email"],
        password: ["Password too short"],
      },
    });
    applyValidationErrors(error, setError);
    // Only the FIRST message of each field is applied
    expect(setError).toHaveBeenCalledWith("email", {
      type: "server",
      message: "Email is required",
    });
    expect(setError).toHaveBeenCalledWith("password", {
      type: "server",
      message: "Password too short",
    });
  });

  it("does nothing when errors object is absent in 422", () => {
    const setError = jest.fn();
    const error = makeAxiosError(422, { message: "Unprocessable" });
    applyValidationErrors(error, setError);
    expect(setError).not.toHaveBeenCalled();
  });
});
