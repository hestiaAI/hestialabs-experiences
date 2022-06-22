import fs from 'fs'
import path from 'path'

import { testTripsData, tripsHeaders, tripsItems } from './samples.helpers'
import pipelines from '~/manifests/experiences/uber/pipeline'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../uber.json'), 'utf8')
)
Object.entries(manifest.preprocessors ?? {}).forEach(
  ([path, pre]) => (manifest.preprocessors[path] = preprocessors[pre])
)

async function getFileManager(testTripsData) {
  const fileManager = new FileManager(
    manifest.preprocessors,
    null,
    manifest.files
  )
  const fileTrips = mockFile('test/Rider/trips_data.csv', testTripsData)
  await fileManager.init([fileTrips])
  return fileManager
}

describe('with complete samples', () => {
  test('pipeline tripsData returns the correct items', async() => {
    const fileManager = await getFileManager(testTripsData)
    const result = await pipelines.tripsData({ fileManager })
    const expected = {
      headers: tripsHeaders,
      items: tripsItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('pipeline tripsGraphData returns the correct items', async() => {
    const fileManager = await getFileManager(testTripsData)
    const result = await pipelines.tripsGraphData({ fileManager })
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
