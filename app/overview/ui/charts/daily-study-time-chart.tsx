"use client";

import dynamic from "next/dynamic";

const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
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
  minutes: number;
};

export default function DailyStudyTimeChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 40, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis width={40} tickLine={false} axisLine={false} tickMargin={8} />
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
