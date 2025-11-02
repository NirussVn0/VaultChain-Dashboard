import { BrainCircuit, TrendingUpDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SentimentInsight } from "@/types/trading";

interface AiInsightsCardProps {
  symbol: string;
  insights: SentimentInsight[];
  forecastConfidence: number;
}

/**
 * Highlights AI-driven sentiment scores and prediction confidence.
 */
export function AiInsightsCard({
  symbol,
  insights,
  forecastConfidence,
}: AiInsightsCardProps) {
  return (
    <Card className="border-border/70 bg-background-surface/90">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="h-5 w-5 text-primary" aria-hidden="true" />
            AI Sentiment
          </CardTitle>
          <Badge variant="default" className="gap-1">
            <TrendingUpDown className="h-3.5 w-3.5" />
            {Math.round(forecastConfidence * 100)}% confidence
          </Badge>
        </div>
        <p className="text-sm text-text-tertiary">
          CryptoBERT · live feed across derivatives desks, CeFi spot, and on-chain
          social flows. Latest inference for {symbol}.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <InsightRow key={insight.label} insight={insight} />
        ))}
      </CardContent>
    </Card>
  );
}

interface InsightRowProps {
  insight: SentimentInsight;
}

function InsightRow({ insight }: InsightRowProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border/40 bg-background-elevated/40 p-3 transition hover:border-border/70">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {(insight.score * 100).toFixed(0)}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-text-primary">
          {insight.label}
        </span>
        <p className="text-xs text-text-secondary leading-relaxed">
          {insight.summary}
        </p>
      </div>
    </div>
  );
}
