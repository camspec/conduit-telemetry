import Modal from "./Modal.tsx";

type AddDeviceModalProps = {
  onClose: () => void;
};

export default function AddDeviceModal({ onClose }: AddDeviceModalProps) {
  return (
    <Modal onClose={onClose}>
      <h1 className="font-bold text-xl mb-4">Add Device</h1>
      <form className="space-y-3">
        <p>This is the modal</p>
        <button className="bg-slate-500 rounded-xl p-3">
          This is the button
        </button>
      </form>
    </Modal>
  );
}
