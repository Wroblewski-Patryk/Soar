import { beforeEach, describe, expect, it, vi } from "vitest";
import { INVALID_CREDENTIALS_MESSAGE } from "./auth.errors";
import { loginUser } from "./auth.service";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  comparePassword: vi.fn(),
  getSessionJwtExpiresIn: vi.fn(),
  signAuthToken: vi.fn(),
}));

vi.mock("../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock("../../utils/hash", () => ({
  comparePassword: mocks.comparePassword,
}));

vi.mock("./auth.session", () => ({
  getSessionJwtExpiresIn: mocks.getSessionJwtExpiresIn,
}));

vi.mock("./auth.jwt", () => ({
  signAuthToken: mocks.signAuthToken,
}));

describe("loginUser", () => {
  const dbUser = {
    id: "user-1",
    email: "login@example.com",
    role: "USER",
    name: "Login User",
    avatarUrl: "https://api.example.test/avatars/default.png",
    createdAt: new Date("2026-07-12T00:00:00.000Z"),
    updatedAt: new Date("2026-07-12T00:00:00.000Z"),
    password: "hashed-password",
    sessionVersion: 7,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSessionJwtExpiresIn.mockImplementation((remember?: boolean) =>
      remember ? "30d" : "1h",
    );
    mocks.signAuthToken.mockReturnValue("signed-token");
  });

  it("returns a public user and signs a short-lived token for valid credentials", async () => {
    mocks.findUnique.mockResolvedValue(dbUser);
    mocks.comparePassword.mockResolvedValue(true);

    const result = await loginUser({
      email: dbUser.email,
      password: "test123",
      remember: false,
    });

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { email: dbUser.email },
      select: expect.objectContaining({
        id: true,
        email: true,
        role: true,
        password: true,
        sessionVersion: true,
      }),
    });
    expect(mocks.comparePassword).toHaveBeenCalledWith(
      "test123",
      dbUser.password,
    );
    expect(mocks.getSessionJwtExpiresIn).toHaveBeenCalledWith(false);
    expect(mocks.signAuthToken).toHaveBeenCalledWith(
      {
        userId: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        sessionVersion: dbUser.sessionVersion,
      },
      "1h",
    );
    expect(result).toEqual({
      token: "signed-token",
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        sessionVersion: dbUser.sessionVersion,
      },
    });
    expect("password" in result.user).toBe(false);
  });

  it("uses the remember-aware token lifetime when requested", async () => {
    mocks.findUnique.mockResolvedValue(dbUser);
    mocks.comparePassword.mockResolvedValue(true);

    await loginUser({
      email: dbUser.email,
      password: "test123",
      remember: true,
    });

    expect(mocks.getSessionJwtExpiresIn).toHaveBeenCalledWith(true);
    expect(mocks.signAuthToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: dbUser.id,
        email: dbUser.email,
        sessionVersion: dbUser.sessionVersion,
      }),
      "30d",
    );
  });

  it("rejects missing users and invalid passwords with the generic credentials error", async () => {
    mocks.findUnique.mockResolvedValueOnce(null);

    await expect(() =>
      loginUser({
        email: "missing@example.com",
        password: "test123",
      }),
    ).rejects.toThrow(INVALID_CREDENTIALS_MESSAGE);
    expect(mocks.comparePassword).not.toHaveBeenCalled();

    mocks.findUnique.mockResolvedValueOnce(dbUser);
    mocks.comparePassword.mockResolvedValueOnce(false);

    await expect(() =>
      loginUser({
        email: dbUser.email,
        password: "wrong123",
      }),
    ).rejects.toThrow(INVALID_CREDENTIALS_MESSAGE);
    expect(mocks.signAuthToken).not.toHaveBeenCalled();
  });
});
