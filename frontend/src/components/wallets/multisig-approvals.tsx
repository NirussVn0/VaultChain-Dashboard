import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export function MultiSigApprovals() {
  const requests = [
    {
      id: 1,
      type: "Withdrawal",
      amount: "5.0 BTC",
      destination: "bc1q...8z4k",
      status: "Pending (2/3)",
      time: "10 mins ago",
    },
    {
      id: 2,
      type: "Policy Change",
      amount: "-",
      destination: "Risk Limits",
      status: "Pending (1/3)",
      time: "1 hour ago",
    },
  ];

  return (
    <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-text-primary">
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background-base p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {req.type}
                </span>
                <span className="rounded-full bg-accent-yellow/10 px-2 py-0.5 text-xs text-accent-yellow">
                  {req.status}
                </span>
              </div>
              <div className="text-sm text-text-secondary">
                {req.amount !== "-" && (
                  <span className="font-mono">{req.amount}</span>
                )}
                <span className="mx-2 text-text-tertiary">•</span>
                <span className="text-text-tertiary">{req.destination}</span>
              </div>
              <div className="text-xs text-text-tertiary">{req.time}</div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-accent-red hover:bg-accent-red/10 hover:text-accent-red"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-accent-green hover:bg-accent-green/10 hover:text-accent-green"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
