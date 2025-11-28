# Copilot Instructions - Upfluence Coding Challenge

## Project Overview

Front-end application that visualizes social media posts in 3D using real-time SSE streaming data from Upfluence's public API (`https://stream.upfluence.co/stream`).

**Core Requirements:**

- 3D visualization: Day of week × Hour of day (UTC) × Post count
- Support 6 post types: `pin`, `instagram_media`, `youtube_video`, `article`, `tweet`, `facebook_status`
- Display separate visualization + counter for each post type
- Update latency: ≤5 seconds from stream reception to UI update
- Production-ready code quality expected

**Evaluation Criteria (in priority order):**

1. Architecture - Clean component separation, class boundaries
2. Clarity - README explains problems, solutions, trade-offs
3. Correctness - Does it work as specified?
4. Code quality - Simple, maintainable, idiomatic, consistent
5. UX - Understandable and pleasant interface
6. Technical choices - Appropriate libraries and patterns

**Bonus Points:**

- Scalability considerations for increased throughput
- Using Ember.js (Upfluence's stack)

## Development Setup

- **Framework**: Ember.js recommended (bonus points) or modern framework of choice
- **Data Source**: SSE stream at `https://stream.upfluence.co/stream`
- **Payload Format**: JSON with post type as key, object with `timestamp` (UNIX) as value
- **Visualization**: Weekly calendar graph style recommended (like GitHub contribution graph)

## Architecture & Patterns

### Data Flow

1. **SSE Connection** → Establish persistent connection to Upfluence stream
2. **Post Reception** → Parse JSON, extract post type and timestamp
3. **Time Bucketing** → Convert UNIX timestamp to UTC day-of-week + hour
4. **Aggregation** → Increment counters per (post_type, day, hour) bucket
5. **UI Update** → Refresh visualizations (≤5s latency requirement)

### Component Separation

- **Stream Service** - Manages SSE connection, reconnection logic, error handling
- **Data Aggregator** - Buckets posts by type/day/hour, maintains counters
- **Visualization Components** - One per post type, renders weekly calendar graph + counter
- **Time Utilities** - UNIX timestamp → UTC day/hour conversion

### Data Structure

Recommended aggregate structure for O(1) lookups and efficient memory usage:

```typescript
// Nested object/Map: PostType → DayOfWeek (0-6) → Hour (0-23) → Count
{
  tweet: {
    0: { 0: 5, 1: 3, ..., 23: 12 },  // Sunday by hour
    1: { 0: 8, 1: 2, ..., 23: 15 },  // Monday by hour
    ...
    6: { ... }                        // Saturday
  },
  instagram_media: { ... },
  pin: { ... },
  youtube_video: { ... },
  article: { ... },
  facebook_status: { ... }
}

// Separate totals per post type
{ tweet: 1234, instagram_media: 567, ... }
```

**Benefits:**

- O(1) increment: `data[postType][day][hour]++`
- Sparse storage - only allocates populated buckets
- Direct mapping to weekly calendar graph coordinates
- Easy serialization for state persistence

**Alternative (pre-allocated arrays):** Use `number[7][24]` per post type if all buckets will be populated - faster iteration but uses more memory.

### Key Considerations

- **Batching Updates**: Don't update UI on every post - batch for performance
- **Memory Management**: Consider windowing data (e.g., last 7-30 days) for long-running sessions
- **Error Handling**: Stream disconnections, malformed payloads, network issues
- **Performance**: 6 simultaneous visualizations + real-time updates

## Code Conventions

As patterns emerge during development:

- Naming for post type constants/enums
- UTC timezone handling approach
- State management pattern (if using framework store)
- Component prop naming conventions
- Error logging strategy

## Key Workflows

- **Development server**: Framework-specific dev server command
- **Production build**: Optimized build with minification
- **Testing**: Unit tests for time bucketing, aggregation logic; integration tests for stream handling
- **Deployment**: Static hosting (GitHub Pages)

## README Requirements

Must document (as if for production):

1. **Solution Description** - High-level approach to the problem
2. **Technical Choices** - Why this framework? Why this visualization library?
3. **Architectural Decisions** - Component structure, data flow rationale
4. **Trade-offs** - What was left out? What would you do with more time?
5. **Scalability Discussion** - How would this handle 10x throughput?
6. **Setup & Deploy Instructions** - How to run locally and deploy

## Important Constraints

- **Latency**: 5-second max from stream → UI (measure and document if exceeded)
- **Post Types**: Must handle all 6 types with separate visualizations
- **Time Format**: Display in UTC (not local timezone)
- **Production Quality**: Code should be ready for final review before deploy

## Standing Out from Other Candidates

This is a job application technical test - go beyond baseline requirements to demonstrate senior-level thinking.

### High-Priority Differentiators

**1. Exceptional README (Critical - Heavily Weighted)**

- Include architecture diagram (SSE → Aggregator → Components flow)
- Add screenshots/GIFs showing the app in action
- Document performance metrics: "Handles 1000 posts/min, <2s latency, <50MB memory"
- Create decision matrix: "Decision | Alternatives | Rationale"
- Make setup trivial: single command to run locally

**2. Production-Ready Polish**

- **Loading states**: Connection status indicator ("Connecting...", "Live", "Reconnecting...")
- **Error boundaries**: Graceful degradation when stream fails
- **Empty states**: Clear message before first posts arrive
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Responsive design**: Works on mobile/tablet (rarely done in coding tests)

**3. Live Deployment**

- Deploy to Vercel/Netlify (free, <5 minutes setup)
- Add prominent live demo link in README
- Makes reviewing effortless for evaluators

**4. Smart Technical Additions** (Pick 2-3)

- **Connection resilience**: Exponential backoff on reconnection, visual status
- **Performance monitoring**: Display current posts/sec rate in UI
- **Memory management**: Sliding window with configurable retention (e.g., last 7 days)
- **Demo mode**: Button to inject 100 test posts for instant visualization
- **Data export**: Download current dataset as JSON/CSV
- **Dark mode**: Shows UX attention to detail

**5. Code Quality Signals**

- **TypeScript**: Type safety demonstrates professionalism
- **Meaningful tests**: Test edge cases (malformed SSE, rapid posts, memory limits), not just coverage
- **Performance optimization**: Document batching strategy, debouncing, virtualization if needed
- **Inline rationale**: Comment _why_ decisions were made, not _what_ code does

**6. README "Production Considerations" Section**
Show you think beyond the exercise:

```markdown
## If This Were Production

- **Monitoring**: Add Sentry/DataDog for error tracking and performance
- **Rate limiting**: Backend backpressure if client can't keep up
- **Analytics**: Track user interactions (filters, time range selection)
- **CDN deployment**: Multi-region for global users
- **A/B testing**: Framework for testing visualization variations
```

**7. Ember.js Bonus**

- If using Ember: Show mastery of services, computed properties, modifiers, Glimmer components
- If not using Ember: Explain decision in README ("Chose React for X, but familiar with Ember patterns - see similar service architecture")

### What NOT to Do

- ❌ Over-engineer with unnecessary complexity
- ❌ Skimp on README quality - it's a primary evaluation criterion
- ❌ Leave TODO comments, console.logs, or commented code
- ❌ Sacrifice error handling to add features
- ❌ Use unfamiliar tech without clear justification

### Recommended Focus Areas

1. **Stellar README** with visuals + metrics (shows communication skills)
2. **Production polish** (loading/error states, accessibility) (shows maturity)
3. **Live deployment** with clean UI (makes evaluation effortless)

---

_Treat this as production code - prioritize quality over features. Document what's missing in README._
