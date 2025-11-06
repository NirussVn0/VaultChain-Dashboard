# VaultChain Dashboard · Architecture Overview

## High-Level System Topology

```
┌─────────────────────────┐
│    Client (Next.js)     │
│  - App Router (RSC)     │
│  - UI Shell (shadcn/ui) │
│  - Recharts / ApexCharts│
└────────────┬────────────┘
             │  HTTPS (GraphQL/REST + SSE/WebSocket proxy)
┌────────────▼────────────┐
│  Edge API Layer (Vercel)│
│  - Route Handlers       │
│  - Caching (ISR/RSC)    │
│  - Auth Middleware      │
└────────────┬────────────┘
             │  gRPC/HTTPS
┌────────────▼────────────┐
│  Railway · NestJS API   │
│  - CQRS Commands/Queries│
│  - Event Bus (Redis)    │
│  - Domain Modules       │
└────────────┬────────────┘
             │
┌────────────▼────────────┐    ┌─────────────────────┐
│ Data Services           │    │ AI Inference Layer  │
│ - TimescaleDB (TS data) │    │ - LSTM (PyTorch)    │
│ - Postgres (Core)       │    │ - CryptoBERT        │
│ - Redis (Cache/Bus)     │    │ - Feature Store     │
└─────────────────────────┘    └─────────────────────┘
```

The dashboard ships as a statically optimised Next.js 16 application deployed on Vercel. All domain interactions flow through the NestJS CQRS backend hosted on Railway, which brokers command execution, projections, and AI inference orchestration.

---

## Frontend Architecture

- **Framework**: Next.js 16 App Router with React Server Components (RSC) for streaming data and Suspense-driven fallbacks.
- **State/Async**: RSC data fetching combined with server actions (mutation commands) and SWR hooks for client revalidation.
- **Realtime Pipeline**: `MarketDataProvider` (client) hydrates a Zustand store from WebSocket streams (Binance by default) and exposes selectors via `useMarket*` hooks for tickers, depth, and connection telemetry.
- **UI System**:
  - `src/components/layout`: global shell primitives (sidebar, top bar).
  - `src/components/dashboard`: feature composition modules (charts, tables, analytics cards).
  - `src/components/ui`: shadcn/ui primitives wrapped with VaultChain styling tokens.
- **Styling**: Tailwind CSS 3.4 with custom tokens that map to the VaultChain palette; animations and gradients follow the TradingView-inspired language.
- **Visualization**: ApexCharts for intraday time-series (price, prediction overlays) with progressive rendering and tooltips tuned for financial data.
- **Type Safety**: `src/types` holds DTO contracts that mirror backend query projections; strict TypeScript config prevents implicit any, unchecked access, etc.
- **Error Resilience**: page-level `loading.tsx` and `error.tsx` provide skeletons and recovery prompts for all critical views.

### Data Flow in the Dashboard

1. **Server Data Fetching**: Dashboard route uses RSC to compose metrics, positions, and insights. Edge route handlers interface with backend queries (to be wired).
2. **Real-Time Streams**: WebSocket/SSE connections are brokered via Vercel Edge middleware, fan-out to Next.js client components. The `market-store` binds the socket heartbeat to the header latency badge, portfolio KPIs, active positions table, and the order book card with animated diff highlighting.
3. **AI Outputs**: LSTM and CryptoBERT responses get normalised by the backend before hitting the frontend. The UI expects deterministic schema (`ForecastPoint`, `SentimentInsight`) to keep rendering pure.

---

## Backend Sketch (NestJS on Railway)

```
src/
 ├─ modules/
 │   ├─ accounts/
 │   ├─ portfolios/
 │   ├─ markets/
 │   ├─ risk/
 │   └─ ai/
 ├─ shared/
 │   ├─ infrastructure/
 │   ├─ cqrs/
 │   └─ config/
 └─ main.ts
```

- **CQRS**: Commands mutate aggregate roots, Queries project read models (materialized views in TimescaleDB/Postgres). Event handlers push updates to Redis for WebSocket distribution.
- **Integration**: AI module orchestrates LSTM predictions via internal inference service (Python microservice) and CryptoBERT via managed model endpoint. Results cached and versioned.
- **Security**: Auth0 / JWT guard at API gateway, with per-org RBAC enforced in NestJS guards and policy decorators.
- **Observability**: OpenTelemetry instrumentation with traces shipped to Grafana Tempo; logging via Pino + Loki.

---

## Deployment & Delivery

- **Frontend**: Vercel deployments triggered via GitHub Actions. Edge middleware handles auth, request enrichment, and static asset caching. Dockerfile provided (`frontend/Dockerfile`) for parity builds.
- **Backend**: Railway (or any container platform) builds the NestJS image via `backend/Dockerfile`. CQRS modules stay modular for microservice extraction.
- **CI/CD**: `.github/workflows/ci.yml` runs quality gates and validates Docker builds for both services. `docker-compose.yml` provisions local parity (frontend + backend).
- **Secrets**: Managed via Vercel/ Railway secrets managers, synchronised locally using Doppler CLI (optional).

---

## Future Enhancements

- Replace mocked data in `src/lib/mock-data.ts` with live CQRS query adapters using `fetch` + RSC.
- Add optimistic UI flows with server actions for trade placement and risk approvals.
- Instrument WebSocket stream recovery and degrade gracefully to polling when latency thresholds are exceeded.
- Expand docs with sequence diagrams for order execution and margin rebalancing flows.
