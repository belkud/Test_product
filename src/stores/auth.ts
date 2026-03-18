import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types'
import { authApi } from '@/api/endpoints'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginCredentials) {
    try {
      // Mock login for demo
      const mockUser: User = {
        id: 1,
        email: credentials.email,
        name: 'John Doe',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=12',
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      user.value = mockUser
      token.value = mockToken
      localStorage.setItem('token', mockToken)

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      // Mock user fetch
      user.value = {
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=12',
      }
    } catch (error) {
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
})
