<script lang="ts">
  import Dashboard from './components/Dashboard.svelte'
  import ErrorFallback from './components/ErrorFallback.svelte'
</script>

<svelte:boundary>
  <Dashboard />
  {#snippet failed(error, reset)}
    <ErrorFallback {error} resetErrorBoundary={reset} />
  {/snippet}
</svelte:boundary>
