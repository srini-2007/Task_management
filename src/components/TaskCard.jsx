import { isOverdue, formatRelative, getPriorityMeta } from '../utils/taskUtils'
import styles from './TaskCard.module.css'

const PRIORITY_CLASS = {
  high:   styles.priorityHigh,
  medium: styles.priorityMedium,
  low:    styles.priorityLow,
}

const PRIORITY_STRIPE = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggle }) {
  const overdue = isOverdue(task)
  const pMeta = getPriorityMeta(task.priority)
  const relDate = formatRelative(task.dueDate)

  const dueCls = overdue
    ? styles.dueOverdue
    : relDate === 'Today' || relDate === 'Tomorrow'
      ? styles.dueToday
      : ''

  return (
    <article
      className={[
        styles.card,
        task.status === 'done' ? styles.cardDone : '',
        overdue ? styles.cardOverdue : '',
      ].join(' ')}
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority stripe */}
      <div
        className={styles.stripe}
        style={{ background: PRIORITY_STRIPE[task.priority] }}
        aria-hidden="true"
      />

      {/* Checkbox */}
      <div className={styles.checkboxWrap}>
        <button
          className={`${styles.checkbox} ${task.status === 'done' ? styles.checkboxChecked : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as done'}
          title={task.status === 'done' ? 'Mark as incomplete' : 'Mark as done'}
        >
          {task.status === 'done' ? '✓' : ''}
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={`${styles.title} ${task.status === 'done' ? styles.titleDone : ''}`}>
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.meta}>
          {/* Priority */}
          <span className={`${styles.priority} ${PRIORITY_CLASS[task.priority]}`}>
            {pMeta.emoji} {pMeta.label}
          </span>

          {/* Status */}
          <select
            className={styles.statusSelect}
            value={task.status}
            onChange={e => onStatusChange(task.id, e.target.value)}
            aria-label="Change task status"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Due date */}
          {task.dueDate && (
            <span className={`${styles.due} ${dueCls}`}>
              📅 {relDate}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit"
        >
          ✏️
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </article>
  )
}

