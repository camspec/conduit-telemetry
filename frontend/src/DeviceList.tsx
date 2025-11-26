import { useQuery } from "@tanstack/react-query";

interface Device {
  id: number;
  name: string;
  category: string;
  data_type: string;
  created_at: string;
}

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
        <li key={device.id}>{device.name}</li>
      ))}
    </ul>
  );
}
