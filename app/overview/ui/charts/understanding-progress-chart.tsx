"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import { ChartResponsiveShell } from "./chart-responsive-shell";

const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});

type Datum = {
  date: string;
  label: string;
  avg: number | null;
};

export default function UnderstandingProgressChart({
  data,
}: {
  data: Datum[];
}) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        avgValue: d.avg,
      })),
    [data],
  );

  return (
    <ChartResponsiveShell className="h-56 w-full min-w-0">
      {({ width, height }) => (
        <LineChart
          width={width}
          height={height}
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[1, 3]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => Number(v).toFixed(0)}
          />
          <Tooltip
            content={(props) => {
              if (!props.active || !props.payload?.length) return null;
              const entry = props.payload[0];
              if (!entry) return null;
              const datum = entry.payload as Datum & {
                avgValue: Datum["avg"];
              };
              const value = datum.avgValue;
              if (value == null) return null;
              return (
                <div className="rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md/5">
                  <p className="text-muted-foreground">{datum.date}</p>
                  <p className="font-medium">{Number(value).toFixed(1)} / 3</p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="avgValue"
            stroke="var(--color-chart-3)"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      )}
    </ChartResponsiveShell>
  );
}
