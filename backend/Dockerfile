# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
RUN pnpm install --filter @vaultchain/backend... --frozen-lockfile

FROM deps AS build
COPY backend backend
RUN pnpm --filter @vaultchain/backend build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
RUN pnpm install --filter @vaultchain/backend... --prod --frozen-lockfile --ignore-scripts
COPY --from=build /app/backend/dist backend/dist
COPY backend/.env.example backend/.env.example

EXPOSE 4000
CMD ["pnpm", "--filter", "@vaultchain/backend", "start"]
