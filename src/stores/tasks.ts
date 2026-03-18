import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchTasks(params?: { projectId?: number; status?: string }) {
    loading.value = true
    try {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Design homepage mockup',
          description: 'Create initial design concepts',
          projectId: 1,
          projectName: 'Website Redesign',
          status: 'done',
          priority: 'high',
          assigneeName: 'Alice',
          dueDate: '2024-03-15',
          createdAt: '2024-02-01',
        },
        {
          id: 2,
          title: 'Implement authentication',
          description: 'Set up login and registration',
          projectId: 1,
          projectName: 'Website Redesign',
          status: 'in-progress',
          priority: 'high',
          assigneeName: 'Bob',
          dueDate: '2024-03-20',
          createdAt: '2024-02-05',
        },
        {
          id: 3,
          title: 'Write API documentation',
          description: 'Document all REST endpoints',
          projectId: 2,
          projectName: 'Mobile App',
          status: 'todo',
          priority: 'medium',
          assigneeName: 'Carol',
          dueDate: '2024-03-25',
          createdAt: '2024-02-10',
        },
        {
          id: 4,
          title: 'Setup CI/CD pipeline',
          description: 'Configure GitHub Actions',
          projectId: 1,
          projectName: 'Website Redesign',
          status: 'in-progress',
          priority: 'medium',
          assigneeName: 'David',
          createdAt: '2024-02-15',
        },
        {
          id: 5,
          title: 'Performance optimization',
          description: 'Improve page load speed',
          projectId: 3,
          projectName: 'Brand Identity',
          status: 'done',
          priority: 'low',
          assigneeName: 'Eva',
          dueDate: '2024-03-10',
          createdAt: '2024-01-20',
        },
        {
          id: 6,
          title: 'User testing',
          description: 'Conduct usability tests',
          projectId: 4,
          projectName: 'CRM Integration',
          status: 'todo',
          priority: 'high',
          assigneeName: 'Alice',
          dueDate: '2024-03-30',
          createdAt: '2024-02-20',
        },
      ]
      tasks.value = mockTasks
    } finally {
      loading.value = false
    }
  }

  async function createTask(data: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...data,
      id: tasks.value.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    tasks.value.push(newTask)
    return newTask
  }

  async function updateTask(id: number, data: Partial<Task>) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...data }
    }
  }

  async function updateTaskStatus(id: number, status: Task['status']) {
    await updateTask(id, { status })
  }

  async function deleteTask(id: number) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }
})
