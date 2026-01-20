import { capitalizeFirst } from "../utils/displayFormatting.ts";
import type { Device } from "../types.ts";

type DeviceInfoProps = {
  device: Device;
};

export default function DeviceInfo({ device }: DeviceInfoProps) {
  return (
    <ul className="text-gray-400 text-sm">
      <li>Device {device.id}</li>
      <li>Category: {device.category}</li>
      <li>Data type: {capitalizeFirst(device.data_type)}</li>
      <li>Created at: {new Date(device.created_at).toLocaleString()}</li>
    </ul>
  );
}
