export default {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: 400,
  height: 415,
  autosize: 'fit',
  title: {
    text: {
      signal: "versus[0] + ' vs ' + versus[1]"
    },
    subtitle: {
      signal:
        '\'Entre \' + timeFormat(extent[0], "%d/%m/%Y") + \' et \' + timeFormat(extent[1], "%d/%m/%Y")'
    },
    dy: {
      value: -24
    },
    fontWeight: {
      value: 'lighter'
    },
    fontSize: {
      value: 18
    },
    font: {
      value: 'Tahoma'
    },
    color: {
      value: '#303030'
    },
    subtitleFont: {
      value: 'Tahoma'
    },
    subtitleFontStyle: {
      value: 'italic'
    },
    subtitlePadding: 10,
    anchor: 'middle',
    frame: 'group'
  },
  signals: [
    {
      name: 'versus',
      value: ['Likes', 'Passes'],
      bind: {
        input: 'select',
        name: ' ',
        options: [
          ['Likes', 'Passes'],
          ['Likes', 'Matches'],
          ['Messages envoyés', 'Messages reçus'],
          ['Likes', 'App ouverte']
        ],
        labels: [
          'Likes/Passes',
          'Likes/Matches',
          'Messages envoyés/reçus',
          'App ouverte/Likes'
        ]
      }
    },
    {
      name: 'colors',
      value: {
        Likes: '#62D995',
        Passes: '#d24d57',
        'App ouverte': '#F2F2F2',
        'Messages envoyés': '#2994F2',
        'Messages reçus': '#F2C063',
        Matches: '#d24d57'
      }
    }
  ],
  data: [
    {
      name: 'source',
      values: [],
      format: {
        type: 'json',
        parse: {
          dateValue: "date:'%Y-%m-%d'"
        }
      },
      transform: [
        {
          type: 'extent',
          field: 'dateValue',
          signal: 'extent'
        },
        {
          type: 'aggregate',
          fields: [
            'likes',
            'opens',
            'number_of_superlikes',
            'passes',
            'number_of_messages_sent',
            'number_of_messages_received',
            'number_of_matches'
          ],
          ops: ['sum', 'sum', 'sum', 'sum', 'sum', 'sum', 'sum'],
          as: [
            'Likes',
            'App ouverte',
            'Superlikes',
            'Passes',
            'Messages envoyés',
            'Messages reçus',
            'Matches'
          ]
        },
        {
          type: 'fold',
          fields: {
            signal: 'versus'
          }
        },
        {
          type: 'pie',
          field: 'value',
          sort: true
        }
      ]
    }
  ],
  scales: [
    {
      name: 'color',
      type: 'ordinal',
      domain: {
        data: 'source',
        field: 'key'
      },
      range: ['#414141', '#ff6a6e']
    }
  ],
  legends: [
    {
      orient: 'bottom',
      fill: 'color',
      symbolSize: 120,
      offset: 0,
      zindex: 1,
      symbolType: 'circle',
      labelFont: {
        value: 'Tahoma'
      },
      labelColor: {
        value: '#24252a'
      },
      labelFontWeight: {
        value: 'lighter'
      }
    }
  ],
  marks: [
    {
      type: 'arc',
      from: {
        data: 'source'
      },
      encode: {
        enter: {
          fill: {
            scale: 'color',
            field: 'key'
          },
          x: {
            signal: 'width / 2'
          },
          y: {
            signal: 'height / 2'
          },
          tooltip: {
            signal: "datum.key + ': ' + datum.value"
          }
        },
        update: {
          startAngle: {
            field: 'startAngle'
          },
          endAngle: {
            field: 'endAngle'
          },
          padAngle: {
            value: 0.02
          },
          innerRadius: {
            signal: 'width / 20'
          },
          outerRadius: {
            signal: 'width / 2.5'
          },
          cornerRadius: {
            value: 7
          },
          opacity: {
            value: 1
          },
          zindex: {
            value: 0
          }
        },
        hover: {
          opacity: {
            value: 0.7
          }
        }
      }
    }
  ]
}
