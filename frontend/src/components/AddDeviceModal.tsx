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
          <label htmlFor="name" className="block text-sm mb-1 text-gray-300">
            Device Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg"
            required
          ></input>
        </div>

        <div>
          <label
            htmlFor="dataType"
            className="block text-sm mb-1 text-gray-300"
          >
            Data Type
          </label>
          <select
            id="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg"
            required
          >
            <option value="numeric">Numeric</option>
            <option value="text">Text</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 cursor-pointer rounded-xl p-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createDeviceMutation.isPending}
            className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-xl p-3"
          >
            {createDeviceMutation.isPending ? "Creating..." : "Create Device"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
