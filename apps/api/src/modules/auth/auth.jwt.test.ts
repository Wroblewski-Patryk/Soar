import { afterEach, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { signAuthToken, verifyAuthToken } from "./auth.jwt";

const originalJwtSecret = process.env.JWT_SECRET;
const originalJwtSecretPrevious = process.env.JWT_SECRET_PREVIOUS;
const originalJwtSecretPreviousUntil = process.env.JWT_SECRET_PREVIOUS_UNTIL;

afterEach(() => {
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  if (originalJwtSecretPrevious === undefined)
    delete process.env.JWT_SECRET_PREVIOUS;
  else process.env.JWT_SECRET_PREVIOUS = originalJwtSecretPrevious;
  if (originalJwtSecretPreviousUntil === undefined)
    delete process.env.JWT_SECRET_PREVIOUS_UNTIL;
  else process.env.JWT_SECRET_PREVIOUS_UNTIL = originalJwtSecretPreviousUntil;
});

describe("auth.jwt", () => {
  it("signs and verifies token with the primary secret", () => {
    process.env.JWT_SECRET = "primary-secret";
    process.env.JWT_SECRET_PREVIOUS = "";
    delete process.env.JWT_SECRET_PREVIOUS_UNTIL;

    const token = signAuthToken(
      {
        userId: "user-1",
        email: "test@example.com",
        role: "USER",
        sessionVersion: 1,
      },
      "1h",
    );

    const payload = verifyAuthToken(token);
    expect(payload.userId).toBe("user-1");
    expect(payload.email).toBe("test@example.com");
    expect(payload.role).toBe("USER");
    expect(payload.sessionVersion).toBe(1);
  });

  it("accepts token signed with previous secret during rotation window", () => {
    process.env.JWT_SECRET = "new-primary-secret";
    process.env.JWT_SECRET_PREVIOUS = "old-secret";
    process.env.JWT_SECRET_PREVIOUS_UNTIL = "2999-01-01T00:00:00.000Z";

    const legacyToken = jwt.sign(
      {
        userId: "user-legacy",
        email: "legacy@example.com",
        role: "USER",
      },
      "old-secret",
      {
        expiresIn: "1h",
        algorithm: "HS256",
        issuer: "cryptosparrow",
        audience: "cryptosparrow-app",
      },
    );

    const payload = verifyAuthToken(legacyToken);
    expect(payload.userId).toBe("user-legacy");
  });

  it("accepts token signed with previous secret when no rotation expiry is configured", () => {
    process.env.JWT_SECRET = "new-primary-secret";
    process.env.JWT_SECRET_PREVIOUS = "old-secret";
    delete process.env.JWT_SECRET_PREVIOUS_UNTIL;

    const legacyToken = jwt.sign(
      {
        userId: "user-no-expiry",
        email: "no-expiry@example.com",
        role: "USER",
      },
      "old-secret",
      {
        expiresIn: "1h",
        algorithm: "HS256",
        issuer: "cryptosparrow",
        audience: "cryptosparrow-app",
      },
    );

    const payload = verifyAuthToken(legacyToken);
    expect(payload.userId).toBe("user-no-expiry");
  });

  it("rejects token signed with previous secret after rotation window expires", () => {
    process.env.JWT_SECRET = "new-primary-secret";
    process.env.JWT_SECRET_PREVIOUS = "old-secret";
    process.env.JWT_SECRET_PREVIOUS_UNTIL = "2000-01-01T00:00:00.000Z";

    const legacyToken = jwt.sign(
      {
        userId: "user-expired",
        email: "expired@example.com",
        role: "USER",
      },
      "old-secret",
      {
        expiresIn: "1h",
        algorithm: "HS256",
        issuer: "cryptosparrow",
        audience: "cryptosparrow-app",
      },
    );

    expect(() => verifyAuthToken(legacyToken)).toThrow("Invalid token");
  });

  it("fails closed when previous secret expiry is not a valid ISO datetime", () => {
    process.env.JWT_SECRET = "new-primary-secret";
    process.env.JWT_SECRET_PREVIOUS = "old-secret";
    process.env.JWT_SECRET_PREVIOUS_UNTIL = "not-a-date";

    const legacyToken = jwt.sign(
      {
        userId: "user-invalid-expiry",
        email: "invalid-expiry@example.com",
        role: "USER",
      },
      "old-secret",
      {
        expiresIn: "1h",
        algorithm: "HS256",
        issuer: "cryptosparrow",
        audience: "cryptosparrow-app",
      },
    );

    expect(() => verifyAuthToken(legacyToken)).toThrow(
      "JWT_SECRET_PREVIOUS_UNTIL must be a valid ISO datetime",
    );
  });
});
