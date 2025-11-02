# VaultChain Dashboard

VaultChain Dashboard is a TradingView-grade crypto trading and portfolio platform powered by Next.js 16, TypeScript, shadcn/ui, and ApexCharts. The interface delivers real-time market intelligence, AI-driven forecasts (LSTM pricing + CryptoBERT sentiment), and high-performance execution tooling for institutional crypto desks.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4 with VaultChain dark design tokens
- **UI Kit:** shadcn/ui + Radix primitives
- **Charting:** ApexCharts via `react-apexcharts`
- **Utilities:** clsx, tailwind-merge, date-fns for formatting

## Getting Started
Install dependencies and spin up the development server:

```bash
pnpm install
pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000). Environment defaults to a dark TradingView-inspired surface; toggle the `data-theme="light"` attribute on `<body>` for light mode previews.

## Available Scripts
- `pnpm dev` – start the development server
- `pnpm build` – create an optimized production build
- `pnpm start` – run the production build
- `pnpm lint` – lint all source files (warnings treated as errors)
- `pnpm typecheck` – run `tsc --noEmit`

## Architecture Overview
High-level documentation covering topology, data flow, and CQRS modules lives in [`docs/architecture.md`](docs/architecture.md). It details:
- App Router composition and UI shell hierarchy
- Edge routing, CQRS backends, and inference services
- Deployment workflow across Vercel (frontend) and Railway (backend)

Project structure quick view:
```
src/
  app/             # App Router entrypoints, layout, error & loading states
  components/
    dashboard/     # Feature-specific cards, tables, charts
    layout/        # Shell primitives (sidebar, top bar)
    ui/            # Reusable shadcn-styled components
  lib/             # Utilities and mocked data providers
  types/           # Domain contracts (positions, metrics, activities)
docs/
  architecture.md  # System topology, CQRS layering, deployment
```

## Design System
The design tokens mirror the VaultChain palette:
- Background: `#0F172A`
- Surfaces: `#1E293B`, `#19212F`
- Border: `#334155`
- Text: Primary `#F1F5F9`, Secondary `#CBD5E1`, Tertiary `#94A3B8`
- Highlights: Primary `#3B82F6`, Accent `#14B8A6`, Success `#10B981`, Danger `#EF4444`, Warning `#F59E0B`

Typography hierarchy:
- H1 32/700, H2 24/600, H3 18/600, Body 14/400, Small 12/500, Tiny 11/500

## Next Steps
- Wire real CQRS endpoints (NestJS Railway deployment) for metrics, positions, and order book depth
- Connect LSTM and CryptoBERT inference APIs to replace mocked insight data
- Add authenticated routing, execution modals, and role-based access controls

## License
Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---
Crafted with attention to Clean Architecture, strict typing, and production-ready UI patterns.
