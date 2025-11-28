<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import Dashboard from './components/Dashboard.vue'
import ErrorFallback from './components/ErrorFallback.vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  return false // prevent propagation
})

const resetErrorBoundary = () => {
  error.value = null
}
</script>

<template>
  <ErrorFallback
    v-if="error"
    :error="error"
    :resetErrorBoundary="resetErrorBoundary"
  />
  <Dashboard v-else />
</template>
