export function csvToItems(csv) {
  const lines = csv
    .split('\r\n')
    .map(line => line.split(',').map(x => x.slice(1, -1)))
  const headers = lines[0]
  const items = lines
    .slice(1)
    .map(line =>
      Object.fromEntries(line.map((field, index) => [headers[index], field]))
    )
  return [headers, items]
}
