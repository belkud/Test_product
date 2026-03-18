<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
          <span class="text-white font-bold text-3xl">CS</span>
        </div>
        <h1 class="text-3xl font-bold text-white">CoreSoft Solutions</h1>
        <p class="text-white/80 mt-2">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="email">
            <el-input
              v-model="formData.email"
              placeholder="Email"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Password"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <div class="flex items-center justify-between mb-6">
            <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
            <el-link type="primary" :underline="false">Forgot password?</el-link>
          </div>

          <el-button
            type="primary"
            size="large"
            class="w-full"
            :loading="loading"
            @click="handleSubmit"
          >
            Sign In
          </el-button>
        </el-form>

        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 font-medium mb-2">Demo credentials:</p>
          <p class="text-xs text-gray-500">Email: any@example.com</p>
          <p class="text-xs text-gray-500">Password: any password (min 6 chars)</p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-white/70 text-sm mt-6">
        © 2024 CoreSoft Solutions. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/validators/forms'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const formData = reactive({
  email: '',
  password: '',
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
})

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      // Validate with yup
      await loginSchema.validate(formData, { abortEarly: false })

      const result = await authStore.login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        ElMessage.success('Welcome back!')
        const redirect = route.query.redirect as string
        router.push(redirect || '/dashboard')
      } else {
        ElMessage.error('Login failed. Please try again.')
      }
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((msg) => ElMessage.error(msg))
      } else {
        ElMessage.error('Login failed. Please try again.')
      }
    } finally {
      loading.value = false
    }
  })
}

import * as yup from 'yup'
</script>
