import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";

export function RiskMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Value at Risk (VaR)
          </CardTitle>
          <Activity className="h-4 w-4 text-accent-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-text-primary">$12,450</div>
          <p className="text-xs text-text-tertiary">
            95% confidence interval (24h)
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Sharpe Ratio
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-accent-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-text-primary">2.45</div>
          <p className="text-xs text-text-tertiary">
            Risk-adjusted return (30d)
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Max Drawdown
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-accent-yellow" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-text-primary">-8.2%</div>
          <p className="text-xs text-text-tertiary">
            Peak to trough (All time)
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Margin Usage
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-text-primary">42%</div>
          <p className="text-xs text-text-tertiary">Healthy level (&lt; 60%)</p>
        </CardContent>
      </Card>
    </div>
  );
}
