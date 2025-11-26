import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Device, NumericDatapoint, TextDatapoint } from "./types.ts";

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
    return <p>Loading device...</p>;
  }
  if (deviceIsError) {
    return <p>Error: {deviceError.message}</p>;
  }

  if (telemetryIsPending) {
    return <p>Loading telemetry...</p>;
  }
  if (telemetryIsError) {
    return <p>Error: {telemetryError.message}</p>;
  }

  return (
    <>
      <p>{device.name}</p>
      <p>Device {device.id}</p>
      <p>{device.category}</p>
      <p>{device.data_type}</p>
      <p>{device.created_at}</p>

      {device.data_type === "numeric" && (
        <table>
          <thead>
            <tr>
              <th>Reading</th>
              <th>Unit</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {(telemetry as NumericDatapoint[]).map((t) => (
              <tr key={t.id}>
                <td>{t.reading}</td>
                <td>{t.unit}</td>
                <td>{t.recorded_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {device.data_type === "text" && (
        <table>
          <thead>
            <tr>
              <th>Reading</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {(telemetry as TextDatapoint[]).map((t) => (
              <tr key={t.id}>
                <td>{t.reading}</td>
                <td>{t.recorded_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
