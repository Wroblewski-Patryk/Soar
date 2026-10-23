import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import {
  ensureSubscriptionCatalog,
  setActiveSubscriptionForUser,
} from '../modules/subscriptions/subscriptions.service';

export const createEntitledUser = async (input: { data: Prisma.UserCreateInput }) => {
  const user = await prisma.user.create(input);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id,
    planCode: 'FREE',
    source: 'ADMIN_OVERRIDE',
    autoRenew: false,
    metadata: { reason: 'orders_test_fixture' },
  });
  return user;
};
