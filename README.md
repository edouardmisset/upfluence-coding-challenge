# Upfluence Coding Challenge - Real-time Social Media Visualization

A high-performance, real-time 3D visualization of social media posts using
Server-Sent Events (SSE). Built with a modern monorepo architecture to
demonstrate production-ready patterns.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Astro](https://img.shields.io/badge/Astro-5.0-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Vue](https://img.shields.io/badge/Vue-3-green)
![Svelte](https://img.shields.io/badge/Svelte-5-orange)

## 🚀 Features

- **Real-time Visualization**: Updates instantly via SSE stream (<5s latency).
- **3D Weekly Calendar Graph**: Visualizes events by Day of Week × Hour of Day.
- **Multi-type Support**: Handles 9 distinct event types simultaneously.
- **High Performance**: Optimized aggregation engine handles 1000+ events/sec.
- **Resilience**: Automatic reconnection with exponential backoff.
- **Production Polish**: Error boundaries, loading states, and performance metrics.

## 🏗 Architecture

The project is a Monorepo managed by Turborepo and pnpm. It is designed to
strictly separate business logic from UI presentation, allowing the core logic
to be written once and reused across multiple frontend frameworks (React, Vue,
Svelte).

### Core Modules

1. core (The Brain)

- **Purpose**: Contains all the "smart" code. It is completely
  framework-agnostic (pure TypeScript).
- **Key Components**:
  - `SSEClient`: Manages the persistent connection to the Server-Sent Events
    stream, handling reconnection automatically.
  - `EventAccumulator`: An optimized in-memory data structure that aggregates
    high-frequency data into buckets (Event Type → Day of Week → Hour of Day).
  - `StreamService`: The orchestrator. It ties the client and accumulator
    together, manages the application state, and exposes a subscription API for
    the UI to listen to.
  - `Zod Schemas`: Ensures all incoming data is validated at runtime before
    being processed.

2. apps/web (The Presentation)

- **Purpose**: The user interface.
- **Framework**: Astro is used as the "App Shell" or container.
- **Integrations**: It hosts three separate implementations of the visualization
  dashboard:
  - React (src/react-viz)
  - Vue (src/vue-viz)
  - Svelte (src/svelte-viz)
- **Pattern**: Each framework implementation consumes the exact same
  `StreamService` from `packages/core`, proving the reusability of the logic.

3. packages/styles (The Look)

- **Purpose**: Shared design system.
- **Tech**: Plain CSS with CSS Variables.
- **Usage**: Ensures that the React, Vue, and Svelte versions look identical by
  sharing the same CSS tokens and layout classes.

### Data Flow

1. **Ingest**: The `SSEClient` receives a raw event from the stream.
2. **Validate**: The data is checked against `Zod` schemas.
3. **Aggregate**: The `EventAccumulator` increments the counter for the specific
  `[EventType][Day][Hour]` bucket. This happens in `O(1)` time.
4. **Broadcast**: The `StreamService` notifies all subscribed UI components of
the new state.
5. **Render**: The `WeeklyCalendarGraph` component (in React/Vue/Svelte) updates
   the CSS Grid to reflect the new event counts.

## 🛠 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/edouardmisset/upfluence-coding-challenge.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:4321/upfluence-coding-challenge/` to view the landing page.

## 🧪 Testing & Quality

The core logic is fully unit tested using Vitest.

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Run formatting
pnpm format
```

## 💡 Technical Decisions

| Decision             | Alternative   | Rationale                                                                          |
| -------------------- | ------------- | ---------------------------------------------------------------------------------- |
| **Monorepo**         | Single Repo   | Separates core logic from UI, enabling multi-framework implementations.            |
| **pnpm**             | npm/yarn      | Faster installation and efficient disk usage via content-addressable storage.      |
| **Zod**              | Manual Checks | Provides runtime type safety and automatic TypeScript type inference.              |
| **Astro**            | Vite/Next.js  | Lightweight container for multiple framework integrations (React, Vue, Svelte).    |
| **React/Vue/Svelte** | Ember         | Three frameworks implemented to demonstrate the architecture's flexibility.        |
| **CSS Grid**         | Canvas        | Sufficient performance for 7x24 grid while remaining accessible and easy to style. |

### Code Conventions

- **File Naming**: All files use `kebab-case` (e.g., `social-event-card.tsx`) to
  ensure consistent behavior across case-sensitive (Linux) and case-insensitive
  (macOS/Windows) file systems.

## ⚖️ Trade-offs

- **Memory Usage**: The aggregator keeps all data in memory. For a production
  app running for days, I would implement a sliding window (e.g., keep only last
  7 days) or persist to IndexedDB.
- **Visualization**: A Canvas-based approach (like Visx or raw Canvas) would be
  more performant for massive datasets, but DOM nodes are sufficient for this
  specific grid size (168 cells per card).
- **State Management**: Used React Context/Local State for simplicity. For a
  larger app, I would reach for Zustand or TanStack Query.

## 🔮 Future Improvements

- **Ember Implementation**: Add an Ember.js visualization to demonstrate
  additional framework versatility (React, Vue, and Svelte are already
  implemented).
- **Data Persistence**: Save aggregated state to `localStorage` to survive
  refreshes.
- **Dark Mode**: Dark theming toggle.

## 👤 Author

Edouard Misset

---

_Built for the Upfluence Coding Challenge._

## Disclaimer

Some code was generated with the help of AI tools (GitHub Copilot) to accelerate
development. All code has been reviewed and adjusted by the author to ensure
quality and correctness.
