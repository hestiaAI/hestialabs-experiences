import createItems from '../file-parser'
import {
  adImpressions,
  adEngagements,
  adsItemsExpected,
  targetingItemsExpected
} from './samples.helpers'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'

test('the twitter database builder parses the files correctly', async () => {
  const fileManager = new FileManager(
    {
      'data/ad-impressions.js': preprocessors.twitter,
      'data/ad-engagements.js': preprocessors.twitter
    },
    true
  )
  const fileImpressions = mockFile(
    'data/ad-impressions.js',
    JSON.stringify(adImpressions)
  )
  const fileEngagements = mockFile(
    'data/ad-engagements.js',
    JSON.stringify(adEngagements)
  )
  await fileManager.init([fileImpressions, fileEngagements], true)
  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const engagementsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-engagements.js')
  )
  const results = createItems({ impressionsFile, engagementsFile })
  const { adsItems, targetingItems } = results
  expect(adsItems).toEqual(adsItemsExpected)
  expect(targetingItems).toEqual(targetingItemsExpected)
})
