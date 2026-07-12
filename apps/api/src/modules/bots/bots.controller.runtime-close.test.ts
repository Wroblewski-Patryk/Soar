import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { botErrors } from "./bots.errors";

const mocks = vi.hoisted(() => ({
  closeBotRuntimeSessionPosition: vi.fn(),
}));

vi.mock("./bots.service", () => ({
  closeBotRuntimeSessionPosition: mocks.closeBotRuntimeSessionPosition,
}));

import { closeBotRuntimeSessionPosition } from "./bots.controller";

const createResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

const createRequest = (overrides: Partial<Request> = {}) =>
  ({
    user: { id: "user-1" },
    params: {
      id: "bot-1",
      sessionId: "session-1",
      positionId: "position-1",
    },
    body: { riskAck: true },
    ...overrides,
  }) as Request;

describe("closeBotRuntimeSessionPosition controller", () => {
  beforeEach(() => {
    mocks.closeBotRuntimeSessionPosition.mockReset();
  });

  it("requires an authenticated user before closing a runtime position", async () => {
    const res = createResponse();

    await closeBotRuntimeSessionPosition(
      createRequest({ user: undefined }),
      res,
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Unauthorized" },
    });
    expect(mocks.closeBotRuntimeSessionPosition).not.toHaveBeenCalled();
  });

  it("delegates the normalized close request and returns the service result", async () => {
    const closeResult = {
      status: "closed",
      positionId: "position-1",
      orderId: "order-1",
    };
    mocks.closeBotRuntimeSessionPosition.mockResolvedValue(closeResult);
    const res = createResponse();

    await closeBotRuntimeSessionPosition(createRequest(), res);

    expect(mocks.closeBotRuntimeSessionPosition).toHaveBeenCalledWith(
      "user-1",
      "bot-1",
      "session-1",
      "position-1",
      { riskAck: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(closeResult);
  });

  it("defaults riskAck to false so the service can fail closed", async () => {
    mocks.closeBotRuntimeSessionPosition.mockRejectedValue(
      botErrors.positionCloseRiskAckRequired(),
    );
    const res = createResponse();

    await closeBotRuntimeSessionPosition(createRequest({ body: {} }), res);

    expect(mocks.closeBotRuntimeSessionPosition).toHaveBeenCalledWith(
      "user-1",
      "bot-1",
      "session-1",
      "position-1",
      { riskAck: false },
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: "riskAck must be true to close runtime position",
        details: { code: "POSITION_CLOSE_RISK_ACK_REQUIRED" },
      },
    });
  });

  it("returns not found when the service cannot resolve the scoped position", async () => {
    mocks.closeBotRuntimeSessionPosition.mockResolvedValue(null);
    const res = createResponse();

    await closeBotRuntimeSessionPosition(createRequest(), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "Not found" } });
  });
});
