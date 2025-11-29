<script setup lang="ts">
defineProps<{
  isConnected: boolean
}>()
</script>

<template>
  <div
    class="connection-status"
    :data-connected="isConnected"
    role="status"
    aria-live="polite"
  >
    <span class="connection-status-indicator" />
    {{ isConnected ? 'Live Stream' : 'Connecting...' }}
  </div>
</template>
