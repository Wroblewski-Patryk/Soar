import request from 'supertest';
import { app } from '../index';
import { prisma } from '../prisma/client';
import { signAuthToken } from '../modules/auth/auth.jwt';
import {
  ensureDefaultSubscriptionForUser,
  ensureSubscriptionCatalog,
} from '../modules/subscriptions/subscriptions.service';
import { serverUrl } from '../config/runtime';

export type AuthenticatedRequestClient = {
  userId: string;
  email: string;
  get: (path: string) => request.Test;
  post: (path: string) => request.Test;
  put: (path: string) => request.Test;
  patch: (path: string) => request.Test;
  delete: (path: string) => request.Test;
};

const withBearer = (test: request.Test, token: string) =>
  test.set('Authorization', `Bearer ${token}`);

export const registerAndCreateAuthenticatedClient = async (
  email: string,
  password = 'test1234'
): Promise<AuthenticatedRequestClient> => {
  const user =
    (await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        sessionVersion: true,
      },
    })) ??
    (await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          password,
          avatarUrl: `${serverUrl}/avatars/default.png`,
        },
        select: {
          id: true,
          email: true,
          role: true,
          sessionVersion: true,
        },
      });

      await ensureSubscriptionCatalog(tx);
      await ensureDefaultSubscriptionForUser(tx, createdUser.id);

      return createdUser;
    }));

  const token = signAuthToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
    },
    '7d'
  );

  return {
    userId: user.id,
    email: user.email,
    get: (path: string) => withBearer(request(app).get(path), token),
    post: (path: string) => withBearer(request(app).post(path), token),
    put: (path: string) => withBearer(request(app).put(path), token),
    patch: (path: string) => withBearer(request(app).patch(path), token),
    delete: (path: string) => withBearer(request(app).delete(path), token),
  };
};
