export const options = [
  'Follower look-alikes',
  'Interests',
  'App Activity',
  'Website Activity',
  'List',
  'Conversation topics',
  'Keywords',
  'Locations',
  'Age',
  'Languages',
  'Gender',
  'OS versions',
  'Platforms',
  'Events'
]

export default (
  descriptions: string[],
  dictionary: { [key: string]: string },
  labels: string[] = options
) => {
  if (options.length !== descriptions.length) {
    throw new Error('options and descriptions should be of equal length')
  }

  if (options.length !== labels.length) {
    throw new Error('options and labels should be of equal length')
  }

  const descriptionValues = Object.fromEntries(
    descriptions.map((description, index) => [options[index], description])
  )

  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: 800,
    height: 400,
    padding: 0,
    signals: [
      {
        name: 'filterSignal',
        value: [options[0]],
        bind: {
          input: 'select',
          name: ` ${dictionary.filterSignalName}: `,
          options,
          labels
        }
      },
      {
        name: 'descriptions',
        value: descriptionValues
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
              signal: `datum.targetingValue + " ${dictionary['was used by']} " + datum.count_ + " ${dictionary['advertiser(s)']}"`
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
}
