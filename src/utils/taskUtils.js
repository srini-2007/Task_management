/**
 * Task utility helpers — priority/status labels, colors, date formatting.
 */

export const PRIORITIES = [
  { value: 'high',   label: 'High',   emoji: '🔴' },
  { value: 'medium', label: 'Medium', emoji: '🟡' },
  { value: 'low',    label: 'Low',    emoji: '🟢' },
]

export const STATUSES = [
  { value: 'todo',       label: 'To Do',       color: 'var(--status-todo)' },
  { value: 'inprogress', label: 'In Progress',  color: 'var(--status-inprogress)' },
  { value: 'done',       label: 'Done',         color: 'var(--status-done)' },
]

export function getPriorityMeta(value) {
  return PRIORITIES.find(p => p.value === value) || PRIORITIES[1]
}

export function getStatusMeta(value) {
  return STATUSES.find(s => s.value === value) || STATUSES[0]
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date(new Date().toDateString())
}

export function formatDate(isoDate) {
  if (!isoDate) return null
  const d = new Date(isoDate)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatRelative(isoDate) {
  if (!isoDate) return null
  const target = new Date(isoDate)
  const now = new Date()
  const diffDays = Math.round((target - now) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays <= 7) return `In ${diffDays}d`
  return formatDate(isoDate)
}

export function filterAndSort(tasks, { search, filterStatus, filterPriority, sortBy }) {
  let result = [...tasks]

  // Search
  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  }

  // Filter status
  if (filterStatus !== 'all') {
    if (filterStatus === 'overdue') {
      result = result.filter(isOverdue)
    } else {
      result = result.filter(t => t.status === filterStatus)
    }
  }

  // Filter priority
  if (filterPriority !== 'all') {
    result = result.filter(t => t.priority === filterPriority)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'due_asc': {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      case 'priority': {
        const order = { high: 0, medium: 1, low: 2 }
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
      }
      case 'alpha': return a.title.localeCompare(b.title)
      default: return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return result
}

export function getStats(tasks) {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'inprogress').length
  const overdue = tasks.filter(isOverdue).length
  const todo = tasks.filter(t => t.status === 'todo').length
  return { total, done, inProgress, overdue, todo }
}

