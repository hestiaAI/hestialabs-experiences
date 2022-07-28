export default {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: 800,
  height: 400,
  padding: 0,
  signals: [
    {
      name: 'filterSignal',
      value: ['Follower look-alikes'],
      bind: {
        input: 'select',
        name: ' Criteria: ',
        options: [
          'Follower look-alikes',
          'Locations',
          'Age',
          'Languages',
          'Interests',
          'App Activity',
          'Website Activity',
          'List',
          'Conversation topics',
          'Keywords',
          'Gender',
          'OS versions',
          'Platforms',
          'Events'
        ]
      }
    },
    {
      name: 'descriptions',
      value: {
        'Follower look-alikes':
          'Twitter determine users similar to those who follow accounts based on a variety of signals, including what they Retweet, click on, Tweet, and more.',
        Interests:
          'Twitter determine interests based on a variety of signals, including who they follow, what they Retweet, click on, Tweet, and more.',
        'App Activity':
          'Reach groups of people who have taken a specific action in your app, such as installs or sign-ups.',
        'Website Activity':
          "It is possible to collect this data using Twitter's website tag available through Twitter Ads.",
        List: 'Lists are created by uploading a file containing your email address, mobile advertising ID or Twitter username.',
        'Conversation topics':
          "People may be considered part of a conversation audience if they've Tweeted or engaged with a Tweet mentioning the topic.",
        Keywords:
          'Keyword targeting allows advertisers to reach people on Twitter based on keywords in their search queries, recent Tweets, and Tweets they recently engaged with.',
        Locations:
          "Twitter’s geo targeting is based on someone's recent location. This is a combination of current location and recent location history. Twitter uses several signals for determining whether someone is presently in a particular geographic location, such as web IP address, mobile GPS signal, mobile WiFi signal, and real-time signals, such as when someone includes their location in a Tweet.",
        Age: 'If not specified in your Twitter profile, Twitter deduct it from users who did it, based on a number of attributes such as the accounts they follows and their interests.',
        Languages:
          'Twitter derive a person’s language from the language selected in their profile settings, the languages that correspond to their activity on Twitter and more.',
        Gender:
          "Twitter use the gender provided by people in their profiles, and extend that data to other people based on factors of account likeness to determine the gender of people haven't manually entered their preferred gender.",
        'OS versions':
          'Advertisers can target by Operating System (e.g IOS vs Android)',
        Platforms:
          'Advertisers can target by platform used by the client (e.g Iphone 7 vs Iphone 8)',
        Events:
          "With event targeting, Twitter can discover and target the events that best fit the advertisers' audience — then create a campaign that delivers their ads at just the right time to just the right audience as the event unfolds."
      }
    }
  ],
  data: [
    {
      name: 'source',
      values: [],
      format: { type: 'json', parse: { count_: 'number' } },
      transform: [
        {
          type: 'filter',
          expr: 'datum.targetingType == filterSignal'
        },
        {
          type: 'formula',
          as: 'angle',
          expr: '[-45, 0, 45][~~(random() * 3)]'
        },
        {
          type: 'formula',
          as: 'weight',
          expr: "if(datum.targetingValue=='VEGA', 600, 300)"
        }
      ]
    }
  ],

  scales: [
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'source', field: 'targetingValue' },
      range: ['#d5a928', '#652c90', '#939597']
    }
  ],

  marks: [
    {
      type: 'text',
      from: { data: 'source' },
      encode: {
        enter: {
          text: { field: 'targetingValue' },
          align: { value: 'center' },
          baseline: { value: 'alphabetic' },
          fill: { scale: 'color', field: 'targetingValue' },
          tooltip: {
            signal:
              "datum.targetingValue + ' was used by ' + datum.count_ + ' advertiser'"
          }
        },
        update: {
          fillOpacity: { value: 1 }
        },
        hover: {
          fillOpacity: { value: 0.5 }
        }
      },
      transform: [
        {
          type: 'wordcloud',
          size: [800, 400],
          text: { field: 'datum.targetingValue' },
          rotate: { field: 'datum.angle' },
          font: 'Helvetica Neue, Arial',
          fontSize: { field: 'datum.count_' },
          fontWeight: { field: 'datum.weight' },
          fontSizeRange: [12, 56],
          padding: 2
        }
      ]
    },
    {
      type: 'image',
      encode: {
        enter: {
          url: {
            value:
              'https://cdn1.iconfinder.com/data/icons/free-education-set/32/question-512.png'
          }
        },
        update: {
          tooltip: { signal: 'descriptions[filterSignal]' },
          opacity: { value: 1 },
          x: { signal: 'width - 20' },
          y: { signal: 'height + 10' },
          width: { value: 20 },
          height: { value: 20 },
          aspect: { value: true },
          smooth: { value: true },
          align: { value: 'center' },
          baseline: { value: 'middle' }
        },
        hover: {
          opacity: { value: 0.5 }
        }
      }
    }
  ]
}
