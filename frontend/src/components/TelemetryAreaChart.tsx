import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TelemetryTooltip from "./TelemetryTooltip.tsx";
import { formatShortTimestamp } from "../utils/telemetryUtils.ts";
import type { NumericDatapoint } from "../types.ts";

type TelemetryAreaChartProps = {
  telemetry: NumericDatapoint[];
};

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
        tickFormatter={formatShortTimestamp}
        scale="time"
      />
      <YAxis
        dataKey="reading"
        stroke="white"
        type="number"
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
