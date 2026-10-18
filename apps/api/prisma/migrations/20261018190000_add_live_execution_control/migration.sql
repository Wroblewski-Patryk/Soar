CREATE TABLE "LiveExecutionControl" (
  "id" TEXT NOT NULL,
  "paused" BOOLEAN NOT NULL DEFAULT true,
  "reason" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "changedByUserId" TEXT,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LiveExecutionControl_pkey" PRIMARY KEY ("id")
);

INSERT INTO "LiveExecutionControl" ("id", "paused", "reason")
VALUES ('global', true, 'Initial rollout: operator must explicitly resume LIVE after all writers are upgraded');
