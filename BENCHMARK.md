# Benchmark Results

| Metric                   | React | Vue | Svelte | Preact |
| :----------------------- | :---- | :-- | :----- | :----- |
| raw size (kb)            | 202   | 26  | 24     | 26     |
| mini + gzipped size (kb) | 64    | 10  | 9      | 10     |
| load time (ms)           | 26    | 6   | 6      | 6      |

## Methodology

- **Raw Size**: Total size of the HTML file and all referenced assets (JS, CSS) found in the build output.
- **Mini + Gzipped Size**: The total size of the same assets after Gzip compression.
- **Load Time**: The time taken from navigation start to the `load` event, measured using Playwright against a local production preview server.
