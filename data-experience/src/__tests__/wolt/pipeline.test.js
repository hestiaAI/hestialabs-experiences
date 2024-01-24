import experience from '@hestia.ai/wolt'
import { testTripsData, courierTasks, courierTasksHeaders, courierTasksItems } from './samples.helpers'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { arrayEqualNoOrder, getViewBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options
const fileManager = new FileManager(
  preprocessors,
  null,
  files,
  keepOnlyFiles
)
const fileTrips = new NodeFile('test/Rider/trips_data.csv', testTripsData)

const fileTasks = new NodeFile('courier_tasks.csv', courierTasks)

describe('with complete samples', () => {
  beforeAll(async() => await fileManager.init([fileTrips, fileTasks]))

  test('wolt pipeline courierTasks returns the correct items', async() => {
    const blockId = 'courierTasks'

    const viewBlock = getViewBlock(experience, blockId)

    const pipeline = viewBlock.customPipeline
    const postprocessor = viewBlock.postprocessor

    const pipelineResult = await pipeline({ fileManager })
    const result = await postprocessor(pipelineResult)
    const expected = {
      headers: courierTasksHeaders,
      items: courierTasksItems
    }
    // console.log(result.items)
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
