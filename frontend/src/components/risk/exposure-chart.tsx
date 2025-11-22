"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ExposureChart() {
  const options = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    colors: ["#3b82f6"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["BTC", "ETH", "SOL", "USDT", "BNB"],
      labels: {
        style: { colors: "#94a3b8" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#f8fafc" },
      },
    },
    grid: {
      borderColor: "#1e293b",
      strokeDashArray: 4,
    },
    theme: { mode: "dark" as const },
  };

  const series = [
    {
      name: "Exposure ($)",
      data: [45000, 32000, 15000, 12000, 8000],
    },
  ];

  return (
    <Card className="border-border/50 bg-background-surface/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-text-primary">
          Asset Exposure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
