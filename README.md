# VaultChain Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

> **TradingView-grade crypto trading & portfolio intelligence platform** powered by advanced AI, real-time market feeds, and institutional-grade execution tooling.

## 🚀 Overview

VaultChain Dashboard is a professional-grade crypto trading platform delivering **real-time market intelligence**, **AI-driven forecasts** (LSTM pricing + CryptoBERT sentiment analysis), and **high-performance execution** for institutional crypto desks.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **frontend** | ![Next.js](https://img.shields.io/badge/-Next.js%2016-000?logo=next.js) ![React](https://img.shields.io/badge/-React%2019-61dafb?logo=react&logoColor=black)|
| **backend** | ![NestJS](https://img.shields.io/badge/-NestJS%2014-E0234E?logo=nestjs) |
| **Components** |![Tailwind CSS](https://img.shields.io/badge/-Tailwind%203.4-06b6d4?logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/-shadcn%2Fui-000) ![ApexCharts](https://img.shields.io/badge/-ApexCharts-FF6B6B) + `react-apexcharts` + `Radix Primitives`|
| **Utilities** | `clsx` • `tailwind-merge` • `date-fns` |
---

## ⚡ Quick Start

```bash
# Install once for the whole workspace
pnpm install

# Run frontend (Next.js)
pnpm dev

# Run backend (NestJS)
pnpm dev:backend
```

🌐 Frontend: [http://localhost:3000](http://localhost:3000)  
🛡️ Backend REST: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

> Copy `.env.example` to `.env` in both `frontend/` and `backend/` when supplying real credentials (AI provider keys, custom REST endpoints, etc.).

---

## 🔐 Authentication Setup

1. **PostgreSQL** – provision a database locally (Docker, Railway, Supabase, etc.) and grab the connection string in the form `postgresql://user:password@host:port/vaultchain`.
2. **Backend env** – duplicate `backend/.env.example`, set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` (seconds), and `PASSWORD_PEPPER`.
3. **Prisma schema** – generate the client and run migrations:
   ```bash
   cd backend
   pnpm prisma generate --schema=prisma/schema.prisma
   pnpm prisma migrate deploy --schema=prisma/schema.prisma
   ```
4. **Frontend env** – ensure `frontend/.env` has `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1` (or your deployed API).
5. **Run stack** – in one terminal `pnpm dev:backend`, and in another `pnpm dev`. Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login) or `/auth/signup` to exercise the new flows.

> Deployments: ship the frontend to Vercel (environment variables via Project Settings) and the backend to Railway/Fly/Render. Run `pnpm prisma migrate deploy` during release and supply the same env vars.

---

## 📦 Workspace Scripts

```bash
pnpm dev            # frontend dev server (Turbopack)
pnpm dev:backend    # backend dev server (NestJS)
pnpm build          # build all packages
pnpm lint           # lint workspace (frontend + backend)
pnpm typecheck      # strict TypeScript across projects
pnpm start          # run frontend production server
```

Each package also exposes local scripts (see `package.json` inside `frontend/` and `backend/`).

## 🐳 Docker / CI/CD

### Compose (local parity)

```bash
docker compose up --build
```

- Frontend available at `http://localhost:3000`
- Backend API at `http://localhost:4000/api/v1`

### GitHub Actions
- `.github/workflows/ci.yml` runs lint → typecheck → build for both packages and validates Docker images.

---

## ✨ Key Features

- ✅ **Real-time Market Data** — Live crypto feeds with WebSocket integration
- ✅ **AI-Powered Forecasting** — LSTM price prediction + CryptoBERT sentiment
- ✅ **Professional UI** — TradingView-grade design with dark/light modes
- ✅ **Institutional-Grade** — High-performance charting & execution tooling
- ✅ **Type-Safe** — 100% TypeScript strict mode
- ✅ **Production-Ready** — Clean architecture + best practices

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) for details.

---

## 🤝 Collaborators

Proudly built by awesome contributors:

| Name             | Role               | Socials           |  
|------------------|--------------------|------------------|  
| [Niruss](https://github.com/NirussVn0)  | Own Dev       | ![GitHub](https://img.shields.io/badge/-@nirussvn0-181717?logo=github&logoColor=white) [![X](https://img.shields.io/badge/-@nirussvn0-1da1f2?logo=x&logoColor=white)](https://x.com/nirussvn0) [![Portfolio](https://img.shields.io/badge/-website-0a192f?logo=firefox&logoColor=white)](https://sabicoder.xyz) |  

---

> Want to join the squad? Open a PR or get in touch!
