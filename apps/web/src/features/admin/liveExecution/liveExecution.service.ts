import api from "@/lib/api";

export type LiveExecutionPauseStatus = {
  available: boolean;
  paused: boolean;
  reason: string | null;
  version: number | null;
  changedAt: string | null;
  changedByUserId: string | null;
};

export const getLiveExecutionPause = async () =>
  (await api.get<LiveExecutionPauseStatus>("/admin/live-execution")).data;

export const updateLiveExecutionPause = async (input: {
  paused: boolean;
  reason: string;
  expectedVersion: number;
}) => (await api.put<LiveExecutionPauseStatus>("/admin/live-execution", input)).data;
