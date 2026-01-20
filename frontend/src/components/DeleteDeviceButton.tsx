import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import Modal from "./Modal.tsx";
import type { Device } from "../types.ts";

type DeleteDeviceProps = {
  device: Device;
};

export default function DeleteDeviceButton({ device }: DeleteDeviceProps) {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const deleteDeviceMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/devices/${device.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete device");
      }
      return res.json();
    },
    onSuccess: () => {
      setShowModal(false);
      navigate("/devices");
    },
  });

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
            <button
              onClick={() => deleteDeviceMutation.mutate()}
              className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer"
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
