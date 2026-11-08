import TaskCard from './TaskCard'
import styles from './TaskList.module.css'

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange, onToggle, onAddTask, hasFilters }) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty} role="status" aria-live="polite">
        <span className={styles.emptyIcon}>
          {hasFilters ? '🔍' : '📝'}
        </span>
        <h2 className={styles.emptyTitle}>
          {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
        </h2>
        <p className={styles.emptySubtitle}>
          {hasFilters
            ? 'Try adjusting your search or filters to find tasks.'
            : 'Create your first task to get started tracking your work.'}
        </p>
        {!hasFilters && (
          <button className={styles.emptyBtn} onClick={onAddTask}>
            ＋ Create First Task
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.list} role="list" aria-label="Task list">
      {tasks.map(task => (
        <div key={task.id} role="listitem">
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  )
}

