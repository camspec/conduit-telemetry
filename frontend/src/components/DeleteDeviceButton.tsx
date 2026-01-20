import { useState } from "react";
import Modal from "./Modal.tsx";
import type { Device } from "../types.ts";

type DeleteDeviceProps = {
  device: Device;
};

export default function DeleteDeviceButton({ device }: DeleteDeviceProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-red-400 cursor-pointer text-sm"
      >
        Delete Device
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="mb-6">Are you sure you want to delete this device?</h2>
          <div className="flex justify-around">
            <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer">
              Yes
            </button>
            <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer">
              No
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
