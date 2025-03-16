export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
