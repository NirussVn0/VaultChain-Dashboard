import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetTable() {
  const assets = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "12.54",
      value: "$845,230",
      change: "+2.4%",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "145.20",
      value: "$452,100",
      change: "-1.2%",
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: "250,000",
      value: "$250,000",
      change: "0.0%",
    },
    {
      symbol: "SOL",
      name: "Solana",
      balance: "1,500",
      value: "$210,450",
      change: "+5.8%",
    },
  ];

  return (
    <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-text-primary">
          Asset Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-text-tertiary">Asset</TableHead>
              <TableHead className="text-right text-text-tertiary">
                Balance
              </TableHead>
              <TableHead className="text-right text-text-tertiary">
                Value (USD)
              </TableHead>
              <TableHead className="text-right text-text-tertiary">
                24h Change
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.symbol}
                className="border-border/50 hover:bg-background-base/50"
              >
                <TableCell className="font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background-elevated text-xs font-bold text-text-secondary">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{asset.symbol}</div>
                      <div className="text-xs text-text-tertiary">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-text-secondary">
                  {asset.balance}
                </TableCell>
                <TableCell className="text-right font-medium text-text-primary">
                  {asset.value}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    asset.change.startsWith("+")
                      ? "text-accent-green"
                      : asset.change.startsWith("-")
                      ? "text-accent-red"
                      : "text-text-secondary"
                  }`}
                >
                  {asset.change}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
