import { useQuery } from "@tanstack/react-query";
import type { Device } from "../types.ts";

export function useDevice(deviceId: string | undefined) {
  return useQuery<Device>({
    queryKey: ["devices", deviceId],
    queryFn: async () => {
      const res = await fetch(`/api/devices/${deviceId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch device");
      }
      return res.json();
    },
    enabled: !!deviceId,
  });
}
