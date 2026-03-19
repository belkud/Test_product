<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="YYYY-MM-DD"
          style="width: 240px"
        />
        <el-select v-model="metricType" placeholder="Metric" style="width: 150px">
          <el-option label="Revenue" value="revenue" />
          <el-option label="Clients" value="clients" />
          <el-option label="Projects" value="projects" />
          <el-option label="Tasks" value="tasks" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Download" @click="exportData">
        Export
      </el-button>
    </div>

    
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p class="text-sm text-gray-500">Total Revenue</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">$284,500</p>
        <p class="text-sm text-green-500 mt-1">↑ 18% from previous period</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p class="text-sm text-gray-500">New Clients</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">47</p>
        <p class="text-sm text-green-500 mt-1">↑ 12% from previous period</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p class="text-sm text-gray-500">Projects Completed</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">23</p>
        <p class="text-sm text-green-500 mt-1">↑ 8% from previous period</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p class="text-sm text-gray-500">Tasks Completed</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">312</p>
        <p class="text-sm text-red-500 mt-1">↓ 3% from previous period</p>
      </div>
    </div>

    <!-- Main Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Trend -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
        <v-chart class="h-80" :option="revenueChartOption" autoresize />
      </div>

      <!-- Client Growth -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Client Growth</h3>
        <v-chart class="h-80" :option="clientChartOption" autoresize />
      </div>
    </div>

    <!-- Project Status & Task Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Project Status -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Project Status</h3>
        <v-chart class="h-64" :option="projectPieOption" autoresize />
      </div>

      <!-- Task Completion -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Task Completion Rate</h3>
        <v-chart class="h-64" :option="taskGaugeOption" autoresize />
      </div>

      <!-- Priority Distribution -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Tasks by Priority</h3>
        <v-chart class="h-64" :option="priorityBarOption" autoresize />
      </div>
    </div>

    <!-- Monthly Comparison -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
      <v-chart class="h-80" :option="monthlyChartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatCurrency } from '@/utils/helpers'

const dateRange = ref<[string, string]>()
const metricType = ref('revenue')

const revenueChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (value: number) => `$${value / 1000}k` },
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
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ],
        },
      },
    },
  ],
}))

const clientChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
  },
  series: [
    {
      name: 'New Clients',
      type: 'bar',
      barWidth: '40%',
      data: [4, 8, 7, 5, 9, 6, 8, 10, 7, 12, 9, 11],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#6366f1' },
          ],
        },
      },
    },
  ],
}))

const projectPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [
    {
      name: 'Projects',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
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

const taskGaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: { color: '#10b981' },
      progress: { show: true, width: 18 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '20%'],
        fontSize: 30,
        fontWeight: 'bold',
        formatter: '{value}%',
        color: '#1f2937',
      },
      title: { show: false },
      data: [{ value: 78 }],
    },
  ],
}))

const priorityBarOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } } },
  yAxis: {
    type: 'category',
    data: ['High', 'Medium', 'Low'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  series: [
    {
      name: 'Tasks',
      type: 'bar',
      data: [
        { value: 15, itemStyle: { color: '#ef4444' } },
        { value: 28, itemStyle: { color: '#f59e0b' } },
        { value: 22, itemStyle: { color: '#3b82f6' } },
      ],
      barWidth: '40%',
      showBackground: true,
      backgroundStyle: { color: 'rgba(0, 0, 0, 0.05)', borderRadius: 4 },
    },
  ],
}))

const monthlyChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Revenue', 'Projects', 'Tasks'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Revenue',
      position: 'left',
      axisLabel: { formatter: (value: number) => `$${value / 1000}k` },
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
    },
    {
      type: 'value',
      name: 'Count',
      position: 'right',
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      data: [50000, 65000, 58000, 72000, 68000, 85000],
      itemStyle: { color: '#3b82f6' },
      areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
    },
    {
      name: 'Projects',
      type: 'bar',
      yAxisIndex: 1,
      data: [8, 10, 9, 12, 11, 14],
      itemStyle: { color: '#8b5cf6' },
    },
    {
      name: 'Tasks',
      type: 'bar',
      yAxisIndex: 1,
      data: [32, 38, 35, 45, 42, 52],
      itemStyle: { color: '#10b981' },
    },
  ],
}))

function exportData() {
  ElMessage.success('Export started. File will be downloaded shortly.')
}
</script>
