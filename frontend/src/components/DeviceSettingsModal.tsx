import Modal from "./Modal.tsx";
import DeleteDeviceButton from "./DeleteDeviceButton.tsx";
import type { Device } from "../types";

type DeviceSettingsModalProps = {
  device: Device;
  onClose: () => void;
};

export default function DeviceSettingsModal({
  device,
  onClose,
}: DeviceSettingsModalProps) {
  return (
    <Modal onClose={onClose}>
      <h2 className="font-bold text-xl mb-6">Edit {device.name}</h2>
      <DeleteDeviceButton device={device} />
    </Modal>
  );
}
