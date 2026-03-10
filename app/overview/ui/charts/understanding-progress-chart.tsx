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
  avg: number | null
}

export default function UnderstandingProgressChart({ data }: { data: Datum[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        avgValue: d.avg,
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
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => Number(v).toFixed(0)}
          />
          <Tooltip
            formatter={(value) => {
              if (value == null) return ["—", "Avg"]
              return [`${Number(value).toFixed(1)} / 3`, "Avg"]
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
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
      </ResponsiveContainer>
    </div>
  )
}
