<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <el-result icon="warning" :title="title" :sub-title="subtitle">
        <template #extra>
          <el-button type="primary" @click="goHome">Back to Home</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  title?: string
  subtitle?: string
}>()

const title = computed(() => props.title || '404 Not Found')
const subtitle = computed(() => props.subtitle || 'The page you are looking for does not exist.')

function goHome() {
  router.push('/dashboard')
}
</script>
