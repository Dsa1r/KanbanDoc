import { useState } from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  pendingLabel = 'Working…',
  onConfirm,
  onCancel,
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setError('');
    setIsPending(true);
    try {
      await onConfirm();
    } catch (confirmError) {
      setError(confirmError.message);
      setIsPending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !isPending) {
      onCancel();
    }
  }

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={isPending ? undefined : onCancel}
      onKeyDown={handleKeyDown}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">{title}</h2>
        <p id="confirm-dialog-message" className="confirm-dialog__message">{message}</p>

        {error && <p className="confirm-dialog__error" role="alert">{error}</p>}

        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__cancel"
            onClick={onCancel}
            disabled={isPending}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-dialog__confirm"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;