import { execSync, spawn } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSizeSync } from 'gzip-size'
import { chromium } from 'playwright'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'apps/web/dist')
const OUT_FILE = join(ROOT, 'BENCHMARK.md')
const BASE_PATH = '/upfluence-coding-challenge'

const TARGETS = [
  { framework: 'React', page: 'react-viz' },
  { framework: 'Vue', page: 'vue-viz' },
  { framework: 'Svelte', page: 'svelte-viz' },
]

function getAssets(html: string) {
  const paths = new Set<string>()
  const add = (url: string) => {
    if (!url || url.startsWith('http') || url.startsWith('//')) return
    if (url.startsWith(BASE_PATH)) url = url.slice(BASE_PATH.length)
    paths.add(url.startsWith('/') ? url : `/${url}`)
  }

  const regexes = [
    /<script[^>]+src=["']([^"']+)["']/g,
    /(?:component|renderer)-url=["']([^"']+)["']/g,
  ]

  regexes.forEach((reg) => {
    let match
    while ((match = reg.exec(html))) add(match[1])
  })

  const linkRegExp = /<link[^>]+href=["']([^"']+)["'][^>]*>/g
  let match
  while ((match = linkRegExp.exec(html))) {
    if (match[0].includes('rel="stylesheet"')) add(match[1])
  }

  return [...paths]
}

function measureSize(page: string) {
  const htmlPath = join(DIST, page, 'index.html')
  if (!existsSync(htmlPath)) throw new Error(`Missing ${htmlPath}`)

  const html = readFileSync(htmlPath, 'utf-8')
  const files = [htmlPath, ...getAssets(html).map((p) => join(DIST, p))]

  let raw = 0
  let gzip = 0
  files.forEach((file) => {
    if (!existsSync(file)) return console.warn(`Missing: ${file}`)
    const content = readFileSync(file)
    raw += content.length
    gzip += gzipSizeSync(content)
  })

  return { raw: Math.round(raw / 1024), gzip: Math.round(gzip / 1024) }
}

async function startServer() {
  console.log('Starting preview server...')
  const server = spawn('pnpm', ['--filter', 'web', 'preview'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  return new Promise<{ port: number; kill: () => void }>((resolve) => {
    server.stdout.on('data', (data) => {
      const str = data.toString()
      const match = str.match(/http:\/\/localhost:(\d+)/)
      if (match) {
        resolve({
          port: parseInt(match[1]),
          kill: () => server.kill(),
        })
      }
    })
    server.stderr.on('data', (d) => console.error(d.toString()))
  })
}

async function measureLoadTimes(port: number) {
  console.log('Measuring load times...')
  const browser = await chromium.launch()
  const results: Record<string, number> = {}

  for (const { framework, page } of TARGETS) {
    const context = await browser.newContext()
    const p = await context.newPage()
    await p.goto(`http://localhost:${port}${BASE_PATH}/${page}`)

    const timing = await p.evaluate(() => {
      const nav = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming
      return nav.loadEventEnd - nav.startTime
    })

    results[framework] = Math.round(timing)
    await context.close()
  }

  await browser.close()
  return results
}

async function main() {
  try {
    console.log('Building...')
    execSync('pnpm --filter web build', { stdio: 'inherit', cwd: ROOT })

    const sizeResults = TARGETS.map(({ framework, page }) => {
      console.log(`Measuring size for ${framework}...`)
      return { framework, ...measureSize(page) }
    })

    const { port, kill } = await startServer()
    const loadTimes = await measureLoadTimes(port)
    kill()

    const table = [
      `| Metric | ${sizeResults.map((r) => r.framework).join(' | ')} |`,
      `| :--- | ${sizeResults.map(() => ':---').join(' | ')} |`,
      `| raw size (kb) | ${sizeResults.map((r) => r.raw).join(' | ')} |`,
      `| mini + gzipped size (kb) | ${sizeResults.map((r) => r.gzip).join(' | ')} |`,
      `| load time (ms) | ${sizeResults.map((r) => loadTimes[r.framework]).join(' | ')} |`,
    ].join('\n')

    const methodology = `
## Methodology

- **Raw Size**: Total size of the HTML file and all referenced assets (JS, CSS) found in the build output.
- **Mini + Gzipped Size**: The total size of the same assets after Gzip compression.
- **Load Time**: The time taken from navigation start to the \`load\` event, measured using Playwright against a local production preview server.
`

    writeFileSync(OUT_FILE, `# Benchmark Results\n\n${table}\n${methodology}`)
    console.log(`Written to ${OUT_FILE}`)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
