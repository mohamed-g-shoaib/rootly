"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"

type Datum = {
  date: string
  label: string
  avg: number | null
}

const Chart = dynamic(
  async () => {
    const {
      CartesianGrid,
      Line,
      LineChart,
      ResponsiveContainer,
      Tooltip,
      XAxis,
      YAxis,
    } = await import("recharts")
    return {
      default: ({
        chartData,
      }: {
        chartData: (Datum & { avgValue: Datum["avg"] })[]
      }) => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
      ),
    }
  },
  { ssr: false }
)

export default function UnderstandingProgressChart({
  data,
}: {
  data: Datum[]
}) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        avgValue: d.avg,
      })),
    [data]
  )

  return (
    <div className="h-56 w-full">
      <Chart chartData={chartData} />
    </div>
  )
}
