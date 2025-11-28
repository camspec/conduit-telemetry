import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Link } from "react-router";
import type { Device, NumericDatapoint, TextDatapoint } from "../types.ts";

export default function DeviceDetail() {
  const params = useParams();

  const {
    data: device,
    error: deviceError,
    isError: deviceIsError,
    isPending: deviceIsPending,
  } = useQuery<Device>({
    queryKey: ["devices", params.deviceId],
    queryFn: async () => {
      const res = await fetch(`/api/devices/${params.deviceId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch device");
      }
      return res.json();
    },
  });

  const {
    data: telemetry,
    error: telemetryError,
    isError: telemetryIsError,
    isPending: telemetryIsPending,
  } = useQuery<NumericDatapoint[] | TextDatapoint[]>({
    queryKey: ["telemetry", device?.id],
    queryFn: async () => {
      const res = await fetch(`/api/devices/${device?.id}/telemetry`);
      if (!res.ok) {
        throw new Error("Failed to fetch telemetry");
      }
      return res.json();
    },
    enabled: !!device,
  });

  if (deviceIsPending) {
    return <p className="p-10">Loading device...</p>;
  }
  if (deviceIsError) {
    return <p className="p-10 text-red-400">Error: {deviceError.message}</p>;
  }

  if (telemetryIsPending) {
    return <p className="p-10">Loading telemetry...</p>;
  }
  if (telemetryIsError) {
    return <p className="p-10 text-red-400">Error: {telemetryError.message}</p>;
  }

  return (
    <div className="bg-slate-900 p-10 space-y-6 rounded-xl">
      <Link
        to="/devices"
        className="inline-block text-blue-400 hover:text-blue-300"
      >
        &lt;- Back to devices
      </Link>
      <h2 className="font-bold text-xl">{device.name}</h2>
      <ul className="text-gray-400 text-sm">
        <li>Device {device.id}</li>
        <li>Category: {device.category}</li>
        <li>Data Type: {device.data_type}</li>
        <li>Created At: {new Date(device.created_at).toLocaleString()}</li>
      </ul>
      <div className="border border-slate-600 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 text-left">
            <tr>
              <th scope="col" className="px-4 py-2">
                Reading
              </th>
              {device.data_type === "numeric" && (
                <th scope="col" className="px-4 py-2">
                  Unit
                </th>
              )}
              <th scope="col" className="px-4 py-2">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {device.data_type === "numeric"
              ? (telemetry as NumericDatapoint[]).map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-2">{t.reading}</td>
                    <td className="px-4 py-2">{t.unit}</td>
                    <td className="px-4 py-2">
                      {new Date(t.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              : (telemetry as TextDatapoint[]).map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-2">{t.reading}</td>
                    <td className="px-4 py-2">
                      {new Date(t.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
