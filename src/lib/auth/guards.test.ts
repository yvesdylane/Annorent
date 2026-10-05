import { beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_SESSION, requireRole } from "@/lib/auth/guards";

// `vi.mock` factories are hoisted above imports, so the mock function must be
// created with `vi.hoisted` or the factory would capture an uninitialised
// binding at module-evaluation time.
// The factory must return an *object* to destructure from. Returning `vi.fn()`
// directly and then destructuring `{ redirectMock }` from it yields
// `undefined` at module scope, which surfaces later as
// `Cannot read properties of undefined (reading 'mockClear')`.
const { redirectMock } = vi.hoisted(() => ({
  // Real `redirect()` never returns — it throws NEXT_REDIRECT. The argument is
  // kept so `toHaveBeenCalledWith` can assert which locale's login was chosen.
  redirectMock: vi.fn((href: string): never => {
    void href;
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: (href: string) => redirectMock(href),
}));

beforeEach(() => {
  redirectMock.mockClear();
});

describe("requireRole", () => {
  it("returns the session when the role matches", () => {
    expect(requireRole("en", "property_owner")).toEqual(MOCK_SESSION);
  });

  it("redirects to login when the role does not match", () => {
    // `redirect()` throws NEXT_REDIRECT; the mock records it.
    expect(() => requireRole("en", "admin")).toThrow();
    expect(redirectMock).toHaveBeenCalledWith("/en/login");
  });

  it("redirects to the locale-prefixed login, not the default locale", () => {
    expect(() => requireRole("fr", "admin")).toThrow();
    expect(redirectMock).toHaveBeenCalledWith("/fr/login");
  });
});