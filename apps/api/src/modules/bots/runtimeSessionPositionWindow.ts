import { Prisma } from '@prisma/client';

export const buildRuntimeSessionClosedPositionWindow = (input: {
  startedAt: Date;
  windowEnd: Date;
}): Prisma.DateTimeFilter => ({
  gte: input.startedAt,
  lte: input.windowEnd,
});
