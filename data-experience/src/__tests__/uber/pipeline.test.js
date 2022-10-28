import experience from '@hestia.ai/uber'
import { testTripsData, tripsHeaders, tripsItems } from './samples.helpers'
import FileManager from '~/utils/file-manager'
import { NodeFile } from '~/utils/node-file'
import { arrayEqualNoOrder, getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options
const fileManager = new FileManager(
  preprocessors,
  null,
  files,
  keepOnlyFiles
)
const fileTrips = new NodeFile('test/Rider/trips_data.csv', testTripsData)

describe('with complete samples', () => {
  beforeAll(async() => await fileManager.init([fileTrips]))

  test('pipeline tripsData returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'tripsData')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: tripsHeaders,
      items: tripsItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('pipeline tripsGraphData returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'tripsGraphData')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: ['source', 'target', 'value'],
      items: [
        {
          source: 'Sesame Street, UK',
          target: ' Plouf Street, Smurfbridge H FU, UK',
          value: 1
        },
        {
          source: 'Sesame Street, UK',
          target: ' Plouf Street, Smurfbridge H FU, UK',
          value: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
