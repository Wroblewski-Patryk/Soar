import { beforeEach, describe, expect, it, vi } from "vitest";
import { INVALID_CREDENTIALS_MESSAGE } from "./auth.errors";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  transaction: vi.fn(),
  userCreate: vi.fn(),
  hashPassword: vi.fn(),
  ensureSubscriptionCatalog: vi.fn(),
  ensureDefaultSubscriptionForUser: vi.fn(),
}));

vi.mock("../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique,
    },
    $transaction: mocks.transaction,
  },
}));

vi.mock("../../utils/hash", () => ({
  hashPassword: mocks.hashPassword,
  comparePassword: vi.fn(),
}));

vi.mock("../../config/runtime", () => ({
  serverUrl: "https://api.example.test",
}));

vi.mock("../subscriptions/subscriptions.service", () => ({
  ensureSubscriptionCatalog: mocks.ensureSubscriptionCatalog,
  ensureDefaultSubscriptionForUser: mocks.ensureDefaultSubscriptionForUser,
}));

const { registerUser } = await import("./auth.service");

describe("registerUser", () => {
  const createdUser = {
    id: "user-1",
    email: "register@example.com",
    role: "USER",
    name: null,
    avatarUrl: "https://api.example.test/avatars/default.png",
    createdAt: new Date("2026-07-12T00:00:00.000Z"),
    updatedAt: new Date("2026-07-12T00:00:00.000Z"),
  };

  const tx = {
    user: {
      create: mocks.userCreate,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.hashPassword.mockResolvedValue("hashed-password");
    mocks.transaction.mockImplementation(async (callback) => callback(tx));
    mocks.userCreate.mockResolvedValue(createdUser);
  });

  it("creates a public user with a hashed password, default avatar, and default subscription bootstrap", async () => {
    mocks.findUnique.mockResolvedValue(null);

    const result = await registerUser({
      email: createdUser.email,
      password: "test123",
    });

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { email: createdUser.email },
    });
    expect(mocks.hashPassword).toHaveBeenCalledWith("test123");
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.userCreate).toHaveBeenCalledWith({
      data: {
        email: createdUser.email,
        password: "hashed-password",
        avatarUrl: "https://api.example.test/avatars/default.png",
      },
      select: expect.objectContaining({
        id: true,
        email: true,
        role: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      }),
    });
    expect(mocks.ensureSubscriptionCatalog).toHaveBeenCalledWith(tx);
    expect(mocks.ensureDefaultSubscriptionForUser).toHaveBeenCalledWith(
      tx,
      createdUser.id,
    );
    expect(result).toEqual(createdUser);
    expect("password" in result).toBe(false);
  });

  it("rejects duplicate emails before hashing or starting the registration transaction", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "existing-user",
      email: createdUser.email,
    });

    await expect(() =>
      registerUser({
        email: createdUser.email,
        password: "test123",
      }),
    ).rejects.toThrow(INVALID_CREDENTIALS_MESSAGE);

    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.ensureSubscriptionCatalog).not.toHaveBeenCalled();
    expect(mocks.ensureDefaultSubscriptionForUser).not.toHaveBeenCalled();
  });
});
