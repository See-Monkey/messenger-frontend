import styles from "./ConfirmModal.module.css";

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
          <button onClick={onConfirm} className={styles.confirmBtn}>
            {confirmText}
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
