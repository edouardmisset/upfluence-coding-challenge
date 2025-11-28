# Copilot Instructions

You are an expert AI programming assistant working on the **Upfluence Coding Challenge**.
Your goal is to help the user build a production-ready, high-performance real-time visualization application.

## Project Architecture & Tech Stack

This project is a **Monorepo** managed with **Turbo** and **pnpm**.

### Structure

- **`apps/web`**: The frontend application.
  - **Framework**: **Astro** (App Shell) + **React**, **Vue**, **Svelte** (Interactive Viz).
  - **Path**: `apps/web/`
  - **Key Files**:
    - `src/pages/index.astro`: Main entry point.
    - `src/react-viz/`: React components and hooks.
    - `src/svelte-viz/`: Svelte components and state.
    - `src/vue-viz/`: Vue components and composables.
- **`packages/core`**: Pure TypeScript business logic.
  - **Purpose**: Handles SSE streaming, data aggregation, and validation.
  - **Path**: `packages/core/`
  - **Testing**: **Vitest**.
- **`packages/styles`**: Shared CSS.
  - **Path**: `packages/styles/`
  - **Methodology**: Plain CSS with CSS Variables.

### Key Technologies

- **Language**: TypeScript (Strict mode).
- **Validation**: Zod.
- **Testing**: Vitest (Unit), Playwright (E2E).
- **Linting**: ESLint, Prettier, Stylelint.

## Development Workflow

- **Start Development**: `pnpm dev` (Runs all apps/packages in watch mode).
- **Run Tests**: `pnpm test` (Runs Vitest).
- **Type Check**: `pnpm type-check`.
- **Lint**: `pnpm lint`.
- **Full Check**: `pnpm check` (Format, Lint, Type-check, Test).
- **Benchmark**: `pnpm benchmark` (Runs performance benchmarks).

## Coding Guidelines

1.  **Separation of Concerns**:
    - **Logic**: Place complex logic (data processing, stream handling) in `packages/core`.
    - **UI**: Place components in `apps/web`.
    - **Styles**: Define styles in `packages/styles` and import them.

2.  **Data Flow**:
    - The app consumes a Server-Sent Events (SSE) stream.
    - Data is aggregated in real-time (bucketed by Post Type -> Day -> Hour).
    - React components subscribe to these updates.

3.  **Performance**:
    - Ensure the UI handles high-frequency updates efficiently.
    - Avoid unnecessary re-renders.

4.  **Quality**:
    - Write tests for all the logic in `packages/core`.
    - Ensure accessibility (ARIA labels) for UI components.
    - Handle error states (connection loss, malformed data) gracefully.

---

## Domain Requirements (Reference)

**Core Goal**: Visualize social media posts in 3D using real-time SSE streaming data.

**Data Source**: `https://stream.upfluence.co/stream`
**Post Types**: `pin`, `instagram_media`, `youtube_video`, `article`, `tweet`, `facebook_status`...

**Visualization**:

- Dimensions: Day of week × Hour of day (UTC) × Post count.
- Latency: ≤5 seconds from stream reception to UI update.

**Evaluation Criteria**:

1.  Architecture & Separation of Concerns.
2.  Code Quality & Simplicity.
3.  Correctness & Performance.
4.  UX & Polish.
