<svelte:options runes={true} />

<script lang="ts">
  import Dashboard from './components/dashboard.svelte'
  import ErrorFallback from './components/error-fallback.svelte'
</script>

<svelte:boundary>
  <Dashboard />
  {#snippet failed(error, reset)}
    <ErrorFallback error={error as Error} resetErrorBoundary={reset} />
  {/snippet}
</svelte:boundary>
