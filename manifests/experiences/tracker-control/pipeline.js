import { getCsvAndMergeFromID } from '@/utils/csv'

const trackerControl = async ({ fileManager }) =>
  await getCsvAndMergeFromID(fileManager, 'tracker-control')

export default {
  trackerControl
}
