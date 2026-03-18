<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <el-select v-model="projectFilter" placeholder="All Projects" clearable style="width: 180px">
          <el-option v-for="project in projectsStore.projects" :key="project.id" :label="project.name"
            :value="project.id" />
        </el-select>
        <el-select v-model="assigneeFilter" placeholder="All Assignees" clearable style="width: 150px">
          <el-option label="Alice" value="Alice" />
          <el-option label="Bob" value="Bob" />
          <el-option label="Carol" value="Carol" />
          <el-option label="David" value="David" />
          <el-option label="Eva" value="Eva" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        New Task
      </el-button>
    </div>

    <!-- Kanban Board -->
    <div class="flex gap-6 overflow-x-auto pb-4">
      <!-- Todo Column -->
      <div class="flex-shrink-0 w-80">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gray-400" />
            <h3 class="font-semibold text-gray-700">To Do</h3>
            <el-tag size="small" type="info">{{ getTasksByStatus('todo').length }}</el-tag>
          </div>
        </div>

        <draggable :list="getTasksByStatus('todo')" group="tasks" item-key="id"
          class="space-y-3 min-h-[200px] bg-gray-50 rounded-xl p-3" @change="(e: any) => onDragChange(e, 'todo')">
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

              <h4 class="font-medium text-gray-800 mb-1">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ element.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <el-avatar v-if="element.assigneeName" :size="24"
                    :src="`https://i.pravatar.cc/150?u=${element.assigneeName}`">
                    {{ element.assigneeName[0] }}
                  </el-avatar>
                  <span class="text-xs text-gray-500">{{ element.projectName }}</span>
                </div>
                <span v-if="element.dueDate"
                  :class="['text-xs', isOverdue(element.dueDate) ? 'text-red-500' : 'text-gray-500']">
                  {{ formatDate(element.dueDate) }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- In Progress Column -->
      <div class="flex-shrink-0 w-80">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500" />
            <h3 class="font-semibold text-gray-700">In Progress</h3>
            <el-tag size="small" type="primary">{{ getTasksByStatus('in-progress').length }}</el-tag>
          </div>
        </div>

        <draggable :list="getTasksByStatus('in-progress')" group="tasks" item-key="id"
          class="space-y-3 min-h-[200px] bg-blue-50 rounded-xl p-3"
          @change="(e: any) => onDragChange(e, 'in-progress')">
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

              <h4 class="font-medium text-gray-800 mb-1">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ element.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <el-avatar v-if="element.assigneeName" :size="24"
                    :src="`https://i.pravatar.cc/150?u=${element.assigneeName}`">
                    {{ element.assigneeName[0] }}
                  </el-avatar>
                  <span class="text-xs text-gray-500">{{ element.projectName }}</span>
                </div>
                <span v-if="element.dueDate"
                  :class="['text-xs', isOverdue(element.dueDate) ? 'text-red-500' : 'text-gray-500']">
                  {{ formatDate(element.dueDate) }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Done Column -->
      <div class="flex-shrink-0 w-80">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <h3 class="font-semibold text-gray-700">Done</h3>
            <el-tag size="small" type="success">{{ getTasksByStatus('done').length }}</el-tag>
          </div>
        </div>

        <draggable :list="getTasksByStatus('done')" group="tasks" item-key="id"
          class="space-y-3 min-h-[200px] bg-green-50 rounded-xl p-3" @change="(e: any) => onDragChange(e, 'done')">
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

              <h4 class="font-medium text-gray-800 mb-1">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ element.description }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <el-avatar v-if="element.assigneeName" :size="24"
                    :src="`https://i.pravatar.cc/150?u=${element.assigneeName}`">
                    {{ element.assigneeName[0] }}
                  </el-avatar>
                  <span class="text-xs text-gray-500">{{ element.projectName }}</span>
                </div>
                <span v-if="element.dueDate"
                  :class="['text-xs', isOverdue(element.dueDate) ? 'text-red-500' : 'text-gray-500']">
                  {{ formatDate(element.dueDate) }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? 'Edit Task' : 'New Task'" width="550px" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="formData.title" placeholder="Task title" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="Task description..." />
        </el-form-item>

        <el-form-item label="Project" prop="projectId">
          <el-select v-model="formData.projectId" placeholder="Select project" style="width: 100%">
            <el-option v-for="project in projectsStore.projects" :key="project.id" :label="project.name"
              :value="project.id" />
          </el-select>
        </el-form-item>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Status" prop="status">
            <el-select v-model="formData.status" placeholder="Select" style="width: 100%">
              <el-option label="To Do" value="todo" />
              <el-option label="In Progress" value="in-progress" />
              <el-option label="Done" value="done" />
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

        <el-form-item label="Assignee" prop="assigneeName">
          <el-select v-model="formData.assigneeName" placeholder="Select assignee" clearable style="width: 100%">
            <el-option label="Alice" value="Alice" />
            <el-option label="Bob" value="Bob" />
            <el-option label="Carol" value="Carol" />
            <el-option label="David" value="David" />
            <el-option label="Eva" value="Eva" />
          </el-select>
        </el-form-item>

        <el-form-item label="Due Date" prop="dueDate">
          <el-date-picker v-model="formData.dueDate" type="date" placeholder="Select due date" style="width: 100%"
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import type { Task } from '@/types'
import { formatDate, getPriorityType, getStatusType } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { taskSchema } from '@/validators/forms'
import * as yup from 'yup'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

const projectFilter = ref<number | undefined>()
const assigneeFilter = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

const formRef = ref<FormInstance>()

const formData = ref<Omit<Task, 'id' | 'createdAt' | 'projectName'>>({
  title: '',
  description: '',
  projectId: 0,
  status: 'todo',
  priority: 'medium',
  assigneeName: undefined,
  dueDate: undefined,
})

const rules = computed<FormRules>(() => ({
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
  projectId: [{ required: true, message: 'Project is required', trigger: 'change' }],
  status: [{ required: true, message: 'Status is required', trigger: 'change' }],
  priority: [{ required: true, message: 'Priority is required', trigger: 'change' }],
}))

const filteredTasks = computed(() => {
  let result = tasksStore.tasks

  if (projectFilter.value) {
    result = result.filter((t) => t.projectId === projectFilter.value)
  }

  if (assigneeFilter.value) {
    result = result.filter((t) => t.assigneeName === assigneeFilter.value)
  }

  return result
})

function getTasksByStatus(status: string) {
  return filteredTasks.value.filter((t) => t.status === status)
}

function onDragChange(event: { added?: { element: Task }; moved?: { element: Task } }, newStatus: string) {
  if (event.added || event.moved) {
    const task = event.added?.element || event.moved?.element
    if (task) {
      tasksStore.updateTaskStatus(task.id, newStatus as Task['status'])
      const statusLabels: Record<string, string> = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' }
      ElMessage.success(`Task moved to ${statusLabels[newStatus]}`)
    }
  }
}

function openCreateDialog() {
  isEditing.value = false
  dialogVisible.value = true
}

function openEditDialog(task: Task) {
  isEditing.value = true
  formData.value = {
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority,
    assigneeName: task.assigneeName,
    dueDate: task.dueDate,
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  formData.value = {
    title: '',
    description: '',
    projectId: 0,
    status: 'todo',
    priority: 'medium',
    assigneeName: undefined,
    dueDate: undefined,
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true

    try {
      await taskSchema.validate(formData.value, { abortEarly: false })

      const project = projectsStore.projects.find(p => p.id === formData.value.projectId)
      const data = { ...formData.value, projectName: project?.name } as Omit<Task, 'id' | 'createdAt'>

      if (isEditing.value) {
        await tasksStore.updateTask(1, data)
        ElMessage.success('Task updated successfully')
      } else {
        await tasksStore.createTask(data)
        ElMessage.success('Task created successfully')
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

function confirmDelete(task: Task) {
  ElMessageBox.confirm(`Are you sure you want to delete "${task.title}"?`, 'Confirm Delete', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    await tasksStore.deleteTask(task.id)
    ElMessage.success('Task deleted successfully')
  }).catch(() => { })
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date()
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    tasksStore.fetchTasks(),
    projectsStore.fetchProjects(),
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
