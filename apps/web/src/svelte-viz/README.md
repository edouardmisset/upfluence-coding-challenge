# Svelte Visualization Implementation

This directory contains the Svelte implementation of the real-time visualization
dashboard. It leverages the latest features of **Svelte 5**.

## Key Features Used

### 1. Runes (`$state`, `$derived`, `$props`)

We use Svelte 5's new reactivity system, **Runes**, to handle state management
and derived values efficiently.

- **`$state`**: Used in `state/stream-service.svelte.ts` to create a reactive
  state object for the stream data. This allows fine-grained reactivity without
  the need for stores.
- **`$derived`**: Used in components like `weekly-calendar-graph.svelte` to
  automatically recalculate values (e.g., `maxCount`) whenever dependencies
  change.
- **`$props`**: Used to declare component props in a type-safe manner.

### 2. Shared State with `.svelte.ts` Modules

Instead of using Svelte stores (`writable`, `readable`), we use a `.svelte.ts`
module (`state/stream-service.svelte.ts`) to encapsulate the stream logic. This
module exports a function `createStreamState` that returns a reactive state
object, making it easy to share state across components.

### 3. Error Handling with `<svelte:boundary>`

We use the new `<svelte:boundary>` component in `app.svelte` to catch errors in
the component tree. This provides a declarative way to handle runtime errors and
display a fallback UI (`ErrorFallback`) without crashing the entire application.

### 4. Snippets (`#snippet`)

We use snippets to pass UI fragments, such as the error fallback content in
`app.svelte`.

## Structure

- **`app.svelte`**: The root component that sets up the error boundary and
  renders the dashboard.
- **`components/`**: UI components for the dashboard.
- **`state/`**: Contains the `stream-service.svelte.ts` module for managing the
  SSE stream connection and data.
