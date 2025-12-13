import { createPortal } from "react-dom";

type ModalProps = {
  onClose: () => void;
  content: React.ReactNode;
};

export default function Modal({ onClose, content }: ModalProps) {
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-700 rounded-xl p-8"
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}
