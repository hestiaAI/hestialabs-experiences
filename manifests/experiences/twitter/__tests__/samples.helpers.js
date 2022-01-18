export const adImpressions = [
  {
    ad: {
      adsUserData: {
        adImpressions: {
          impressions: [
            {
              deviceInfo: {
                osType: 'Android'
              },
              displayLocation: 'TimelineHome',
              promotedTweetInfo: {
                tweetId: '1381646278988292098',
                tweetText:
                  '#TrustInTransformation: place your trust in a partner who can help you complete the future-forward transformation into a data-driven company. #CustomerCentricTransformation',
                urls: [],
                mediaUrls: []
              },
              advertiserInfo: {
                advertiserName: 'PwC Switzerland',
                screenName: '@PwC_Switzerland'
              },
              matchedTargetingCriteria: [
                {
                  targetingType: 'Locations',
                  targetingValue: 'Switzerland'
                },
                {
                  targetingType: 'Age',
                  targetingValue: '35 and up'
                }
              ],
              impressionTime: '2021-04-15 19:43:25'
            }
          ]
        }
      }
    }
  }
]

export const adEngagements = [
  {
    ad: {
      adsUserData: {
        adEngagements: {
          engagements: [
            {
              impressionAttributes: {
                deviceInfo: {
                  osType: 'Android'
                },
                displayLocation: 'TimelineHome',
                promotedTweetInfo: {
                  tweetId: '1381646278988292098',
                  tweetText:
                    '#TrustInTransformation: place your trust in a partner who can help you complete the future-forward transformation into a data-driven company. #CustomerCentricTransformation',
                  urls: [],
                  mediaUrls: []
                },
                advertiserInfo: {
                  advertiserName: 'PwC Switzerland',
                  screenName: '@PwC_Switzerland'
                },
                matchedTargetingCriteria: [
                  {
                    targetingType: 'Locations',
                    targetingValue: 'Switzerland'
                  },
                  {
                    targetingType: 'Age',
                    targetingValue: '35 and up'
                  }
                ],
                impressionTime: '2021-04-15 19:43:20'
              },
              engagementAttributes: [
                {
                  engagementTime: '2021-04-15 19:43:31',
                  engagementType: 'CardUrlClick'
                }
              ]
            }
          ]
        }
      }
    }
  }
]

export const missingAttributesImpressions = [
  {
    ad: {
      adsUserData: {
        adImpressions: {
          impressions: [
            {
              matchedTargetingCriteria: [{}]
            }
          ]
        }
      }
    }
  }
]

export const missingAttributesEngagements = [
  {
    ad: {
      adsUserData: {
        adEngagements: {
          engagements: [
            {
              impressionAttributes: {
                matchedTargetingCriteria: [{}]
              },
              engagementAttributes: [{}]
            }
          ]
        }
      }
    }
  }
]
