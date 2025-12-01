# Vue Visualization Implementation

This directory contains the Vue implementation of the real-time visualization
dashboard. It uses **Vue 3** with the **Composition API**.

## Key Features Used

### 1. Composition API (`<script setup>`)

We use the `<script setup>` syntax for a more concise and ergonomic way to write
components. This allows us to define reactive state, computed properties, and
lifecycle hooks directly.

- **`ref`**: Used to create reactive state variables (e.g., `error` in
  `app.vue`, `state` in `useStreamService`).
- **`computed`**: Used to derive values based on reactive state (e.g.,
  `maxCount` in `weekly-calendar-graph.vue`).
- **Lifecycle Hooks**: `onMounted` and `onUnmounted` are used to manage the
  stream connection lifecycle.

### 2. Composables

We extract the stream logic into a reusable **Composable** function,
`useStreamService` (in `composables/use-stream-service.ts`). This encapsulates
the state and logic for connecting to the SSE stream, making the components
cleaner and the logic reusable.

### 3. Error Handling with `onErrorCaptured`

Since Vue doesn't have a built-in "Error Boundary" component like React or
Svelte 5, we use the `onErrorCaptured` hook in `app.vue` to catch errors from
descendant components. This allows us to display an `ErrorFallback` component
when an error occurs.

## Structure

- **`app.vue`**: The root component that handles error capturing and renders the
  dashboard.
- **`components/`**: UI components for the dashboard.
- **`composables/`**: Contains the `useStreamService` composable for managing
  the SSE stream.
