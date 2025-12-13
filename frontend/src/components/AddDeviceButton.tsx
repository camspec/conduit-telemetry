import { useState } from "react";
import Modal from "./Modal.tsx";

export default function AddDeviceButton() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-lg px-3 py-2"
      >
        + Add Device
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} content={"hi"} />
      )}
    </>
  );
}
