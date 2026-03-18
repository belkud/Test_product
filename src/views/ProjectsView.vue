<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <el-radio-group v-model="viewMode" size="default">
          <el-radio-button label="kanban">
            <el-icon>
              <Grid />
            </el-icon> Kanban
          </el-radio-button>
          <el-radio-button label="table">
            <el-icon>
              <List />
            </el-icon> Table
          </el-radio-button>
        </el-radio-group>
        <el-select v-model="statusFilter" placeholder="All Statuses" clearable style="width: 150px">
          <el-option label="Planning" value="planning" />
          <el-option label="In Progress" value="in-progress" />
          <el-option label="Review" value="review" />
          <el-option label="Completed" value="completed" />
          <el-option label="On Hold" value="on-hold" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        New Project
      </el-button>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="flex gap-4 overflow-x-auto pb-4">
      <div v-for="column in columns" :key="column.status" class="flex-shrink-0 w-80 bg-gray-100 rounded-xl p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div :class="['w-3 h-3 rounded-full', column.color]" />
            <h3 class="font-semibold text-gray-700">{{ column.title }}</h3>
            <el-tag size="small" type="info">{{ getProjectsByStatus(column.status).length }}</el-tag>
          </div>
        </div>

        <draggable :list="getProjectsByStatus(column.status)" :group="'projects'" item-key="id"
          class="space-y-3 min-h-[200px]" @change="(e: any) => onDragChange(e, column.status)">
          <template #item="{ element }">
            <div
              class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-2">
                <el-tag :type="getPriorityType(element.priority)" size="small">
                  {{ element.priority }}
                </el-tag>
                <div class="flex items-center gap-1">
                  <el-button link type="primary" :icon="Edit" size="small" @click="openEditDialog(element)" />
                  <el-button link type="danger" :icon="Delete" size="small" @click="confirmDelete(element)" />
                </div>
              </div>

              <h4 class="font-medium text-gray-800 mb-1">{{ element.name }}</h4>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ element.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <el-avatar v-for="member in element.team.slice(0, 3)" :key="member" :size="24"
                    :src="getAvatar(member)">
                    {{ String.fromCharCode(65 + member) }}
                  </el-avatar>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(element.startDate) }}</span>
              </div>

              <div class="mt-3">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500">Progress</span>
                  <span class="font-medium">{{ element.progress }}%</span>
                </div>
                <el-progress :percentage="element.progress" :stroke-width="6" :show-text="false" />
              </div>

              <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{{ element.clientName }}</span>
                <span class="font-medium">{{ formatCurrency(element.budget) }}</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100">
      <el-table v-loading="loading" :data="filteredProjects" style="width: 100%">
        <el-table-column prop="name" label="Project" min-width="200">
          <template #default="{ row }">
            <div>
              <p class="font-medium">{{ row.name }}</p>
              <p class="text-sm text-gray-500">{{ row.clientName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="Priority" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="Progress" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :status="row.progress === 100 ? 'success' : undefined" />
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="Budget" width="120">
          <template #default="{ row }">
            {{ formatCurrency(row.budget) }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="Start Date" width="120">
          <template #default="{ row }">
            {{ formatDate(row.startDate) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)" />
            <el-button link type="danger" :icon="Delete" @click="confirmDelete(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? 'Edit Project' : 'New Project'" width="600px"
      @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="Project Name" prop="name">
          <el-input v-model="formData.name" placeholder="Website Redesign" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="Project description..." />
        </el-form-item>

        <el-form-item label="Client" prop="clientId">
          <el-select v-model="formData.clientId" placeholder="Select client" style="width: 100%">
            <el-option v-for="client in clientsStore.clients" :key="client.id" :label="client.name"
              :value="client.id" />
          </el-select>
        </el-form-item>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Status" prop="status">
            <el-select v-model="formData.status" placeholder="Select" style="width: 100%">
              <el-option label="Planning" value="planning" />
              <el-option label="In Progress" value="in-progress" />
              <el-option label="Review" value="review" />
              <el-option label="Completed" value="completed" />
              <el-option label="On Hold" value="on-hold" />
            </el-select>
          </el-form-item>

          <el-form-item label="Priority" prop="priority">
            <el-select v-model="formData.priority" placeholder="Select" style="width: 100%">
              <el-option label="Low" value="low" />
              <el-option label="Medium" value="medium" />
              <el-option label="High" value="high" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="Budget ($)" prop="budget">
          <el-input-number v-model="formData.budget" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Start Date" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" placeholder="Select date" style="width: 100%"
            value-format="YYYY-MM-DD" />
        </el-form-item>

        <el-form-item label="End Date" prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" placeholder="Select date" style="width: 100%"
            value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEditing ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Grid, List } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useProjectsStore } from '@/stores/projects'
import { useClientsStore } from '@/stores/clients'
import type { Project } from '@/types'
import { formatDate, formatCurrency, getStatusType, getPriorityType } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { projectSchema } from '@/validators/forms'
import * as yup from 'yup'

const projectsStore = useProjectsStore()
const clientsStore = useClientsStore()

const viewMode = ref<'kanban' | 'table'>('kanban')
const statusFilter = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

const formRef = ref<FormInstance>()

const formData = ref<Omit<Project, 'id' | 'progress' | 'team'>>({
  name: '',
  description: '',
  clientId: 0,
  clientName: '',
  status: 'planning',
  priority: 'medium',
  budget: 0,
  startDate: '',
  endDate: undefined,
})

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
  clientId: [{ required: true, message: 'Client is required', trigger: 'change' }],
  status: [{ required: true, message: 'Status is required', trigger: 'change' }],
  priority: [{ required: true, message: 'Priority is required', trigger: 'change' }],
  budget: [{ required: true, message: 'Budget is required', trigger: 'blur' }],
  startDate: [{ required: true, message: 'Start date is required', trigger: 'change' }],
}))

const columns = [
  { status: 'planning', title: 'Planning', color: 'bg-indigo-500' },
  { status: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { status: 'review', title: 'Review', color: 'bg-yellow-500' },
  { status: 'completed', title: 'Completed', color: 'bg-green-500' },
  { status: 'on-hold', title: 'On Hold', color: 'bg-red-500' },
]

const filteredProjects = computed(() => {
  let result = projectsStore.projects
  if (statusFilter.value) {
    result = result.filter((p) => p.status === statusFilter.value)
  }
  return result
})

function getProjectsByStatus(status: string) {
  let result = projectsStore.projects.filter((p) => p.status === status)
  if (statusFilter.value && statusFilter.value !== status) {
    return []
  }
  return result
}

function onDragChange(event: { added?: { element: Project }; moved?: { element: Project } }, newStatus: string) {
  if (event.added || event.moved) {
    const project = event.added?.element || event.moved?.element
    if (project) {
      projectsStore.updateProjectStatus(project.id, newStatus as Project['status'])
      ElMessage.success(`Project moved to ${columns.find(c => c.status === newStatus)?.title}`)
    }
  }
}

function openCreateDialog() {
  isEditing.value = false
  dialogVisible.value = true
}

function openEditDialog(project: Project) {
  isEditing.value = true
  formData.value = {
    name: project.name,
    description: project.description,
    clientId: project.clientId,
    clientName: project.clientName,
    status: project.status,
    priority: project.priority,
    budget: project.budget,
    startDate: project.startDate,
    endDate: project.endDate,
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  formData.value = {
    name: '',
    description: '',
    clientId: 0,
    clientName: '',
    status: 'planning',
    priority: 'medium',
    budget: 0,
    startDate: '',
    endDate: undefined,
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true

    try {
      await projectSchema.validate(formData.value, { abortEarly: false })

      const client = clientsStore.clients.find(c => c.id === formData.value.clientId)
      const data = { ...formData.value, clientName: client?.name, progress: isEditing.value ? 0 : 0, team: [] } as Omit<Project, 'id'>

      if (isEditing.value) {
        await projectsStore.updateProject(1, data)
        ElMessage.success('Project updated successfully')
      } else {
        await projectsStore.createProject(data)
        ElMessage.success('Project created successfully')
      }

      dialogVisible.value = false
      resetForm()
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((msg) => ElMessage.error(msg))
      } else {
        ElMessage.error('Operation failed')
      }
    } finally {
      submitting.value = false
    }
  })
}

function confirmDelete(project: Project) {
  ElMessageBox.confirm(`Are you sure you want to delete "${project.name}"?`, 'Confirm Delete', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    await projectsStore.deleteProject(project.id)
    ElMessage.success('Project deleted successfully')
  }).catch(() => { })
}

function getAvatar(member: number) {
  return `https://i.pravatar.cc/150?img=${member + 1}`
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    projectsStore.fetchProjects(),
    clientsStore.fetchClients({ page: 1, limit: 100 }),
  ])
  loading.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
