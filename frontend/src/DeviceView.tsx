import { useParams } from "react-router";

export default function DeviceView() {
  const params = useParams();
  return (
    <>
      <p>Device {params.deviceId}</p>
      <table>
        <th></th>
      </table>
    </>
  );
}
