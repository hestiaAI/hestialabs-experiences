import { JSONPath } from 'jsonpath-plus'

self.onmessage = (message) => {
  const { json, arrayPath, columns } = message.data
  const rows = JSONPath({ json, path: arrayPath, resultType: 'all' })
  const results = []
  rows.forEach((r) => {
    const row = {}
    columns.forEach((c) => {
      const result = JSONPath({ json, path: r.path + c.selector, resultType: 'value' }).pop() || null
      row[c.name] = result ? decodeURIComponent(escape(result)) : result
    })
    if (!Object.values(row).every(v => v === null)) { results.push(row) }
  })
  self.postMessage(results)
}
