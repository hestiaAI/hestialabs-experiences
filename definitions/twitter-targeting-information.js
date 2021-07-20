import { sourceArraysToObjects } from './utils'

const preprocessor = json => {
  // replace variable assignment in JS file
  return json.replace(/^.+=/, '')
}

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
  // 'files' required for zip-archives and when multiple: true
  files: Object.values(files),
  sources: sourceArraysToObjects(sources, 'json'),
  preprocessor,
  functions: {
    'http://www.example.com/dateTimeAddTimeChar': ([input]) =>
      input.replace(' ', 'T')
  }
}
