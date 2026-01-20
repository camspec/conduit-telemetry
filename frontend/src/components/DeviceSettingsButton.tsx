import { useState } from "react";
import DeviceSettingsModal from "./DeviceSettingsModal.tsx";
import type { Device } from "../types.ts";

type DeviceSettingsButtonProps = {
  device: Device;
};

export default function DeviceSettingsButton({
  device,
}: DeviceSettingsButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer text-sm"
      >
        Settings
      </button>
      {showModal && (
        <DeviceSettingsModal
          device={device}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
