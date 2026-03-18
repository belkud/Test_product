<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <el-input v-model="searchQuery" placeholder="Search clients..." :prefix-icon="Search" clearable
          style="width: 300px" />
        <el-select v-model="statusFilter" placeholder="Status" clearable style="width: 150px">
          <el-option label="Active" value="active" />
          <el-option label="Inactive" value="inactive" />
          <el-option label="Pending" value="pending" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Plus" @click="openCreateDialog">
        Add Client
      </el-button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <el-table v-loading="loading" :data="filteredClients" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column prop="name" label="Name" min-width="180" sortable>
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :size="40" :src="row.avatar">
                {{ getInitials(row.name) }}
              </el-avatar>
              <div>
                <p class="font-medium text-gray-800">{{ row.name }}</p>
                <p class="text-sm text-gray-500">{{ row.company }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" min-width="200" sortable />
        <el-table-column prop="phone" label="Phone" width="150" />
        <el-table-column prop="status" label="Status" width="120" sortable>
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created" width="120" sortable>
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEditDialog(row)" />
            <el-button link type="danger" :icon="Delete" @click="confirmDelete(row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t">
        <span class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, total) }} of {{ total }}
          entries
        </span>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next" :total="total" />
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? 'Edit Client' : 'Add New Client'" width="500px"
      @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="formData.name" placeholder="John Doe" />
        </el-form-item>

        <el-form-item label="Company" prop="company">
          <el-input v-model="formData.company" placeholder="Acme Inc" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" type="email" placeholder="john@example.com" />
        </el-form-item>

        <el-form-item label="Phone" prop="phone">
          <el-input v-model="formData.phone" placeholder="+1 234 567 890" />
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-select v-model="formData.status" placeholder="Select status" style="width: 100%">
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Pending" value="pending" />
          </el-select>
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
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useClientsStore } from '@/stores/clients'
import type { Client } from '@/types'
import { getInitials, formatDate, getStatusType } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as yup from 'yup'
import { clientSchema } from '@/validators/forms'

const clientsStore = useClientsStore()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

const formRef = ref<FormInstance>()

const formData = ref<Omit<Client, 'id' | 'createdAt'>>({
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'active',
})

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  company: [{ required: true, message: 'Company is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
  phone: [{ required: true, message: 'Phone is required', trigger: 'blur' }],
  status: [{ required: true, message: 'Status is required', trigger: 'change' }],
}))

const filteredClients = computed(() => {
  let result = clientsStore.clients

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter((c) => c.status === statusFilter.value)
  }

  return result
})

const total = computed(() => clientsStore.total)

function openCreateDialog() {
  isEditing.value = false
  dialogVisible.value = true
}

function openEditDialog(client: Client) {
  isEditing.value = true
  formData.value = {
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    status: client.status,
  }
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  formData.value = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true

    try {
      // Validate with yup
      await clientSchema.validate(formData.value, { abortEarly: false })

      if (isEditing.value) {
        const client = filteredClients.value.find((c, idx) => idx === (currentPage.value - 1) * pageSize.value)
        if (client) {
          await clientsStore.updateClient(client.id, formData.value)
          ElMessage.success('Client updated successfully')
        }
      } else {
        await clientsStore.createClient(formData.value)
        ElMessage.success('Client created successfully')
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

function confirmDelete(client: Client) {
  ElMessageBox.confirm(
    `Are you sure you want to delete ${client.name}?`,
    'Confirm Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    await clientsStore.deleteClient(client.id)
    ElMessage.success('Client deleted successfully')
  }).catch(() => { })
}

function handleSortChange(_event: any) {
  // Implement sorting logic if needed
}

onMounted(async () => {
  loading.value = true
  await clientsStore.fetchClients({ page: currentPage.value, limit: pageSize.value })
  loading.value = false
})
</script>
