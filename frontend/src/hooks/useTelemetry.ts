import { useQuery } from "@tanstack/react-query";
import type { NumericDatapoint, TextDatapoint, TimeRange } from "../types.ts";

type UseTelemetryProps = {
  deviceId?: string;
  timeRange?: TimeRange;
  limit?: number;
};

const presets = {
  "1H": 1 * 60 * 60 * 1000,
  "6H": 6 * 60 * 60 * 1000,
  "24H": 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "30D": 30 * 24 * 60 * 60 * 1000,
} as const;

export function useTelemetry({
  deviceId,
  timeRange,
  limit,
}: UseTelemetryProps) {
  return useQuery<NumericDatapoint[] | TextDatapoint[]>({
    queryKey: ["telemetry", deviceId, timeRange, limit],
    queryFn: async () => {
      let start: string | undefined;
      let end: string | undefined;

      if (timeRange?.type === "preset") {
        const now = Date.now();
        start = new Date(now - presets[timeRange.value]).toISOString();
        end = new Date(now).toISOString();
      } else {
        start = timeRange?.start;
        end = timeRange?.end;
      }

      const params = new URLSearchParams();
      if (start) params.append("start", start);
      if (end) params.append("end", end);
      if (limit) params.append("limit", limit.toString());
      const res = await fetch(
        `/api/devices/${deviceId}/telemetry?${params.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch telemetry");
      }
      return res.json();
    },
    enabled: !!deviceId,
  });
}
