import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects(params?: { status?: string }) {
    loading.value = true
    try {
      const mockProjects: Project[] = [
        {
          id: 1,
          name: 'Website Redesign',
          description: 'Complete overhaul of company website',
          clientId: 1,
          clientName: 'Tech Corp',
          status: 'in-progress',
          priority: 'high',
          budget: 50000,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          progress: 65,
          team: [1, 2, 3],
        },
        {
          id: 2,
          name: 'Mobile App Development',
          description: 'iOS and Android app for e-commerce',
          clientId: 2,
          clientName: 'Design Studio',
          status: 'planning',
          priority: 'high',
          budget: 80000,
          startDate: '2024-03-01',
          progress: 15,
          team: [2, 4],
        },
        {
          id: 3,
          name: 'Brand Identity',
          description: 'Logo and brand guidelines',
          clientId: 3,
          clientName: 'Marketing Pro',
          status: 'completed',
          priority: 'medium',
          budget: 25000,
          startDate: '2023-11-01',
          endDate: '2024-02-28',
          progress: 100,
          team: [1, 3],
        },
        {
          id: 4,
          name: 'CRM Integration',
          description: 'Integrate CRM with existing systems',
          clientId: 4,
          clientName: 'StartUp Inc',
          status: 'review',
          priority: 'medium',
          budget: 35000,
          startDate: '2024-01-15',
          progress: 90,
          team: [2, 3, 4],
        },
        {
          id: 5,
          name: 'Data Analytics Platform',
          description: 'Build analytics dashboard',
          clientId: 5,
          clientName: 'Consulting Group',
          status: 'on-hold',
          priority: 'low',
          budget: 45000,
          startDate: '2024-02-01',
          progress: 30,
          team: [1, 4],
        },
      ]
      projects.value = mockProjects
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: Omit<Project, 'id' | 'progress' | 'team'>) {
    const newProject: Project = {
      ...data,
      id: projects.value.length + 1,
      progress: 0,
      team: [],
    }
    projects.value.push(newProject)
    return newProject
  }

  async function updateProject(id: number, data: Partial<Project>) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...data }
    }
  }

  async function updateProjectStatus(id: number, status: Project['status']) {
    await updateProject(id, { status })
  }

  async function deleteProject(id: number) {
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
  }
})
