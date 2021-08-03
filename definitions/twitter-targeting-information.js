import { sourceArraysToObjects } from './utils'
import { twitterPreprocessor as preprocessor } from './preprocessors'

const files = {
  adImpressions: 'data/ad-impressions.js',
  adEngagements: 'data/ad-engagements.js'
}

const sources = [
  [
    'impImpressions',
    files.adImpressions,
    '$.*.ad.adsUserData.adImpressions.impressions[*]'
  ],
  [
    'engImpressions',
    files.adEngagements,
    '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes'
  ],
  [
    'engagements',
    files.adEngagements,
    '$.*.ad.adsUserData.adEngagements.engagements[*].engagementAttributes[*]'
  ],
  [
    'impTargetingCriteria',
    files.adImpressions,
    '$.*.ad.adsUserData.adImpressions.impressions[*].matchedTargetingCriteria[*]'
  ],
  [
    'engTargetingCriteria',
    files.adEngagements,
    '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes.matchedTargetingCriteria[*]'
  ]
]

export default {
  ext: 'zip',
  // 'files' required for zip-archives
  files: Object.values(files),
  sources: sourceArraysToObjects(sources, 'json'),
  preprocessor
}
