# Benchmark Results

| Metric                   | React | Vue | Svelte |
| :----------------------- | :---- | :-- | :----- |
| raw size (kb)            | 201   | 25  | 23     |
| mini + gzipped size (kb) | 64    | 9   | 9      |
| load time (ms)           | 29    | 6   | 5      |

## Methodology

- **Raw Size**: Total size of the HTML file and all referenced assets (JS, CSS) found in the build output.
- **Mini + Gzipped Size**: The total size of the same assets after Gzip compression.
- **Load Time**: The time taken from navigation start to the `load` event, measured using Playwright against a local production preview server.
