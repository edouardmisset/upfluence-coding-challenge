import { ref, onMounted, onUnmounted } from 'vue'
import {
  createStreamService,
  type StreamService,
  type StreamState,
  STREAM_URL,
} from '@upfluence/core'

export const useStreamService = () => {
  const serviceRef = ref<StreamService | null>(null)
  const state = ref<StreamState>({
    isConnected: false,
    accumulator: {},
    totals: {},
    eventsPerSecond: 0,
    totalEvents: 0,
  } as StreamState)

  onMounted(() => {
    const service = createStreamService(STREAM_URL)
    serviceRef.value = service

    const unsubscribe = service.subscribe((newState) => {
      state.value = newState
    })
    service.connect()

    onUnmounted(() => {
      unsubscribe()
      service.disconnect()
      serviceRef.value = null
    })
  })

  return state
}
