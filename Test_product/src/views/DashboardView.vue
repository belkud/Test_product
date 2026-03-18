<template>
  <div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stat.value }}</p>
            <p :class="['text-sm mt-1', stat.trend >= 0 ? 'text-green-500' : 'text-red-500']">
              {{ stat.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% from last month
            </p>
          </div>
          <div :class="['p-4 rounded-full', stat.bgClass]">
            <el-icon :size="28" :class="stat.iconClass">
              <component :is="stat.icon" />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Revenue Overview</h2>
          <el-radio-group v-model="period" size="small">
            <el-radio-button label="week">Week</el-radio-button>
            <el-radio-button label="month">Month</el-radio-button>
            <el-radio-button label="year">Year</el-radio-button>
          </el-radio-group>
        </div>
        <v-chart class="h-80" :option="revenueChartOption" autoresize />
      </div>

      <!-- Projects Distribution -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Projects by Status</h2>
        <v-chart class="h-64" :option="pieChartOption" autoresize />
      </div>
    </div>

    <!-- Recent Activities & Tasks -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Recent Activities</h2>
          <el-link type="primary" :underline="false">View All</el-link>
        </div>
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
            <el-avatar :size="36" :src="activity.userAvatar">
              {{ getInitials(activity.userName) }}
            </el-avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800">
                <span class="font-medium">{{ activity.userName }}</span>
                {{ activity.action }}
                <span class="font-medium">{{ activity.target }}</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ formatRelativeDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Recent Tasks</h2>
          <el-link type="primary" :underline="false" @click="$router.push('/tasks')">View All</el-link>
        </div>
        <el-table :data="recentTasks" style="width: 100%" :show-header="false">
          <el-table-column prop="title" label="Task">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-tag :type="getPriorityType(row.priority)" size="small">{{ row.priority }}</el-tag>
                <span>{{ row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dueDate" label="Due" width="100">
            <template #default="{ row }">
              <span v-if="row.dueDate" class="text-sm text-gray-500">{{ formatDate(row.dueDate) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Clients Table Preview -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Top Clients</h2>
        <el-link type="primary" :underline="false" @click="$router.push('/clients')">View All</el-link>
      </div>
      <el-table :data="topClients" style="width: 100%">
        <el-table-column prop="name" label="Name" min-width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :size="32" :src="row.avatar">{{ getInitials(row.name) }}</el-avatar>
              <div>
                <p class="font-medium">{{ row.name }}</p>
                <p class="text-xs text-gray-500">{{ row.company }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Joined" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useClientsStore } from '@/stores/clients'
import type { Task, Client, Activity } from '@/types'
import { getInitials, formatDate, formatRelativeDate } from '@/utils/helpers'
import {
  User,
  Folder,
  List,
  Money,
  TrendCharts,
  PieChart,
} from '@element-plus/icons-vue'

const tasksStore = useTasksStore()
const clientsStore = useClientsStore()

const period = ref('month')

// Stats data
const stats = ref([
  { title: 'Total Clients', value: '254', trend: 12, icon: User, bgClass: 'bg-blue-100', iconClass: 'text-blue-600' },
  { title: 'Active Projects', value: '18', trend: 8, icon: Folder, bgClass: 'bg-purple-100', iconClass: 'text-purple-600' },
  { title: 'Pending Tasks', value: '47', trend: -5, icon: List, bgClass: 'bg-yellow-100', iconClass: 'text-yellow-600' },
  { title: 'Revenue', value: '$124,500', trend: 15, icon: Money, bgClass: 'bg-green-100', iconClass: 'text-green-600' },
])

// Activities mock data
const activities = ref<Activity[]>([
  { id: 1, userId: 1, userName: 'Alice Johnson', userAvatar: '', action: 'completed task', target: 'Design homepage', timestamp: new Date().toISOString() },
  { id: 2, userId: 2, userName: 'Bob Smith', userAvatar: '', action: 'added comment to', target: 'Project Alpha', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, userId: 3, userName: 'Carol White', userAvatar: '', action: 'created new', target: 'Marketing Campaign', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, userId: 4, userName: 'David Brown', userAvatar: '', action: 'uploaded files to', target: 'Brand Assets', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, userId: 5, userName: 'Eva Martinez', userAvatar: '', action: 'changed status of', target: 'Website Redesign', timestamp: new Date(Date.now() - 172800000).toISOString() },
])

// Recent tasks
const recentTasks = computed<Task[]>(() => tasksStore.tasks.slice(0, 5))

// Top clients
const topClients = ref<Client[]>([])

// Chart options
const revenueChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      data: [12000, 18000, 15000, 24000, 20000, 30000, 28000],
      itemStyle: { color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ],
        },
      },
    },
  ],
}))

const pieChartOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: { color: '#6b7280' },
  },
  series: [
    {
      name: 'Projects',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      data: [
        { value: 5, name: 'Planning', itemStyle: { color: '#6366f1' } },
        { value: 8, name: 'In Progress', itemStyle: { color: '#3b82f6' } },
        { value: 3, name: 'Review', itemStyle: { color: '#f59e0b' } },
        { value: 4, name: 'Completed', itemStyle: { color: '#10b981' } },
        { value: 2, name: 'On Hold', itemStyle: { color: '#ef4444' } },
      ],
    },
  ],
}))

function getPriorityType(priority: string) {
  const types: Record<string, any> = { low: 'info', medium: 'warning', high: 'danger' }
  return types[priority] || 'info'
}

function getStatusType(status: string) {
  const types: Record<string, any> = {
    active: 'success', inactive: 'info', pending: 'warning',
    'in-progress': 'primary', completed: 'success', planning: 'info',
    review: 'warning', 'on-hold': 'danger', todo: 'info', done: 'success',
  }
  return types[status] || 'info'
}

onMounted(async () => {
  await tasksStore.fetchTasks()
  await clientsStore.fetchClients({ page: 1, limit: 10 })
  topClients.value = clientsStore.clients.slice(0, 5)
})
</script>
