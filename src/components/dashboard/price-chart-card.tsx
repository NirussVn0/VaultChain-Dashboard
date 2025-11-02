'use client';

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { ForecastPoint } from "@/types/trading";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PriceChartCardProps {
  symbol: string;
  series: ForecastPoint[];
}

/**
 * Renders the price action chart with AI prediction overlay.
 */
export function PriceChartCard({
  symbol,
  series,
}: PriceChartCardProps) {
  const historical = series.filter((point) => point.type === "historical");
  const predictions = series.filter((point) => point.type === "prediction");

  const basePrice = historical.at(-1)?.price ?? 0;
  const projectedPrice = predictions.at(-1)?.price ?? basePrice;
  const projectedDelta = projectedPrice / basePrice - 1;

  const options: ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      foreColor: "hsl(var(--text-tertiary))",
      toolbar: { show: false },
      animations: { speed: 600 },
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
      dashArray: [0, 6],
    },
    grid: {
      borderColor: "hsla(var(--border) / 0.2)",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { left: 12, right: 12 },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 60, 100],
        colorStops: [
          {
            offset: 0,
            color: "hsla(var(--primary) / 0.4)",
            opacity: 0.5,
          },
          {
            offset: 100,
            color: "hsla(var(--primary) / 0)",
            opacity: 0,
          },
        ],
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: { colors: "hsl(var(--text-tertiary))", fontSize: "12px" },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "hsl(var(--text-tertiary))", fontSize: "12px" },
        datetimeFormatter: {
          hour: "HH:mm",
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: { format: "MMM dd · HH:mm" },
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "hsl(var(--text-tertiary))" },
      markers: { shape: "circle" },
    },
  };

  const chartSeries = [
    {
      name: "Price",
      data: historical.map((point) => [point.timestamp, point.price]),
      color: "hsl(var(--primary))",
    },
    {
      name: "Prediction",
      data: predictions.map((point) => [point.timestamp, point.price]),
      color: "hsl(var(--accent))",
    },
  ];

  return (
    <Card className="h-full border-border/70 bg-background-surface/90">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {symbol} · LSTM Forecast
          </CardTitle>
          <Badge variant="default" className="text-xs">
            {formatCurrency(projectedPrice)}
          </Badge>
        </div>
        <p className="text-sm text-text-tertiary">
          Projected {projectedDelta >= 0 ? "upside" : "downside"} of{" "}
          <span className="text-text-primary">
            {(projectedDelta * 100).toFixed(2)}%
          </span>{" "}
          in the next 6 hours.
        </p>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ReactApexChart
          options={options}
          series={chartSeries}
          type="area"
          height="100%"
        />
      </CardContent>
    </Card>
  );
}
