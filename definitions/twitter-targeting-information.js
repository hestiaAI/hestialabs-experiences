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
  files,
  sources: sourceArraysToObjects(sources),
  format: 'json',
  preprocessor
}
