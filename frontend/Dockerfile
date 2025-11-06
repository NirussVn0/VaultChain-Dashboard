# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN pnpm install --filter @vaultchain/frontend... --frozen-lockfile

FROM deps AS build
COPY frontend frontend
RUN pnpm --filter @vaultchain/frontend build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/package.json
COPY frontend/next.config.ts frontend/next.config.ts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public

EXPOSE 3000
CMD ["pnpm", "--filter", "@vaultchain/frontend", "start"]
