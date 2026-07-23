# syntax=docker/dockerfile:1.10

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY libs/shared/package.json libs/shared/package.json

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/api apps/api
COPY libs/shared libs/shared
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build
RUN rm -f apps/api/core apps/api/core.*

FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT
RUN node -e "if (!/^[0-9a-f]{40}$/i.test(process.env.SOURCE_COMMIT || '')) process.exit(1)"
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/
COPY --from=build --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/apps/api /app/apps/api
COPY --from=build --chown=node:node /app/libs/shared /app/libs/shared
RUN mkdir -p /app/apps/api/tmp /app/apps/api/public/avatars && chown -R node:node /app

EXPOSE 3001
WORKDIR /app/apps/api
USER node
CMD ["node", "scripts/start-with-migrate.mjs"]
