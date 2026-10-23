import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createExternalClientReadGrant, getExternalClientReadGrant, listExternalClientReadGrants,
  revokeExternalClientReadGrant,
} from "./readGrants.api";

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("@/lib/api", () => ({ default: api }));

beforeEach(() => vi.clearAllMocks());

describe("human-session read grant API", () => {
  it("uses separate list, detail and revoke routes without returning a secret", async () => {
    const grant = { id: "read/one", botId: "bot-1", action: "READ_BOT_STATUS" };
    api.get.mockResolvedValueOnce({ data: { grants: [grant] } })
      .mockResolvedValueOnce({ data: { grant } });
    api.post.mockResolvedValue({ data: { grant } });

    expect(await listExternalClientReadGrants()).toEqual([grant]);
    expect(await getExternalClientReadGrant("read/one")).toEqual(grant);
    expect(await revokeExternalClientReadGrant("read/one")).toEqual(grant);
    expect(api.get).toHaveBeenNthCalledWith(1, "/dashboard/external-client-read-grants");
    expect(api.get).toHaveBeenNthCalledWith(2, "/dashboard/external-client-read-grants/read%2Fone");
    expect(api.post).toHaveBeenCalledWith("/dashboard/external-client-read-grants/read%2Fone/revoke");
  });

  it("sends READ_BOT_STATUS and returns a secret only from create", async () => {
    const input = { botId: "bot-1", clientLabel: "Reader", action: "READ_BOT_STATUS" as const,
      ttlSeconds: 3600, password: "owner-password" };
    api.post.mockResolvedValue({ data: { grant: { id: "read-1" }, secret: "soar_read_once" } });
    expect(await createExternalClientReadGrant(input)).toEqual({ grant: { id: "read-1" }, secret: "soar_read_once" });
    expect(api.post).toHaveBeenCalledWith("/dashboard/external-client-read-grants", input);
  });
});
