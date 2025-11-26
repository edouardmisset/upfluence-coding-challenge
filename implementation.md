# Implementation Plan

## Architecture Overview

**Turborepo monorepo** with clear separation of concerns:

- Shared core logic package (framework-agnostic)
- Multiple app packages for comparison/benchmarking
- Landing page (vanilla HTML/CSS/JS)
- React visualization app (primary implementation)

### Monorepo Structure

```text
upfluence-challenge/
├── apps/
│   ├── landing/              # Static landing page
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── main.js
│   ├── react-viz/            # React SPA (primary)
│   │   ├── src/
│   │   │   ├── components/   # Visualization, PunchCard, Counter
│   │   │   ├── hooks/        # useSSEStream, useAggregator
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── ember-viz/            # Optional: Ember implementation (bonus)
│       └── ...
├── packages/
│   ├── core/                 # Shared business logic
│   │   ├── src/
│   │   │   ├── stream/       # SSE connection manager
│   │   │   │   ├── SSEClient.ts
│   │   │   │   └── ConnectionManager.ts
│   │   │   ├── aggregator/   # Data aggregation logic
│   │   │   │   ├── PostAggregator.ts
│   │   │   │   └── types.ts
│   │   │   ├── validators/   # Zod schemas
│   │   │   │   └── schemas.ts
│   │   │   └── utils/        # Time utilities, constants
│   │   │       ├── timeUtils.ts
│   │   │       └── constants.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui-components/        # Optional: Shared React components
│   │   └── ...
│   └── tsconfig/             # Shared TypeScript configs
│       └── base.json
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── README.md
└── .github/
    └── copilot-instructions.md
```

## Package Details

### `packages/core` - Business Logic (Framework-Agnostic)

**Key Responsibilities:**

- SSE connection management with reconnection logic
- Post validation using Zod schemas
- Data aggregation (post type → day → hour → count)
- Time utilities (UNIX → UTC conversion)
- Export-ready TypeScript interfaces

**Core Modules:**

```typescript
// stream/SSEClient.ts
export class SSEClient {
  constructor(url: string, options?: SSEOptions)
  connect(): void
  disconnect(): void
  onMessage(callback: (data: Post) => void): void
  onError(callback: (error: Error) => void): void
  onConnectionChange(callback: (status: ConnectionStatus) => void): void
}

// aggregator/PostAggregator.ts
export class PostAggregator {
  increment(postType: PostType, timestamp: number): void
  getData(): AggregatedData
  getTotal(postType: PostType): number
  clear(): void
  setRetentionWindow(hours: number): void
}

// validators/schemas.ts
export const PostSchema = z.object({
  [z.enum(['tweet', 'pin', ...])]: z.object({
    timestamp: z.number(),
    // ... other fields
  })
})
```

**Dependencies:**

- `zod` - Schema validation

**Package Manager:** pnpm (fast, disk-efficient, strict dependency resolution)

### `apps/landing` - Static Landing Page

**Purpose:** Clean entry point with project context

**Features:**

- Hero section with challenge description
- Link to `/viz` (React app)
- Optional: Links to multiple implementations for comparison
- Tech stack badges (React, TypeScript, Turborepo, etc.)
- GitHub repository link

**Tech:** Pure HTML/CSS/JS (fast load, minimal overhead)

### `apps/react-viz` - React Visualization (Primary)

**Purpose:** Production-quality SSE visualization app

**Tech Stack:**

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast dev server & build
- **TanStack Query** (optional) - For connection state management
- **Manual** - Punch card visualization
- **CSS** - Styling
- **Vitest + React Testing Library** - Testing

**Key Components:**

```tsx
// App.tsx - Main orchestrator
// PunchCardGrid.tsx - 7×24 grid visualization
// PostTypeCard.tsx - Individual post type viz + counter
// ConnectionStatus.tsx - Live/Reconnecting indicator
// ErrorBoundary.tsx - Graceful error handling
```

**Hooks:**

```tsx
// useSSEStream.ts - Wraps core SSEClient
// useAggregator.ts - Wraps core PostAggregator
// usePerformanceMetrics.ts - Track posts/sec, latency
```

### `apps/ember-viz` - Ember Implementation (Optional Bonus)

Only implement if time permits - demonstrates Upfluence stack familiarity.

## Development Workflow

### Initial Setup Commands

```bash
# Initialize Turborepo with pnpm
pnpx create-turbo@latest upfluence-challenge --package-manager pnpm
cd upfluence-challenge

# Initialize React app with Vite
cd apps
pnpm create vite@latest react-viz -- --template react-ts

# Initialize core package
cd ../packages
mkdir -p core/src/{stream,aggregator,validators,utils}
pnpm init

# Setup pnpm workspace
# Edit pnpm-workspace.yaml to define packages
```

### Key Scripts (Root package.json)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:react": "turbo run dev --filter=react-viz",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "packageManager": "pnpm@10.23.0"
}
```

### pnpm Workspace (pnpm-workspace.yaml)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Turborepo Pipeline (turbo.json)

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
```

## Implementation Phases

### Phase 1: Core Package (Foundation)

- [x] 1. Setup `packages/core` with TypeScript
- [x] 2. Implement `SSEClient` with EventSource
- [x] 3. Create Zod schemas for post validation
- [x] 4. Build `PostAggregator` with nested Map structure
- [x] 5. Add time utilities (UNIX → UTC day/hour)
- [x] 6. Write unit tests for aggregation logic

### Phase 2: React App (Primary UI)

- [x] 1. Initialize Vite + React + TypeScript
- [x] 2. Create `useSSEStream` hook wrapping core client
- [x] 3. Build `PunchCardGrid` component
- [x] 4. Implement 6 `PostTypeCard` instances
- [x] 5. Add connection status indicator
- [x] 6. Style with responsive design

### Phase 3: Polish & Features

- [x] 1. Error boundaries and empty states
- [x] 2. Loading states with skeleton UI
- [x] 3. Accessibility (ARIA, keyboard nav)
- [ ] 4. Dark mode toggle (if time permits)
- [x] 5. Performance metrics display (posts/sec) (if time permits)

### Phase 4: Landing Page

- [x] 1. Create static HTML landing page
- [x] 2. Add links to `/viz` route
- [x] 3. Include tech stack overview
- [ ] 4. Add screenshots/demo GIF

### Phase 5: Testing & Documentation

- [x] 1. Unit tests for core logic (>80% coverage)
- [x] 2. Integration tests for SSE handling
- [x] 3. E2E tests for critical paths (optional)
- [x] 4. Comprehensive README with diagrams
- [x] 5. Performance benchmarks documentation

### Phase 6: Deployment

- [ ] 1. Deploy to Github Pages
- [x] 2. Configure monorepo build settings
- [x] 3. Test production build locally first
- [ ] 4. Add live demo link to README

## Technical Decisions & Rationale

### Why Monorepo?

- **Demonstrates architecture skills**: Clean separation of concerns
- **Comparison ready**: Easy to add Ember/Vue implementations
- **Code reuse**: Core logic shared across multiple UIs
- **Production pattern**: Mirrors real-world enterprise setups

### Why Turborepo over Nx/Lerna?

- **Simplicity**: Easier setup, less configuration
- **Performance**: Built-in caching and parallel execution
- **Trade-off**: Less features than Nx, but sufficient for this scope

### Why pnpm?

- **Performance**: Faster installs, efficient disk usage
- **Monorepo native**: Built-in workspace support without extra tooling
- **Industry adoption**: Growing popularity, well-maintained

### Why React over Ember (initially)?

- **Faster prototyping**: More familiar ecosystem, more skilled with React
- **Extensible**: Can add Ember implementation as bonus

### Why Zod?

- **Runtime validation**: Catches malformed SSE payloads
- **Type inference**: Automatic TypeScript types from schemas
- **Developer experience**: Clear error messages

### Trade-offs & Limitations

**Monorepo overhead:**

- More complex initial setup
- Longer onboarding for reviewers
- **Mitigation**: Excellent README with clear navigation

**Vanilla landing page:**

- No framework = more manual work
- **Mitigation**: Keeps it simple, shows versatility

**React-first approach:**

- Misses Ember bonus initially
- **Mitigation**: Document Ember familiarity in README, add if time permits

## Success Metrics

- ✅ All 6 post types visualized independently
- ✅ Latency <5s (measure and display in UI)
- ✅ Handles 1000+ posts/min smoothly
- ✅ Mobile-responsive
- ✅ Deployed with live demo link
- ✅ README with architecture diagram
- ✅ >80% test coverage on core logic

## Timeline Estimate

- **Phase 1** (Core): 4-6 hours
- **Phase 2** (React): 6-8 hours
- **Phase 3** (Polish): 4-6 hours
- **Phase 4** (Landing): 1-2 hours
- **Phase 5** (Docs/Tests): 3-4 hours
- **Phase 6** (Deploy): 1 hour

**Total:** 19-27 hours over 2-4 days

## Open Questions

1. **Visualization library**: Manual, Recharts vs Visx vs D3 vs custom Canvas?
   - Recommendation: Manual for simplicity
2. **State management**: Context API vs Zustand?
   - Recommendation: Start with Context, add Zustand if complexity grows
3. **Styling**: Tailwind vs CSS vs Styled Components?
   - Recommendation: CSS for ease of use and reusability
4. **Memory strategy**: Sliding window? localStorage persistence?
   - Recommendation: 7-day sliding window, document in README
