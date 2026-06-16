import experience from '@hestia.ai/bolt-driver'
import {
  driverProfile,
  driverProfileHeaders,
  driverProfileItems,
  driverRegistrations,
  driverRegistrationsHeaders,
  driverRegistrationsItems,
  scheduledRidesStatistic,
  scheduledRidesStatisticHeaders,
  scheduledRidesStatisticItems,
  driverChangeLog,
  driverChangeLogHeaders,
  driverChangeLogItems
} from './samples.helpers'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { arrayEqualNoOrder, getCustomPipelineFromBlock } from '~/utils/test-utils'

const { preprocessors, files, keepOnlyFiles } = experience.options
const fileManager = new FileManager(
  preprocessors,
  null,
  files,
  keepOnlyFiles
)

const fileDriverProfile = new NodeFile(
  'HA-DSAR_Account and profile_driver_profile.csv',
  driverProfile
)
const fileDriverRegistrations = new NodeFile(
  'HA-DSAR_Account and profile_driver_registrations.csv',
  driverRegistrations
)
const fileScheduledRidesStatistic = new NodeFile(
  'HA-DSAR_Account and profile_scheduled_rides_statistic.csv',
  scheduledRidesStatistic
)
const fileDriverChangeLog = new NodeFile(
  'HA-DSAR_Account and profile_change_log_driver_change_log.csv',
  driverChangeLog
)

describe('with complete samples', () => {
  beforeAll(async() => await fileManager.init([
    fileDriverProfile,
    fileDriverRegistrations,
    fileScheduledRidesStatistic,
    fileDriverChangeLog
  ]))

  test('pipeline driverProfile returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'driverProfile')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: driverProfileHeaders,
      items: driverProfileItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('pipeline driverRegistrations returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'driverRegistrations')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: driverRegistrationsHeaders,
      items: driverRegistrationsItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('pipeline workingConditions returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'workingConditions')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: scheduledRidesStatisticHeaders,
      items: scheduledRidesStatisticItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('pipeline accountDynamics returns the correct items', async() => {
    const pipeline = getCustomPipelineFromBlock(experience, 'accountDynamics')
    const result = await pipeline({ fileManager })
    const expected = {
      headers: driverChangeLogHeaders,
      items: driverChangeLogItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})