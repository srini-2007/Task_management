import { useState, useMemo } from 'react'
import { useTasks } from './hooks/useTasks'
import { filterAndSort, getStats } from './utils/taskUtils'

import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Toolbar from './components/Toolbar'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import ConfirmDialog from './components/ConfirmDialog'

import styles from './App.module.css'

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleStatus, setStatus } = useTasks()

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, title }

  // Filters
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Computed stats & filtered list
  const stats = useMemo(() => getStats(tasks), [tasks])
  const filteredTasks = useMemo(
    () => filterAndSort(tasks, { search, filterStatus, filterPriority, sortBy }),
    [tasks, search, filterStatus, filterPriority, sortBy]
  )

  const hasFilters = search !== '' || filterStatus !== 'all' || filterPriority !== 'all'

  // Handlers
  function openAdd() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
  }

  function requestDelete(taskId) {
    const task = tasks.find(t => t.id === taskId)
    if (task) setDeleteTarget({ id: task.id, title: task.title })
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteTask(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  // Date context for greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className={styles.layout}>
      <Header onAddTask={openAdd} />

      <main className={styles.main}>
        {/* Page hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{greeting} 👋</h1>
          <p className={styles.heroSub}>
            {stats.total === 0
              ? 'You have no tasks yet. Create one to get started!'
              : `You have ${stats.total} task${stats.total !== 1 ? 's' : ''} — ${stats.done} completed, ${stats.inProgress} in progress.`}
          </p>
        </div>

        {/* Stats */}
        <StatsBar
          stats={stats}
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <div className={styles.divider} />

        {/* Toolbar */}
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredTasks.length}
        />

        {/* Task list */}
        <TaskList
          tasks={filteredTasks}
          onEdit={openEdit}
          onDelete={requestDelete}
          onStatusChange={setStatus}
          onToggle={toggleStatus}
          onAddTask={openAdd}
          hasFilters={hasFilters}
        />
      </main>

      <footer className={styles.footer}>
        TaskFlow &mdash; Built with React &amp; Vite · Tasks saved locally in your browser
      </footer>

      {/* Add / Edit modal */}
      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        taskTitle={deleteTarget?.title || ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

