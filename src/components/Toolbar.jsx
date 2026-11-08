import styles from './Toolbar.module.css'

export default function Toolbar({
  search, onSearchChange,
  filterPriority, onPriorityChange,
  sortBy, onSortChange,
  resultCount,
}) {
  return (
    <div className={styles.toolbar}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
        {search && (
          <button
            className={styles.clearBtn}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {/* Priority filter */}
        <select
          className={styles.select}
          value={filterPriority}
          onChange={e => onPriorityChange(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Sort */}
        <select
          className={styles.select}
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due_asc">Due Date ↑</option>
          <option value="priority">Priority</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>

      <span className={styles.resultCount}>
        {resultCount} task{resultCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

