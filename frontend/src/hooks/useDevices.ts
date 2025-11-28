import { useQuery } from "@tanstack/react-query";
import type { Device } from "../types.ts";

export function useDevices() {
  return useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await fetch("/api/devices");
      if (!res.ok) {
        throw new Error("Failed to fetch devices");
      }
      return res.json();
    },
  });
}
