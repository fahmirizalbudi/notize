import type { JSX } from "preact";

interface ConfirmDialogProps {
  /** Controls visibility of the modal */
  isOpen: boolean;
  /** Bold text shown at the top */
  title: string;
  /** Explanatory text for the action */
  message: string;
  /** Callback fired when the primary action is clicked */
  onConfirm: () => void;
  /** Callback fired when the user dismisses the dialog */
  onCancel: () => void;
}

/**
 * A reusable modal dialog for critical confirmations.
 * 
 * @param props - Component properties
 * @returns JSX.Element | null
 */
export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">{title}</div>
        <div className="dialog-message">{message}</div>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}
