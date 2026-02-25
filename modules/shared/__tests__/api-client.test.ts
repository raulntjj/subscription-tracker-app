import {
  getToken,
  removeToken,
  setToken,
  TOKEN_COOKIE_KEY,
} from "@/modules/shared/lib/api-client";
import Cookies from "js-cookie";

jest.mock("js-cookie");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getToken", () => {
  it("returns undefined when on the server (no window)", () => {
    const original = global.window;
    delete (global as any).window;
    expect(getToken()).toBeUndefined();
    (global as any).window = original;
  });

  it("calls Cookies.get with the correct key", () => {
    (Cookies.get as jest.Mock).mockReturnValue("my-token");
    expect(getToken()).toBe("my-token");
    expect(Cookies.get).toHaveBeenCalledWith(TOKEN_COOKIE_KEY);
  });
});

describe("setToken", () => {
  it("calls Cookies.set with the token and path options", () => {
    setToken("abc123");
    expect(Cookies.set).toHaveBeenCalledWith(
      TOKEN_COOKIE_KEY,
      "abc123",
      expect.objectContaining({ path: "/" }),
    );
  });

  it("converts expiresInSeconds to days for js-cookie", () => {
    setToken("abc123", 86_400); // 1 day in seconds
    expect(Cookies.set).toHaveBeenCalledWith(
      TOKEN_COOKIE_KEY,
      "abc123",
      expect.objectContaining({ expires: 1 }),
    );
  });
});

describe("removeToken", () => {
  it("calls Cookies.remove with the correct key and path", () => {
    removeToken();
    expect(Cookies.remove).toHaveBeenCalledWith(TOKEN_COOKIE_KEY, {
      path: "/",
    });
  });
});
