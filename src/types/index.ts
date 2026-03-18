export interface User {
  id: number
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'manager' | 'user'
}

export interface Client {
  id: number
  name: string
  company: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  createdAt: string
}

export interface Project {
  id: number
  name: string
  description: string
  clientId: number
  clientName?: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high'
  budget: number
  startDate: string
  endDate?: string
  progress: number
  team: number[]
}

export interface Task {
  id: number
  title: string
  description: string
  projectId: number
  projectName?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigneeId?: number
  assigneeName?: string
  dueDate?: string
  createdAt: string
}

export interface Metric {
  date: string
  revenue: number
  clients: number
  projects: number
  tasks: number
}

export interface Activity {
  id: number
  userId: number
  userName: string
  userAvatar?: string
  action: string
  target: string
  timestamp: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
