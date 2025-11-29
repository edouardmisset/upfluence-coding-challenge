<script lang="ts">
  let {
    error,
    resetErrorBoundary,
  }: { error: Error; resetErrorBoundary: () => void } = $props()
</script>

<div class="error-fallback" role="alert">
  <h2>Something went wrong.</h2>
  <p>{error.message}</p>
  <button onclick={resetErrorBoundary}>Try again</button>
</div>
