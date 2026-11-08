/**
 * useTasks - Custom hook for all task CRUD operations & filtering.
 * State is persisted to localStorage.
 */
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'taskflow_tasks'

function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadFromStorage)

  // Persist on every change
  useEffect(() => {
    saveToStorage(tasks)
  }, [tasks])

  const addTask = useCallback((data) => {
    const task = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      priority: data.priority || 'medium',
      status: 'todo',
      dueDate: data.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleStatus = useCallback((id) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const nextStatus = t.status === 'done' ? 'todo' : 'done'
        return { ...t, status: nextStatus, updatedAt: new Date().toISOString() }
      })
    )
  }, [])

  const setStatus = useCallback((id, status) => {
    updateTask(id, { status })
  }, [updateTask])

  return { tasks, addTask, updateTask, deleteTask, toggleStatus, setStatus }
}

