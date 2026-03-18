<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside :class="[
      'bg-slate-900 text-white transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    ]">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
        <div
          class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">CS</span>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="font-semibold text-lg whitespace-nowrap">CoreSoft</span>
        </transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1 px-2">
          <li v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" class="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group"
              :class="$route.path === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                ">
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
              <transition name="fade">
                <span v-if="!isCollapsed" class="font-medium">{{ item.title }}</span>
              </transition>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User section -->
      <div class="p-4 border-t border-slate-700">
        <div class="flex items-center gap-3">
          <el-avatar :size="36" :src="user?.avatar">
            {{ user?.name ? getInitials(user.name) : 'U' }}
          </el-avatar>
          <transition name="fade">
            <div v-if="!isCollapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ user?.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <el-icon :size="20">
                <Fold v-if="!isCollapsed" />
                <Expand v-else />
              </el-icon>
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
                <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Theme toggle -->
            <el-button text @click="() => toggleTheme()">
              <el-icon :size="20">
                <Moon v-if="isDark" />
                <Sunny v-else />
              </el-icon>
            </el-button>

            <!-- Notifications -->
            <el-badge :value="3" :max="99" class="relative">
              <el-button text>
                <el-icon :size="20">
                  <Bell />
                </el-icon>
              </el-button>
            </el-badge>

            <!-- Logout -->
            <el-button @click="handleLogout" type="info" :icon="SwitchButton">
              Logout
            </el-button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from '@vueuse/core'
import {
  DataAnalysis,
  User,
  Folder,
  List,
  TrendCharts,
  Setting,
  Fold,
  Expand,
  Moon,
  Sunny,
  Bell,
  SwitchButton,
} from '@element-plus/icons-vue'
import { getInitials } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const isDark = useDark()
const toggleTheme = useToggle(isDark)

const user = computed(() => authStore.user)

const menuItems = [
  { path: '/dashboard', title: 'Dashboard', icon: DataAnalysis },
  { path: '/clients', title: 'Clients', icon: User },
  { path: '/projects', title: 'Projects', icon: Folder },
  { path: '/tasks', title: 'Tasks', icon: List },
  { path: '/analytics', title: 'Analytics', icon: TrendCharts },
  { path: '/settings', title: 'Settings', icon: Setting },
]

const pageTitle = computed(() => {
  return (route.meta.title as string) || 'Dashboard'
})

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('Are you sure you want to logout?', 'Confirm', {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    })
    authStore.logout()
    ElMessage.success('Logged out successfully')
    router.push({ name: 'Login' })
  } catch {
    // Cancelled
  }
}
</script>
