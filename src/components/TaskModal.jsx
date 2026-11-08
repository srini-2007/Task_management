import { useState, useEffect, useRef } from 'react'
import styles from './TaskModal.module.css'

const PRIORITIES = [
  { value: 'high',   label: 'High',   emoji: '🔴', cls: styles.priorityHigh },
  { value: 'medium', label: 'Medium', emoji: '🟡', cls: styles.priorityMedium },
  { value: 'low',    label: 'Low',    emoji: '🟢', cls: styles.priorityLow },
]

const DEFAULT_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  status: 'todo',
}

export default function TaskModal({ isOpen, task, onClose, onSave }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const titleRef = useRef(null)

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title:       task.title,
          description: task.description || '',
          priority:    task.priority,
          dueDate:     task.dueDate || '',
          status:      task.status,
        })
      } else {
        setForm(DEFAULT_FORM)
      }
      setErrors({})
      // Focus title after animation
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [isOpen, task])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (form.title.trim().length > 200) e.title = 'Title is too long (max 200 chars).'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      title:       form.title.trim(),
      description: form.description.trim(),
      priority:    form.priority,
      dueDate:     form.dueDate || null,
      status:      form.status,
    })
    onClose()
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="modal-title">
            {task ? '✏️ Edit Task' : '➕ New Task'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="task-title"
              ref={titleRef}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              maxLength={200}
              aria-required="true"
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <span id="title-error" className={styles.error} role="alert">{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className={styles.textarea}
              placeholder="Add more details (optional)..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.row}>
            {/* Due date */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                className={styles.input}
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>

            {/* Status (edit only) */}
            {task && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className={styles.select}
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          {/* Priority */}
          <div className={styles.field}>
            <span className={styles.label}>Priority</span>
            <div className={styles.priorityPicker} role="group" aria-label="Select priority">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={[
                    styles.priorityOption,
                    p.cls,
                    form.priority === p.value ? styles.prioritySelected : '',
                  ].join(' ')}
                  onClick={() => set('priority', p.value)}
                  aria-pressed={form.priority === p.value}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

