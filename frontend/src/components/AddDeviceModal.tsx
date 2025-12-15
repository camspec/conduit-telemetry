import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal.tsx";

type AddDeviceModalProps = {
  onClose: () => void;
};

export default function AddDeviceModal({ onClose }: AddDeviceModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [dataType, setDataType] = useState("numeric");

  const queryClient = useQueryClient();

  const createDeviceMutation = useMutation({
    mutationFn: async (deviceData: {
      name: string;
      category: string;
      dataType: string;
    }) => {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
      });
      if (!res.ok) {
        throw new Error("Failed to create device");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeviceMutation.mutate({ name, category, dataType });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="font-bold text-xl mb-6">Add Device</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Device Name</label>
          <input type="text"></input>
        </div>

        <div>
          <label className="block">Category</label>
          <input type="text"></input>
        </div>

        <div>
          <label className="block">Data Type</label>
          <select>
            <option value="numeric">Numeric</option>
            <option value="text">Text</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button className="bg-slate-500 rounded-xl p-3">Cancel</button>
          <button className="bg-slate-500 rounded-xl p-3">Create Device</button>
        </div>
      </form>
    </Modal>
  );
}
