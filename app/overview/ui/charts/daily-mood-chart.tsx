"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = {
  date: string;
  label: string;
  mood: 1 | 2 | 3 | null;
};

const moodLabel: Record<1 | 2 | 3, string> = {
  1: "Low",
  2: "Neutral",
  3: "Good",
};

type ChartDatum = Datum & { moodValue: Datum["mood"] };

export default function DailyMoodChart({ data }: { data: Datum[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        moodValue: d.mood,
      })),
    [data],
  );

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 72, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            width={72}
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => moodLabel[v as 1 | 2 | 3] ?? ""}
          />
          <Tooltip
            content={(props) => {
              if (!props.active || !props.payload?.length) return null;
              const entry = props.payload[0];
              if (!entry) return null;
              const datum = entry.payload as ChartDatum;
              const value = datum.moodValue;
              if (value == null) return null;
              return (
                <div className="rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md/5">
                  <p className="text-muted-foreground">{datum.date}</p>
                  <p className="font-medium">{moodLabel[value]}</p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="moodValue"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
