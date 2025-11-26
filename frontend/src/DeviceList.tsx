import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Device } from "./types.ts";

export default function DeviceList() {
  const {
    data: devices = [],
    error,
    isError,
    isPending,
  } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await fetch("/api/devices");
      if (!res.ok) {
        throw new Error("Failed to fetch devices");
      }
      return res.json();
    },
  });

  if (isPending) {
    return <p>Loading devices...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {devices.map((device) => (
        <li key={device.id}>
          <Link to={`/devices/${device.id}`}>{device.name}</Link>
        </li>
      ))}
    </ul>
  );
}
