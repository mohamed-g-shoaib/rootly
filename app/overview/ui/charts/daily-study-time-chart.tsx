"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = {
  date: string;
  label: string;
  minutes: number;
};

export default function DailyStudyTimeChart({ data }: { data: Datum[] }) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 40, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis width={40} tickLine={false} axisLine={false} />
          <Tooltip
            content={(props) => {
              if (!props.active || !props.payload?.length) return null;
              const entry = props.payload[0];
              if (!entry) return null;
              const datum = entry.payload as Datum;
              return (
                <div className="rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md/5">
                  <p className="text-muted-foreground">{datum.date}</p>
                  <p className="font-medium">{String(entry.value)} min</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="minutes"
            fill="var(--color-chart-1)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
