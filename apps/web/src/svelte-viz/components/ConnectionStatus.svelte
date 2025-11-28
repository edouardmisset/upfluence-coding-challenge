<script lang="ts">
  let { isConnected }: { isConnected: boolean } = $props()
</script>

<div
  class="connection-status"
  data-connected={isConnected}
  role="status"
  aria-live="polite"
>
  <span class="connection-status-indicator"></span>
  {isConnected ? 'Live Stream' : 'Connecting...'}
</div>
