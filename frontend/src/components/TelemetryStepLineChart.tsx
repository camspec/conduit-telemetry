import {
  Line,
  LineChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TelemetryTooltip from "./TelemetryTooltip.tsx";
import { formatShortTimestamp } from "../utils/telemetryUtils.ts";
import type { TextDatapoint } from "../types.ts";

type TelemetryStepLineChartProps = {
  telemetry: TextDatapoint[];
};

export default function TelemetryStepLineChart({
  telemetry,
}: TelemetryStepLineChartProps) {
  const data = telemetry.map((t) => ({
    ...t,
    time: new Date(t.recorded_at).getTime(),
  }));

  const chartColor = "#b5e48c";

  return (
    <LineChart
      style={{ width: "100%", aspectRatio: 1.618 }}
      responsive
      data={data}
    >
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
        type="category"
        domain={["auto", "auto"]}
        padding={{ top: 30, bottom: 30 }}
      />
      <Tooltip content={TelemetryTooltip} />
      <Line
        type="stepAfter"
        dataKey="reading"
        stroke={chartColor}
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
}
