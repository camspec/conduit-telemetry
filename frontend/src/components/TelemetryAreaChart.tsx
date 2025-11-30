import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import type { NumericDatapoint } from "../types.ts";

type TelemetryAreaChartProps = {
  telemetry: NumericDatapoint[];
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-CA", {
    hour12: false,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function TelemetryTooltip({ payload }: TooltipContentProps<number, string>) {
  if (!payload || payload.length === 0) return null;

  const datapoint = payload[0]?.payload;

  if (!datapoint) return null;

  return (
    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-600">
      <p>{`Reading: ${datapoint.reading} ${datapoint.unit}`}</p>
      <p>{`Timestamp: ${formatTimestamp(datapoint.recorded_at)}`}</p>
    </div>
  );
}

export default function TelemetryAreaChart({
  telemetry,
}: TelemetryAreaChartProps) {
  const data = telemetry.map((t) => ({
    ...t,
    time: new Date(t.recorded_at).getTime(),
  }));

  const chartColor = "#b185db";

  return (
    <AreaChart
      style={{ width: "100%", aspectRatio: 1.618 }}
      responsive
      data={data}
    >
      <defs>
        <linearGradient id="colorTelemetry" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis
        dataKey="time"
        stroke="white"
        type="number"
        domain={["auto", "auto"]}
        tickFormatter={formatTimestamp}
        scale="time"
      />
      <YAxis
        dataKey="reading"
        stroke="white"
        domain={["auto", "auto"]}
        unit={` ${telemetry[0]?.unit || ""}`}
      />
      <Tooltip content={TelemetryTooltip} />
      <Area
        type="monotone"
        dataKey="reading"
        stroke={chartColor}
        fill="url(#colorTelemetry)"
      />
    </AreaChart>
  );
}
