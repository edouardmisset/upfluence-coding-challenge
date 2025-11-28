<script setup lang="ts">
defineProps<{
  error: Error
  resetErrorBoundary: () => void
}>()
</script>

<template>
  <div class="error-fallback" role="alert">
    <h2>Something went wrong.</h2>
    <p>{{ error.message }}</p>
    <button @click="resetErrorBoundary">Try again</button>
  </div>
</template>
