"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; revenue: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 shadow-lg border border-border"
        style={{ background: "var(--card)" }}
      >
        <p className="text-xs font-bold text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-extrabold text-primary">
          ৳{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-extrabold text-foreground">
              Revenue — last 30 days
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily revenue chart
            </p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No revenue data yet</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const avgRevenue = totalRevenue / data.length;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-base font-extrabold text-foreground">
            Revenue — last 30 days
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily revenue breakdown
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-extrabold text-primary">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Daily avg</p>
            <p className="text-sm font-extrabold text-foreground">
              ৳{Math.round(avgRevenue).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Best day</p>
            <p className="text-sm font-extrabold text-green-600">
              ৳{maxRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              `৳${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
            }
            width={55}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--secondary)", radius: 4 }}
          />
          <Bar
            dataKey="revenue"
            fill="#6B1A28"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
