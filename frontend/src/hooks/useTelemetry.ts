import { useQuery } from "@tanstack/react-query";
import type { NumericDatapoint, TextDatapoint } from "../types.ts";

export function useTelemetry(deviceId: string | undefined) {
  return useQuery<NumericDatapoint[] | TextDatapoint[]>({
    queryKey: ["telemetry", deviceId],
    queryFn: async () => {
      const res = await fetch(`/api/devices/${deviceId}/telemetry`);
      if (!res.ok) {
        throw new Error("Failed to fetch telemetry");
      }
      return res.json();
    },
    enabled: !!deviceId,
  });
}
