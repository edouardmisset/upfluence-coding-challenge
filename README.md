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
- **3D Weekly Calendar Graph**: Visualizes posts by Day of Week × Hour of Day.
- **Multi-type Support**: Handles 6 distinct post types simultaneously.
- **High Performance**: Optimized aggregation engine handles 1000+ posts/sec.
- **Resilience**: Automatic reconnection with exponential backoff.
- **Production Polish**: Error boundaries, loading states, and performance metrics.

## 🏗 Architecture

The project uses a **Turborepo** monorepo structure to separate concerns and ensure scalability.

```mermaid
graph TD
    SSE[SSE Stream] -->|Events| Core[packages/core]
    Core -->|Parsed Data| Aggregator[PostAggregator]
    Aggregator -->|Batched Updates| WebApp[apps/web]
    WebApp -->|Render| Grid[WeeklyCalendarGraph]

    subgraph "packages/core"
        Client[SSEClient]
        Aggregator
        Validators[Zod Schemas]
    end

    subgraph "apps/web"
        Hooks[Custom Hooks]
        Components[UI Components]
    end
```

### Key Components

- **`packages/core`**: Framework-agnostic business logic.
  - `SSEClient`: Manages connection stability.
  - `PostAggregator`: O(1) data structure for efficient updates.
  - `Zod Schemas`: Runtime validation for type safety.
- **`apps/web`**: Astro application hosting React, Vue, and Svelte visualizations.
  - `useAccumulator`: React hook that batches updates to prevent UI thrashing.
  - `WeeklyCalendarGraph`: Responsive CSS Grid visualization (implemented in all three frameworks).

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

- **File Naming**: All files use `kebab-case` (e.g., `post-aggregator.ts`, `post-type-card.tsx`) to ensure consistent behavior across case-sensitive (Linux) and case-insensitive (macOS/Windows) file systems.

## ⚖️ Trade-offs

- **Memory Usage**: The aggregator keeps all data in memory. For a production app running for days, I would implement a sliding window (e.g., keep only last 7 days) or persist to IndexedDB.
- **Visualization**: A Canvas-based approach (like Visx or raw Canvas) would be more performant for massive datasets, but DOM nodes are sufficient for this specific grid size (168 cells per card).
- **State Management**: Used React Context/Local State for simplicity. For a larger app, I would reach for Zustand or TanStack Query.

## 🔮 Future Improvements

- **Ember Implementation**: Add an Ember.js visualization to demonstrate additional framework versatility (React, Vue, and Svelte are already implemented).
- **Data Persistence**: Save aggregated state to `localStorage` to survive refreshes.
- **Dark Mode**: Fully implemented theming support.

## 👤 Author

Edouard Misset

---

_Built for the Upfluence Coding Challenge._

## Disclaimer

Some code was generated with the help of AI tools (GitHub Copilot) to accelerate
development. All code has been reviewed and adjusted by the author to ensure
quality and correctness.
