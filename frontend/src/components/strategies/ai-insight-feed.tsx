import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Sparkles } from "lucide-react";

interface Insight {
  id: string;
  symbol: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  summary: string;
  timestamp: string;
}

export function AiInsightFeed() {
  // Mock data for now, will connect to API later
  const insights: Insight[] = [
    {
      id: "1",
      symbol: "BTC",
      sentiment: "Bullish",
      summary:
        "Institutional inflows increasing as ETF volume spikes. On-chain metrics suggest accumulation phase.",
      timestamp: "2 mins ago",
    },
    {
      id: "2",
      symbol: "ETH",
      sentiment: "Neutral",
      summary:
        "Consolidating above support levels. Gas fees low, indicating reduced network activity.",
      timestamp: "15 mins ago",
    },
    {
      id: "3",
      symbol: "SOL",
      sentiment: "Bullish",
      summary:
        "Network upgrade successful. DeFi TVL reaching new monthly highs.",
      timestamp: "1 hour ago",
    },
  ];

  return (
    <Card className="h-full border-border/50 bg-background-surface/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-medium text-text-primary">
          AI Market Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="group relative overflow-hidden rounded-lg border border-border/50 bg-background-base p-4 transition-all hover:border-primary/30"
          >
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
            <div className="relative z-10">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">
                    {insight.symbol}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      insight.sentiment === "Bullish"
                        ? "bg-accent-green/10 text-accent-green"
                        : insight.sentiment === "Bearish"
                        ? "bg-accent-red/10 text-accent-red"
                        : "bg-text-tertiary/10 text-text-tertiary"
                    }`}
                  >
                    {insight.sentiment}
                  </span>
                </div>
                <span className="text-xs text-text-tertiary">
                  {insight.timestamp}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{insight.summary}</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              <Sparkles className="h-3 w-3" />
              <span>AI Confidence: 85%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
