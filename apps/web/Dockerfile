# syntax=docker/dockerfile:1.10

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY libs/shared/package.json libs/shared/package.json

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/web apps/web
COPY libs/shared libs/shared
COPY scripts scripts
RUN pnpm --filter web build

FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3002
RUN corepack enable
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/
COPY --from=build --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/apps/web /app/apps/web
COPY --from=build --chown=node:node /app/libs/shared /app/libs/shared

EXPOSE 3002
USER node
CMD ["pnpm", "--filter", "web", "start"]
