import styles from './StatsBar.module.css'

const cards = [
  { key: 'all',        label: 'Total',       icon: '📋', color: 'var(--primary)',         value: s => s.total },
  { key: 'todo',       label: 'To Do',       icon: '⭕', color: 'var(--status-todo)',      value: s => s.todo },
  { key: 'inprogress', label: 'In Progress', icon: '🔄', color: 'var(--status-inprogress)', value: s => s.inProgress },
  { key: 'done',       label: 'Done',        icon: '✅', color: 'var(--status-done)',      value: s => s.done },
  { key: 'overdue',    label: 'Overdue',     icon: '⚠️', color: 'var(--status-overdue)',   value: s => s.overdue },
]

export default function StatsBar({ stats, activeFilter, onFilterChange }) {
  return (
    <div className={styles.grid}>
      {cards.map(card => (
        <div
          key={card.key}
          className={`${styles.card} ${activeFilter === card.key ? styles.cardActive : ''}`}
          style={{ '--accent-color': card.color }}
          onClick={() => onFilterChange(card.key)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onFilterChange(card.key)}
          aria-pressed={activeFilter === card.key}
          aria-label={`Filter by ${card.label}`}
        >
          <span className={styles.cardIcon}>{card.icon}</span>
          <span className={styles.cardValue}>{card.value(stats)}</span>
          <span className={styles.cardLabel}>{card.label}</span>
        </div>
      ))}
    </div>
  )
}

