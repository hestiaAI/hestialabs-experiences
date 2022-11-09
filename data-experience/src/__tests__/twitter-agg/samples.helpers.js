export const ads =
{
  showTable: false,
  id: 'overview',
  sql: "WITH\n  EngagementCount AS (\n    SELECT\n      a.tweetId,\n      a.advertiserName,\n      a.displayLocation,\n      a.time,\n      COUNT(*) AS count_\n    FROM\n      TwitterAd a,\n      TwitterEngagement e\n    WHERE\n      a.tweetId = e.tweetId\n      AND a.advertiserName = e.advertiserName\n      AND a.displayLocation = e.displayLocation -- We only consider engagements that occur\n      -- within 120 sec of a corresponding impression.\n      -- 60 sec x 60 min x 24 hours = 86,400 sec\n      AND ABS(\n        ROUND((JULIANDAY(a.time) - JULIANDAY(e.time)) * 86400)\n      ) < 120\n    GROUP BY\n      a.tweetId,\n      a.advertiserName,\n      a.displayLocation,\n      a.time\n  ),\n  Engagement AS (\n    SELECT\n      a.tweetId,\n      a.advertiserName AS companyName,\n      -- Return 0 if ad has no engagements\n      IFNULL(\n        (\n          SELECT\n            ec.count_\n          FROM\n            EngagementCount ec\n          WHERE\n            a.tweetId = ec.tweetId\n            AND a.advertiserName = ec.advertiserName\n            AND a.displayLocation = ec.displayLocation\n            AND a.time = ec.time\n        ),\n        0\n      ) engagements,\n      a.time AS date_,\n      c.targetingType,\n      c.targetingValue\n    FROM\n      TwitterAd a\n      INNER JOIN TwitterCriterion c ON a.id = c.adId\n  )\nSELECT\n  (\n    -- Yes/No is interpreted as BOOLEAN by type-check.js\n    CASE\n      WHEN e.engagements IS 0 THEN 'No'\n      ELSE 'Yes'\n    END\n  ) AS engagedWith,\n  e.*\nFROM\n  Engagement e\n",
  files: [
    'impressions',
    'engagements'
  ],
  visualization: 'ChartViewOverviewTwitter.vue',
  title: 'Advertising overview',
  text: 'Understand how much, who and why you are being targeted by Twitter ads in this interactive visualization. Click on any graph to filter the results.',
  result: {
    headers: [
      'engagedWith',
      'tweetId',
      'companyName',
      'engagements',
      'date_',
      'targetingType',
      'targetingValue'
    ],
    items: [
      {
        engagedWith: 'No',
        tweetId: '1369584490276741122',
        companyName: 'Illumeably',
        engagements: 0,
        date_: '2021-04-15 19:51:50',
        targetingType: 'Platforms',
        targetingValue: 'Desktop'
      },
      {
        engagedWith: 'No',
        tweetId: '1369584490276741122',
        companyName: 'Illumeably',
        engagements: 0,
        date_: '2021-04-15 19:51:50',
        targetingType: 'Locations',
        targetingValue: 'Switzerland'
      },
      {
        engagedWith: 'No',
        tweetId: '1369584490276741122',
        companyName: 'Illumeably',
        engagements: 0,
        date_: '2021-04-15 19:51:50',
        targetingType: 'Languages',
        targetingValue: 'English'
      },
      {
        engagedWith: 'No',
        tweetId: '1380113782299488259',
        companyName: 'Crypto.com',
        engagements: 0,
        date_: '2021-04-15 19:49:08',
        targetingType: 'Follower look-alikes',
        targetingValue: '@justinsuntron'
      }
    ]
  },
  index: 0
}

export const adsLastMonth = {
  showTable: false,
  id: 'overview-last-month',
  sql: "WITH\n  EngagementCount AS (\n    SELECT\n      a.tweetId,\n      a.advertiserName,\n      a.displayLocation,\n      a.time,\n      COUNT(*) AS count_\n    FROM\n      TwitterAd a,\n      TwitterEngagement e\n    WHERE\n      a.tweetId = e.tweetId\n      AND a.advertiserName = e.advertiserName\n      AND a.displayLocation = e.displayLocation -- We only consider engagements that occur\n      -- within 120 sec of a corresponding impression.\n      -- 60 sec x 60 min x 24 hours = 86,400 sec\n      AND ABS(\n        ROUND((JULIANDAY(a.time) - JULIANDAY(e.time)) * 86400)\n      ) < 120\n    GROUP BY\n      a.tweetId,\n      a.advertiserName,\n      a.displayLocation,\n      a.time\n  ),\n  Engagement AS (\n    SELECT\n      a.tweetId,\n      a.advertiserName AS companyName,\n      -- Return 0 if ad has no engagements\n      IFNULL(\n        (\n          SELECT\n            ec.count_\n          FROM\n            EngagementCount ec\n          WHERE\n            a.tweetId = ec.tweetId\n            AND a.advertiserName = ec.advertiserName\n            AND a.displayLocation = ec.displayLocation\n            AND a.time = ec.time\n        ),\n        0\n      ) engagements,\n      a.time AS date_,\n      c.targetingType,\n      c.targetingValue\n    FROM\n      TwitterAd a\n      INNER JOIN TwitterCriterion c ON a.id = c.adId\n    WHERE\n      a.time > DATE('now', '-1 month')\n  )\nSELECT\n  (\n    -- Yes/No is interpreted as BOOLEAN by type-check.js\n    CASE\n      WHEN e.engagements IS 0 THEN 'No'\n      ELSE 'Yes'\n    END\n  ) AS engagedWith,\n  e.*\nFROM\n  Engagement e\n",
  files: [
    'impressions',
    'engagements'
  ],
  visualization: 'ChartViewOverviewTwitter.vue',
  title: 'Advertising overview (last month)',
  text: 'Understand how much, who and why you have been targeted by Twitter ads last month in this interactive visualization. Click on any graph to filter the results.',
  result: {
    headers: [
      'engagedWith',
      'tweetId',
      'companyName',
      'engagements',
      'date_',
      'targetingType',
      'targetingValue'
    ],
    items: [
      {
        engagedWith: 'No',
        tweetId: '1369584490276741122',
        companyName: 'Illumeably',
        engagements: 0,
        date_: '2021-04-15 19:51:50',
        targetingType: 'Languages',
        targetingValue: 'English'
      },
      {
        engagedWith: 'No',
        tweetId: '1380113782299488259',
        companyName: 'Crypto.com',
        engagements: 0,
        date_: '2021-04-15 19:49:08',
        targetingType: 'Follower look-alikes',
        targetingValue: '@justinsuntron'
      }
    ]
  },
  index: 1
}

export const targeting =
{
  showTable: true,
  id: 'all-criteria-all-advertisers',
  sql: 'SELECT\n  advertiserName,\n  targetingType,\n  targetingValue,\n  COUNT(*) AS count_\nFROM\n  TwitterAd\n  INNER JOIN TwitterCriterion ON TwitterAd.id = TwitterCriterion.adId\nGROUP BY\n  advertiserName,\n  targetingType,\n  targetingValue;\n',
  files: [
    'impressions',
    'engagements'
  ],
  title: 'Targeting criteria (1 advertiser)',
  visualization: 'ChartViewSearchSunburst.vue',
  text: 'Visualize the targeting criteria used by one specific advertiser. You can look up the advertiser in the table below and click on it to visualise them.',
  result: {
    headers: [
      'advertiserName',
      'targetingType',
      'targetingValue',
      'count_'
    ],
    items: [
      {
        advertiserName: '#VivaTech',
        targetingType: 'Age',
        targetingValue: '25 to 49',
        count_: 41
      },
      {
        advertiserName: '#VivaTech',
        targetingType: 'Follower look-alikes',
        targetingValue: '@500Startups',
        count_: 9
      },
      {
        advertiserName: '#VivaTech',
        targetingType: 'Follower look-alikes',
        targetingValue: '@BW',
        count_: 23
      },
      {
        advertiserName: '#VivaTech',
        targetingType: 'Follower look-alikes',
        targetingValue: '@BusinessInsider',
        count_: 23
      },
      {
        advertiserName: '#VivaTech',
        targetingType: 'Follower look-alikes',
        targetingValue: '@FastCompany',
        count_: 9
      },
      {
        advertiserName: '#VivaTech',
        targetingType: 'Follower look-alikes',
        targetingValue: '@LaFrenchTech',
        count_: 4
      }
    ]
  },
  index: 5
}

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
            },
            {
              deviceInfo: {
                osType: 'Android'
              },
              displayLocation: 'SearchTweets',
              promotedTweetInfo: {
                tweetId: '1389506561530384384',
                tweetText: '« Super! Meine Frau will die Uhr nicht mehr abziehen. »\n#digitec',
                urls: [],
                mediaUrls: []
              },
              advertiserInfo: {
                advertiserName: 'digitec',
                screenName: '@digitec_de'
              },
              matchedTargetingCriteria: [
                {
                  targetingType: 'Locations',
                  targetingValue: 'Switzerland'
                },
                {
                  targetingType: 'Languages',
                  targetingValue: 'English'
                }
              ],
              impressionTime: '2020-06-05 15:27:46'
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
            },
            {
              impressionAttributes: {
                deviceInfo: {
                  osType: 'Android'
                },
                displayLocation: 'SearchTweets',
                promotedTweetInfo: {
                  tweetId: '1389506561530384384',
                  tweetText: '« Super! Meine Frau will die Uhr nicht mehr abziehen. »\n#digitec',
                  urls: [],
                  mediaUrls: []
                },
                advertiserInfo: {
                  advertiserName: 'digitec',
                  screenName: '@digitec_de'
                },
                matchedTargetingCriteria: [
                  {
                    targetingType: 'Locations',
                    targetingValue: 'Switzerland'
                  },
                  {
                    targetingType: 'Languages',
                    targetingValue: 'English'
                  }
                ],
                impressionTime: '2020-06-05 15:27:45'
              },
              engagementAttributes: [
                {
                  engagementTime: '2020-06-05 15:27:46',
                  engagementType: 'ChargeableImpression'
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
