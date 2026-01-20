import { useDevices } from "../hooks/useDevices.ts";
import AddDeviceButton from "./AddDeviceButton.tsx";
import DeviceCard from "./DeviceCard.tsx";

export default function DeviceList() {
  const { data: devices = [], error, isError, isPending } = useDevices();

  if (isPending) {
    return <p className="p-10">Loading devices...</p>;
  }
  if (isError) {
    return <p className="p-10 text-red-400">Error: {error.message}</p>;
  }

  return (
    <div className="bg-slate-900 p-10 space-y-10 rounded-xl">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Devices</h2>
        <AddDeviceButton />
      </div>
      <div className="grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
