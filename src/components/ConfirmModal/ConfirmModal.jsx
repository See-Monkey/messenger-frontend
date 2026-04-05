import styles from "./ConfirmModal.module.css";
import Button from "../../components/Button/Button.jsx";

export default function ConfirmModal({
  isOpen,
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>

        <div className={styles.buttons}>
          <Button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            variant="danger"
          >
            {confirmText}
          </Button>
          <Button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
