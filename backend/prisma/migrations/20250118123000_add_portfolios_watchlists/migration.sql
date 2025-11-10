CREATE TABLE IF NOT EXISTS "portfolios" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_portfolios_user FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "portfolios_userId_idx" ON "portfolios" ("userId");

CREATE OR REPLACE FUNCTION update_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_portfolios_updated_at
BEFORE UPDATE ON "portfolios"
FOR EACH ROW
EXECUTE PROCEDURE update_portfolios_updated_at();

CREATE TABLE IF NOT EXISTS "portfolio_positions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "portfolioId" UUID NOT NULL,
  "symbol" TEXT NOT NULL,
  "quantity" NUMERIC(36, 18) NOT NULL,
  "costBasis" NUMERIC(36, 18) NOT NULL,
  "averageEntryPrice" NUMERIC(36, 18) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_positions_portfolio FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "portfolio_positions_portfolioId_idx" ON "portfolio_positions" ("portfolioId");

CREATE OR REPLACE FUNCTION update_portfolio_positions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_portfolio_positions_updated_at
BEFORE UPDATE ON "portfolio_positions"
FOR EACH ROW
EXECUTE PROCEDURE update_portfolio_positions_updated_at();

CREATE TABLE IF NOT EXISTS "watchlists" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_watchlists_user FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "watchlists_userId_idx" ON "watchlists" ("userId");

CREATE OR REPLACE FUNCTION update_watchlists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_watchlists_updated_at
BEFORE UPDATE ON "watchlists"
FOR EACH ROW
EXECUTE PROCEDURE update_watchlists_updated_at();

CREATE TABLE IF NOT EXISTS "watchlist_assets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "watchlistId" UUID NOT NULL,
  "symbol" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_watchlist_assets_watchlist FOREIGN KEY ("watchlistId") REFERENCES "watchlists"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "watchlist_assets_watchlistId_idx" ON "watchlist_assets" ("watchlistId");
