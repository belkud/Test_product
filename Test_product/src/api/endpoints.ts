import api from './client'
import type { User, Client, Project, Task, Metric, Activity, LoginCredentials } from '@/types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ token: string; user: User }>('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<User>('/auth/me'),
}

export const clientsApi = {
  getAll: (params?: { page: number; limit: number; search?: string }) =>
    api.get<{ clients: Client[]; total: number }>('/clients', { params }),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt'>) => api.post<Client>('/clients', data),
  update: (id: number, data: Partial<Client>) => api.put<Client>(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
}

export const projectsApi = {
  getAll: (params?: { page: number; limit: number; status?: string }) =>
    api.get<{ projects: Project[]; total: number }>('/projects', { params }),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id'>) => api.post<Project>('/projects', data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  updateStatus: (id: number, status: Project['status']) =>
    api.patch<Project>(`/projects/${id}/status`, { status }),
}

export const tasksApi = {
  getAll: (params?: { projectId?: number; status?: string; assigneeId?: number }) =>
    api.get<Task[]>('/tasks', { params }),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: Omit<Task, 'id' | 'createdAt'>) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<Task>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  updateStatus: (id: number, status: Task['status']) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }),
}

export const dashboardApi = {
  getMetrics: (period: string) => api.get<{ metrics: Metric[] }>(`/dashboard/metrics?period=${period}`),
  getActivities: () => api.get<{ activities: Activity[] }>('/dashboard/activities'),
  getStats: () => api.get<{
    totalClients: number
    totalProjects: number
    totalTasks: number
    revenue: number
  }>('/dashboard/stats'),
}
