import { createPortal } from "react-dom";

type ModalProps = {
  onClose: () => void;
  content: React.ReactNode;
};

export default function Modal({ onClose, content }: ModalProps) {
  return createPortal(
    <div>
      <div>{content}</div>
    </div>,
    document.body,
  );
}
