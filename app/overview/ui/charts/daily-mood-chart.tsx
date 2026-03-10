"use client"

import { useMemo } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Datum = {
  date: string
  label: string
  mood: 1 | 2 | 3 | null
}

const moodLabel: Record<1 | 2 | 3, string> = {
  1: "Low",
  2: "Neutral",
  3: "Good",
}

export default function DailyMoodChart({ data }: { data: Datum[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        moodValue: d.mood,
      })),
    [data]
  )

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => moodLabel[v as 1 | 2 | 3] ?? ""}
          />
          <Tooltip
            formatter={(value) => {
              if (value == null) return ["—", "Mood"]
              return [moodLabel[value as 1 | 2 | 3], "Mood"]
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
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
  )
}
