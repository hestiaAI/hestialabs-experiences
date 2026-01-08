import experience from '@hestia.ai/babysits'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { getCustomPipelineFromBlock } from '~/utils/test-utils'
import { babysitterJobsCsv } from './samples.helpers'

const { preprocessors, files, keepOnlyFiles } = experience.options

const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)

const babysitterFile = new NodeFile(
  'test/data_jobs_1234567.csv',
  babysitterJobsCsv
)

const normalizeDate = (isoDate) => {
  const [y, m, d] = isoDate.split('-').map(Number)
  return { y, m, d }
}

describe('babysits - csv_babysitter_jobs', () => {
  beforeAll(async() => {
    await fileManager.init([babysitterFile])
  })

  test('parses babysitter csv and returns normalized items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'activityTypes')

    const result = await pipeline({ fileManager })

    expect(result.headers).toEqual([
      'job_id',
      'date',
      'start_time',
      'end_time',
      'duration_hours',
      'earnings',
      'location',
      'job_type',
      'status'
    ])
    expect(result.items).toHaveLength(2)

    // Spot-check first item fields
    const item = result.items.find(i => i.job_id === 'job-1')
    expect(item).toBeDefined()

    const expectedDate = { y: 2023, m: 10, d: 15 }
    const receivedDate = normalizeDate(item.date)

    expect(receivedDate.y).toBe(expectedDate.y)
    expect(receivedDate.m).toBe(expectedDate.m)
    expect(receivedDate.d).toBe(expectedDate.d)

    expect(item.start_time).toBe('08:30')
    expect(item.end_time).toBe('11:00')
    expect(item.duration_hours).toBeCloseTo(2.5)
    expect(item.earnings).toBeCloseTo(37.5)
    expect(item.status).toBe('completed')
  })

  test('handles integer start hour and status normalization correctly', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'activityTypes')

    const result = await pipeline({ fileManager })

    const item = result.items.find(i => i.job_id === 'job-2')
    expect(item).toBeDefined()

    expect(item.date).toBe('2023-10-16')

    expect(item.start_time).toBe('20:00')
    expect(item.end_time).toBe('22:00')

    expect(item.duration_hours).toBe(2)
    expect(item.earnings).toBe(40)

    expect(item.location).toBe('Zurich')
    expect(item.job_type).toBe('Night shift')

    expect(item.status).toBe('paid')
  })
})
