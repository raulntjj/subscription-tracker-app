import { getQueryClient } from "@/modules/shared/lib/query-client";
import { QueryClient } from "@tanstack/react-query";

describe("getQueryClient", () => {
  it("returns a QueryClient instance in browser context", () => {
    const client = getQueryClient();
    expect(client).toBeInstanceOf(QueryClient);
  });

  it("reuses the same QueryClient on subsequent calls in browser context", () => {
    const first = getQueryClient();
    const second = getQueryClient();
    expect(first).toBe(second);
  });

  it("returns a QueryClient-shaped object when window is undefined (SSR environment)", () => {
    const original = global.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;

    const client = getQueryClient();

    expect(typeof client.invalidateQueries).toBe("function");
    expect(typeof client.getQueryData).toBe("function");
    expect(typeof client.setQueryData).toBe("function");
    expect(typeof client.clear).toBe("function");

    (global as any).window = original;
  });
});
