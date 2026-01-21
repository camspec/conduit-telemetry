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
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-1 text-gray-300">
            Device name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg"
            required
          ></input>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm mb-1 text-gray-300"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg"
            required
          ></input>
        </div>
      </form>
      <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer text-sm my-5">
        Regenerate API key
      </button>
      <div className="flex justify-between">
        <DeleteDeviceButton device={device} />
        <div className="flex gap-3">
          <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer text-sm">
            Cancel
          </button>
          <button className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 cursor-pointer text-sm">
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
