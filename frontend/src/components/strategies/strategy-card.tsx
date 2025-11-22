import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";

interface StrategyCardProps {
  title: string;
  description: string;
  apy: string;
  risk: "Low" | "Medium" | "High";
  active?: boolean;
}

export function StrategyCard({
  title,
  description,
  apy,
  risk,
  active,
}: StrategyCardProps) {
  return (
    <Card className="flex flex-col border-border/50 bg-background-surface/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-text-tertiary">
              {description}
            </CardDescription>
          </div>
          <Badge
            variant={active ? "default" : "outline"}
            className={
              active ? "bg-primary/20 text-primary hover:bg-primary/30" : ""
            }
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-background-base p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent-green" />
            <span className="text-sm font-medium text-text-secondary">
              Est. APY
            </span>
          </div>
          <span className="font-mono text-lg font-bold text-accent-green">
            {apy}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-background-base p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm font-medium text-text-secondary">
              Risk Level
            </span>
          </div>
          <span
            className={`text-sm font-medium ${
              risk === "Low"
                ? "text-accent-green"
                : risk === "Medium"
                ? "text-accent-yellow"
                : "text-accent-red"
            }`}
          >
            {risk}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          variant={active ? "secondary" : "primary"}
        >
          {active ? "Manage Strategy" : "Deploy Strategy"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
