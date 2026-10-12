import experience from '@hestia.ai/uber-eats'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options

// Synthetic trips. Local timestamps are read as written, whatever the suffix.
const tripsCsv = [
  'courier_accept_timestamp_local,delivery_status',
  '2025-05-05T12:10:00.000Z,completed', // Monday 12h, week of 05-05
  '2025-05-05T12:55:00.000Z,completed', // Monday 12h
  '2025-05-11T23:59:00.000Z,completed', // Sunday 23h, same week
  '2025-05-12 00:00:00,completed', // Monday 0h, week of 05-12
  '2025-05-06T19:00:00.000Z,canceled', // not completed: ignored
  ',completed' // no time: ignored
].join('\n')

async function run(csv) {
  const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)
  await fileManager.init([new NodeFile('export/31 - Courier Lifetime Trip Data.csv', csv)])
  const pipeline = getCustomPipelineFromBlock(experience, 'trips_by_weekday_hour')
  return pipeline({ fileManager })
}

const cell = (items, weekday, hour) => items.find(i => i.weekday === weekday && i.hour === hour)

describe('uber-eats – trips_by_weekday_hour', () => {
  test('returns every weekday × hour cell', async() => {
    const { headers, items } = await run(tripsCsv)
    expect(headers).toEqual(['weekday', 'day', 'hour', 'trips', 'perActiveWeek', 'activeWeeks'])
    expect(items).toHaveLength(7 * 24)
    expect(cell(items, 1, 0).day).toBe('Mon')
    expect(cell(items, 7, 23).day).toBe('Sun')
  })

  test('counts completed trips by local weekday and hour', async() => {
    const { items } = await run(tripsCsv)
    expect(cell(items, 1, 12).trips).toBe(2)
    expect(cell(items, 7, 23).trips).toBe(1)
    expect(cell(items, 1, 0).trips).toBe(1)
    expect(cell(items, 2, 19).trips).toBe(0) // the canceled trip
    expect(items.reduce((sum, i) => sum + i.trips, 0)).toBe(4)
  })

  test('averages over weeks with at least one completed trip', async() => {
    const { items } = await run(tripsCsv)
    expect(items[0].activeWeeks).toBe(2)
    expect(cell(items, 1, 12).perActiveWeek).toBe(1)
    expect(cell(items, 7, 23).perActiveWeek).toBe(0.5)
  })

  test('an export without completed trips gives zeros', async() => {
    const { items } = await run('courier_accept_timestamp_local,delivery_status\n2025-05-05T12:10:00.000Z,failed')
    expect(items.every(i => i.trips === 0 && i.perActiveWeek === 0 && i.activeWeeks === 0)).toBe(true)
  })
})
