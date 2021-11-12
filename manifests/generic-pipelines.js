import { JSONPath } from 'jsonpath-plus'

async function timedObservationViewer(fileManager, manifest) {
  const params = manifest.timedObservationsViewer
  const matchingFilenames = fileManager
    .getFilenames()
    .filter(name => params.fileMatchers.some(_ => _.regex.test(name)))
  const files = await fileManager.preprocessFiles(matchingFilenames)

  const headers = params.fields
  const items = Object.entries(files).flatMap(([name, text]) =>
    params.fileMatchers
      .filter(matcher => matcher.regex.test(name))
      .flatMap(matcher => {
        try {
          const entries = JSONPath({
            path: matcher.entryPath,
            json: JSON.parse(text)
          })
          return entries.map(entry => {
            return Object.fromEntries(
              headers.map(field => [
                field,
                JSONPath({
                  json: entry,
                  path: matcher.paths[field],
                  wrap: false
                })
              ])
            )
          })
        } catch (error) {
          return []
        }
      })
  )
  return { headers, items: params.parser(items) }
}

export { timedObservationViewer }
