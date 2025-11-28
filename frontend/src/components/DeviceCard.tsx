import { Link } from "react-router";
import type { Device } from "../types.ts";
import DeviceInfo from "./DeviceInfo.tsx";

type DeviceCardProps = {
  device: Device;
};

export default function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Link
      to={`/devices/${device.id}`}
      className="aspect-square rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors p-4 space-y-3"
    >
      <h3 className="font-semibold">{device.name}</h3>
      <DeviceInfo device={device} />
    </Link>
  );
}
