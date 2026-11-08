import { useEffect } from 'react'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({ isOpen, taskTitle, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return
    const handler = e => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div className={styles.dialog}>
        <span className={styles.icon} aria-hidden="true">🗑️</span>
        <h2 className={styles.title} id="confirm-title">Delete Task</h2>
        <p className={styles.message} id="confirm-message">
          Are you sure you want to delete{' '}
          <span className={styles.taskName}>"{taskTitle}"</span>?
          <br />This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

