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
    return <p className="p-10">Loading devices...</p>;
  }
  if (isError) {
    return <p className="p-10">Error: {error.message}</p>;
  }

  return (
    <div className="bg-slate-900 p-10 space-y-10 rounded-xl">
      <h2 className="font-bold text-2xl">Devices</h2>
      <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {devices.map((device) => (
          <Link
            key={device.id}
            to={`/devices/${device.id}`}
            className="aspect-square rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors p-4 space-y-3"
          >
            <h3 className="font-semibold">{device.name}</h3>
            <ul className="text-gray-400 text-sm">
              <li>Device {device.id}</li>
              <li>Category: {device.category}</li>
              <li>Data type: {device.data_type}</li>
              <li>
                Created at: {new Date(device.created_at).toLocaleString()}
              </li>
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
