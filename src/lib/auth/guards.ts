import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n";

/**
 * Role guards for the authenticated sections.
 *
 * Owns: the single place that answers "may this request proceed as role X?" for
 * the `account`, `owner`, `hotel`, and `admin` sections. Every role's
 * `layout.tsx` calls it once at its root, so individual pages never re-check
 * (file-structure.md rule 12).
 *
 * ! STUB — this is not authorization yet. It returns a hard-coded session and
 * performs no verification of any kind. The real implementation reads the
 * httpOnly session cookie, calls the Core API's `GET /api/v1/users/me`, and
 * compares the returned `role` server-side; per `context/security.md` §RBAC the
 * check must never be trusted to the client, and ownership checks
 * (`owner_id` matching) are enforced by the API per mutating endpoint, not here.
 * Delete `MOCK_SESSION` in the same change that adds the API call — leaving it
 * reachable would be a real hole.
 *
 * Does not own: ownership (which property a given owner may edit — that is an
 * API-side check per endpoint), or session issuance.
 */

export type Role = "tenant" | "property_owner" | "hotel_owner" | "admin";

export type Session = {
  userId: string;
  role: Role;
  displayName: string;
  isVerified: boolean;
};

export const MOCK_SESSION: Session = {
  userId: "user-owner-001",
  role: "property_owner",
  displayName: "Awa N'Guessan",
  isVerified: true,
};

export function requireRole(locale: Locale, role: Role): Session {
  const session = MOCK_SESSION;
  if (session.role !== role) {
    redirect(`/${locale}/login`);
  }
  return session;
}