import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client } from '@/types'
import { clientsApi } from '@/api/endpoints'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchClients(params: { page: number; limit: number; search?: string }) {
    loading.value = true
    try {
      // Mock data for demo
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'Alice Johnson',
          company: 'Tech Corp',
          email: 'alice@techcorp.com',
          phone: '+1 234 567 890',
          status: 'active',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'Bob Smith',
          company: 'Design Studio',
          email: 'bob@designstudio.com',
          phone: '+1 234 567 891',
          status: 'active',
          createdAt: '2024-02-20',
        },
        {
          id: 3,
          name: 'Carol White',
          company: 'Marketing Pro',
          email: 'carol@marketingpro.com',
          phone: '+1 234 567 892',
          status: 'pending',
          createdAt: '2024-03-10',
        },
        {
          id: 4,
          name: 'David Brown',
          company: 'StartUp Inc',
          email: 'david@startup.com',
          phone: '+1 234 567 893',
          status: 'inactive',
          createdAt: '2024-01-05',
        },
        {
          id: 5,
          name: 'Eva Martinez',
          company: 'Consulting Group',
          email: 'eva@consulting.com',
          phone: '+1 234 567 894',
          status: 'active',
          createdAt: '2024-02-28',
        },
      ]
      clients.value = mockClients
      total.value = mockClients.length
    } finally {
      loading.value = false
    }
  }

  async function createClient(data: Omit<Client, 'id' | 'createdAt'>) {
    const newClient: Client = {
      ...data,
      id: clients.value.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    clients.value.push(newClient)
    total.value++
    return newClient
  }

  async function updateClient(id: number, data: Partial<Client>) {
    const index = clients.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...data }
    }
  }

  async function deleteClient(id: number) {
    clients.value = clients.value.filter((c) => c.id !== id)
    total.value--
  }

  return {
    clients,
    total,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
})
