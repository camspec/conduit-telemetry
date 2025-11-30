import type { TooltipContentProps } from "recharts";
import { formatShortTimestamp } from "../utils/telemetryUtils.ts";

export default function TelemetryTooltip({
  payload,
}: TooltipContentProps<number, string>) {
  if (!payload || payload.length === 0) return null;

  const datapoint = payload[0]?.payload;

  if (!datapoint) return null;

  return (
    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-600">
      <p>
        Reading: {datapoint.reading}
        {datapoint.unit ? ` ${datapoint.unit}` : ""}
      </p>
      <p>Timestamp: {formatShortTimestamp(datapoint.recorded_at)}</p>
    </div>
  );
}
