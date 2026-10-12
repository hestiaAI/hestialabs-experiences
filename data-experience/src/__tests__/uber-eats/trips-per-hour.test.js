import experience from '@hestia.ai/uber-eats'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options

const onlineCsv = [
  'earner_state,begin_timestamp_local,end_timestamp_local,duration_ms',
  // 1 h waiting (P1) on Wednesday 30 April
  'open,2025-04-30T20:00:00.000Z,2025-04-30T21:00:00.000Z,3600000',
  // 1 h delivering (P3) across midnight into Thursday 1 May: half in April, half in May
  'ontrip,2025-04-30T23:30:00.000Z,2025-05-01T00:30:00.000Z,3600000',
  // 2 h going to restaurants (P2) across midnight into Monday 5 May: new week
  'enroute,2025-05-04T23:00:00.000Z,2025-05-05T01:00:00.000Z,7200000',
  // offline time and periods without an end don't count
  'offline,2025-05-01T01:00:00.000Z,2025-05-04T23:00:00.000Z,338400000',
  'open,2025-05-06T10:00:00.000Z,,'
].join('\n')

const tripsCsv = [
  'courier_accept_timestamp_local,delivery_status',
  '2025-04-30T20:30:00.000Z,completed',
  '2025-04-30T23:40:00.000Z,completed',
  '2025-05-05T00:10:00.000Z,completed',
  '2025-05-05T00:20:00.000Z,canceled'
].join('\n')

async function run() {
  const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)
  await fileManager.init([
    new NodeFile('export/11 - Driver Online Offline.csv', onlineCsv),
    new NodeFile('export/31 - Courier Lifetime Trip Data.csv', tripsCsv)
  ])
  const pipeline = getCustomPipelineFromBlock(experience, 'trips_per_hour')
  return pipeline({ fileManager })
}

const row = (items, granularity, period) =>
  items.find(i => i.granularity === granularity && i.period === period)

describe('uber-eats – trips_per_hour', () => {
  test('splits online and active time at month boundaries', async() => {
    const { headers, items } = await run()
    expect(headers).toEqual(['period', 'granularity', 'tphOnline', 'tphActive', 'trips', 'onlineHours', 'activeHours'])
    expect(row(items, 'month', '2025-04')).toEqual({
      period: '2025-04',
      granularity: 'month',
      trips: 2,
      onlineHours: 1.5, // 1 h open + 0.5 h on trip
      activeHours: 0.5,
      tphOnline: 1.33,
      tphActive: 4
    })
    expect(row(items, 'month', '2025-05')).toMatchObject({
      trips: 1,
      onlineHours: 2.5, // 0.5 h on trip + 2 h en route
      activeHours: 2.5,
      tphOnline: 0.4
    })
  })

  test('splits at week boundaries, weeks starting on Monday', async() => {
    const { items } = await run()
    expect(row(items, 'week', '2025-04-28')).toMatchObject({ trips: 2, onlineHours: 3, activeHours: 2 })
    expect(row(items, 'week', '2025-05-05')).toMatchObject({ trips: 1, onlineHours: 1, activeHours: 1, tphActive: 1 })
  })

  test('periods are sorted, months then weeks', async() => {
    const { items } = await run()
    expect(items.map(i => `${i.granularity} ${i.period}`)).toEqual([
      'month 2025-04', 'month 2025-05', 'week 2025-04-28', 'week 2025-05-05'
    ])
  })
})
