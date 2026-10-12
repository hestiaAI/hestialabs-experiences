import experience from '@hestia.ai/yoojo'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options

// Synthetic jobs with the export's columns that matter here
const jobsCsv = [
  'id,category,nb_hours,accepted_at,postulated_at,booked_at,canceled_at,state',
  '1,Ménage,2.00,2024-06-01 10:00:00,2024-06-01 10:05:00,2024-06-02 09:00:00,NULL,PAID',
  '2,Ménage,3.50,2024-06-03 10:00:00,2024-06-03 10:05:00,NULL,NULL,POSTULATED',
  '3,Animaux,NULL,2024-06-04 10:00:00,2024-06-04 10:05:00,2024-06-05 09:00:00,NULL,BOOKED',
  '4,Animaux,1.00,2024-06-06 10:00:00,NULL,2024-06-07 09:00:00,2024-06-08 09:00:00,CANCELED',
  '5,Animaux,4.00,2024-06-09 10:00:00,2024-06-09 10:05:00,NULL,NULL,POSTULATED',
  '6,NULL,1.00,2024-06-10 10:00:00,2024-06-10 10:05:00,NULL,NULL,POSTULATED'
].join('\n')

async function run(csv = jobsCsv) {
  const fileManager = new FileManager(preprocessors, null, files, keepOnlyFiles)
  await fileManager.init([new NodeFile('export/data_jobs_42.csv', csv)])
  const pipeline = getCustomPipelineFromBlock(experience, 'effectiveWork')
  return pipeline({ fileManager })
}

describe('yoojo – yoojo_effective_work', () => {
  test('totals: every row applied, booked when booked_at is set', async() => {
    const { headers, items } = await run()
    expect(headers).toEqual([
      'scope', 'category', 'jobsApplied', 'jobsBooked', 'jobsBookedCanceled',
      'hoursApplied', 'hoursBooked', 'jobsWithoutHours', 'bookingRate'
    ])
    expect(items[0]).toEqual({
      scope: 'total',
      category: '',
      jobsApplied: 6,
      jobsBooked: 3,
      jobsBookedCanceled: 1,
      hoursApplied: 11.5, // the NULL row is left out of the hours
      hoursBooked: 3, // 2 + 1 (cancelled after booking still counts)
      jobsWithoutHours: 1,
      bookingRate: 0.5
    })
  })

  test('per category, most applied first, missing category kept', async() => {
    const { items } = await run()
    const categories = items.filter(i => i.scope === 'category')
    expect(categories.map(i => i.category)).toEqual(['Animaux', 'Ménage', ''])
    expect(categories[0]).toMatchObject({ jobsApplied: 3, jobsBooked: 2, hoursApplied: 5, hoursBooked: 1, jobsWithoutHours: 1 })
    expect(categories[1]).toMatchObject({ jobsApplied: 2, jobsBooked: 1, hoursApplied: 5.5, hoursBooked: 2, bookingRate: 0.5 })
  })

  test('an empty export gives zero totals', async() => {
    const { items } = await run('id,category,nb_hours,accepted_at,booked_at,canceled_at\n')
    expect(items).toEqual([expect.objectContaining({ scope: 'total', jobsApplied: 0, bookingRate: 0 })])
  })
})
