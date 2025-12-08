import { useMemo } from "react";
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
  // category order is from bottom to top of YAxis
  const categoryOrder = useMemo(() => {
    const uniqueValues = Array.from(new Set(telemetry.map((t) => t.reading)));
    return uniqueValues.sort();
  }, [telemetry]);

  const data = useMemo(
    () =>
      telemetry.map((t) => ({
        ...t,
        time: new Date(t.recorded_at).getTime(),
        value: categoryOrder.indexOf(t.reading),
      })),
    [telemetry, categoryOrder],
  );

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
        dataKey="value"
        stroke="white"
        type="number"
        ticks={categoryOrder.map((_, i) => i)}
        tickFormatter={(i) => categoryOrder[i]}
        padding={{ top: 30, bottom: 30 }}
      />
      <Tooltip content={TelemetryTooltip} />
      <Line
        type="stepAfter"
        dataKey="value"
        stroke={chartColor}
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
}
