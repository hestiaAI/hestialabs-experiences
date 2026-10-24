import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { test as base, expect } from '@playwright/test'

const require = createRequire(import.meta.url)

// The app loads these assets from public CDNs at runtime.
// Serve the same files from node_modules so the e2e tests don't depend on network access.
const cdnAssets = [
  {
    url: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/sql\.js\/[^/]+\/sql-wasm\.wasm$/,
    path: () => require.resolve('sql.js/dist/sql-wasm.wasm'),
    contentType: 'application/wasm'
  },
  {
    url: /^https:\/\/cdn\.jsdelivr\.net\/npm\/d3-time-format@4\/locale\/([\w-]+)\.json$/,
    path: ([, iso]) => require.resolve(`d3-time-format/locale/${iso}`),
    contentType: 'application/json'
  },
  // Sample data, from this checkout rather than from master on GitHub
  {
    url: /^https:\/\/raw\.githubusercontent\.com\/hestiaAI\/hestialabs-experiences\/[^/]+\/packages\/lib\/data-samples\/([^?]+)(\?.*)?$/,
    path: ([, file]) => fileURLToPath(new URL(`../../packages/lib/data-samples/${decodeURIComponent(file)}`, import.meta.url)),
    contentType: 'application/octet-stream'
  },
  // Roboto font files, referenced by the stylesheet below
  {
    url: /^https:\/\/fonts\.gstatic\.com\/fontsource\/([\w-]+\.woff2?)$/,
    path: ([, file]) => require.resolve(`@fontsource/roboto/files/${file}`),
    contentType: 'font/woff2'
  }
]

// Answers the Google Fonts request for Roboto with the same font from @fontsource/roboto,
// so screenshots render the real font without network access.
const robotoStylesheet = () => ['100', '300', '400', '500', '700', '900']
  .map(weight => readFileSync(require.resolve(`@fontsource/roboto/${weight}.css`), 'utf8'))
  .join('\n')
  .replaceAll('url(./files/', 'url(https://fonts.gstatic.com/fontsource/')

// Third-party resources the tests don't check (icon font, embedded tutorial videos): answer with an empty body.
const stubbedUrls = [
  { url: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mdi\/font@[^/]+\/css\//, contentType: 'text/css' },
  { url: /^https:\/\/player\.vimeo\.com\//, contentType: 'text/html' }
]

export const test = base.extend({
  page: async({ page }, use) => {
    for (const { url, path, contentType } of cdnAssets) {
      await page.route(url, route => route.fulfill({
        body: readFileSync(path(route.request().url().match(url))),
        contentType,
        headers: { 'access-control-allow-origin': '*' }
      }))
    }
    await page.route(/^https:\/\/fonts\.googleapis\.com\/css\?family=Roboto/, route => route.fulfill({
      body: robotoStylesheet(),
      contentType: 'text/css'
    }))
    for (const { url, contentType } of stubbedUrls) {
      await page.route(url, route => route.fulfill({ body: '', contentType }))
    }
    await use(page)
  }
})

export { expect }
