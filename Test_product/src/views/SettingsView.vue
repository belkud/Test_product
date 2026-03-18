<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Profile Section -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

      <div class="flex items-center gap-6 mb-6">
        <el-avatar :size="100" :src="user?.avatar">
          {{ user?.name ? getInitials(user.name) : 'U' }}
        </el-avatar>
        <div>
          <el-button type="primary" size="small">Change Avatar</el-button>
          <p class="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="120px">
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="profileForm.name" placeholder="John Doe" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="profileForm.email" type="email" placeholder="john@example.com" />
        </el-form-item>

        <el-form-item label="Phone">
          <el-input v-model="profileForm.phone" placeholder="+1 234 567 890" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="profileLoading" @click="saveProfile">
            Save Changes
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Password Section -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>

      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="150px">
        <el-form-item label="Current Password" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" placeholder="••••••••" show-password />
        </el-form-item>

        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="••••••••" show-password />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="••••••••" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="passwordLoading" @click="changePassword">
            Update Password
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Preferences Section -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Preferences</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">Email Notifications</p>
            <p class="text-sm text-gray-500">Receive email updates about your projects</p>
          </div>
          <el-switch v-model="preferences.emailNotifications" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">Task Reminders</p>
            <p class="text-sm text-gray-500">Get reminded about pending tasks</p>
          </div>
          <el-switch v-model="preferences.taskReminders" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">Dark Mode</p>
            <p class="text-sm text-gray-500">Toggle dark theme</p>
          </div>
          <el-switch v-model="isDark" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">Language</p>
            <p class="text-sm text-gray-500">Select your preferred language</p>
          </div>
          <el-select v-model="preferences.language" style="width: 150px">
            <el-option label="English" value="en" />
            <el-option label="Spanish" value="es" />
            <el-option label="French" value="fr" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-red-100">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
      <p class="text-sm text-gray-500 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <el-button type="danger" @click="confirmDeleteAccount">Delete Account</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from '@vueuse/core'
import { getInitials } from '@/utils/helpers'
import { ElMessage, ElMessageBox } from 'element-plus'
import { profileSchema, passwordSchema } from '@/validators/forms'
import * as yup from 'yup'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const isDark = useDark()
const toggleTheme = useToggle(isDark)

const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const profileLoading = ref(false)
const passwordLoading = ref(false)

const profileForm = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 234 567 890',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const preferences = reactive({
  emailNotifications: true,
  taskReminders: true,
  language: 'en',
})

const profileRules = computed<FormRules>(() => ({
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
}))

const passwordRules = computed<FormRules>(() => ({
  currentPassword: [{ required: true, message: 'Current password is required', trigger: 'blur' }],
  newPassword: [{ required: true, message: 'New password is required', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: 'Please confirm your password', trigger: 'blur' }],
}))

async function saveProfile() {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (!valid) return

    profileLoading.value = true

    try {
      await profileSchema.validate(profileForm, { abortEarly: false })
      ElMessage.success('Profile updated successfully')
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((msg) => ElMessage.error(msg))
      } else {
        ElMessage.error('Failed to update profile')
      }
    } finally {
      profileLoading.value = false
    }
  })
}

async function changePassword() {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return

    passwordLoading.value = true

    try {
      await passwordSchema.validate(passwordForm, { abortEarly: false })
      ElMessage.success('Password changed successfully')
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((msg) => ElMessage.error(msg))
      } else {
        ElMessage.error('Failed to change password')
      }
    } finally {
      passwordLoading.value = false
    }
  })
}

function confirmDeleteAccount() {
  ElMessageBox.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.',
    'Delete Account',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'error',
    }
  ).then(() => {
    ElMessage.info('Account deletion is not implemented in demo mode')
  }).catch(() => { })
}
</script>
