import styles from './Header.module.css'

export default function Header({ onAddTask }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✅</div>
          <span className={styles.logoText}>
            Task<span>Flow</span>
          </span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={onAddTask}>
            <span className={styles.addBtnIcon}>＋</span>
            New Task
          </button>
        </div>
      </div>
    </header>
  )
}

