import { useParams } from "react-router";
import { Link } from "react-router";
import { useDevice } from "../hooks/useDevice.ts";
import { useTelemetry } from "../hooks/useTelemetry.ts";
import DeviceInfo from "./DeviceInfo.tsx";
import TelemetryTable from "./TelemetryTable.tsx";

export default function DeviceDetail() {
  const params = useParams();

  const {
    data: device,
    error: deviceError,
    isError: deviceIsError,
    isPending: deviceIsPending,
  } = useDevice(params.deviceId);

  const {
    data: telemetry,
    error: telemetryError,
    isError: telemetryIsError,
    isPending: telemetryIsPending,
  } = useTelemetry(params.deviceId);

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
      <DeviceInfo device={device} />
      <TelemetryTable telemetry={telemetry} />
    </div>
  );
}
