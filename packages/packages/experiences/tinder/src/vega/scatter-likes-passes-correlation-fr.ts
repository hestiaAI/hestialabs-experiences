export default {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: 400,
  height: 400,
  padding: 5,
  autosize: 'pad',
  title: {
    text: 'Corrélation Likes/Passes',
    anchor: 'middle',
    dy: -10,
    encode: {
      title: {
        enter: {
          fill: {
            value: '#2e3131'
          },
          fontWeight: {
            value: 'lighter'
          },
          fontSize: {
            value: 16
          },
          font: {
            value: 'Tahoma'
          }
        }
      }
    }
  },
  signals: [
    {
      name: 'clear',
      value: true,
      on: [
        {
          events: 'mouseup[!event.item]',
          update: 'true',
          force: true
        }
      ]
    },
    {
      name: 'shift',
      value: false,
      on: [
        {
          events: '@legendSymbol:click, @legendLabel:click',
          update: 'event.shiftKey',
          force: true
        }
      ]
    },
    {
      name: 'clicked',
      value: null,
      on: [
        {
          events: '@legendSymbol:click, @legendLabel:click',
          update: '{value: datum.value}',
          force: true
        }
      ]
    },
    {
      name: 'brush',
      value: 0,
      on: [
        {
          events: {
            signal: 'clear'
          },
          update: 'clear ? [0, 0] : brush'
        },
        {
          events: '@xaxis:mousedown',
          update: '[x(), x()]'
        },
        {
          events: '[@xaxis:mousedown, window:mouseup] > window:mousemove!',
          update: '[brush[0], clamp(x(), 0, width)]'
        },
        {
          events: {
            signal: 'delta'
          },
          update: 'clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)'
        }
      ]
    },
    {
      name: 'anchor',
      value: null,
      on: [
        {
          events: '@brush:mousedown',
          update: 'slice(brush)'
        }
      ]
    },
    {
      name: 'xdown',
      value: 0,
      on: [
        {
          events: '@brush:mousedown',
          update: 'x()'
        }
      ]
    },
    {
      name: 'delta',
      value: 0,
      on: [
        {
          events: '[@brush:mousedown, window:mouseup] > window:mousemove!',
          update: 'x() - xdown'
        }
      ]
    },
    {
      name: 'domain',
      on: [
        {
          events: {
            signal: 'brush'
          },
          update: "span(brush) ? invert('x', brush) : null"
        }
      ]
    }
  ],
  data: [
    {
      name: 'source',
      values: [],
      transform: [
        {
          type: 'aggregate',
          fields: ['likes', 'passes', 'opens'],
          groupby: ['dateValue'],
          ops: ['sum', 'sum', 'sum'],
          as: ['Likes', 'Passes', 'Ouvertures']
        },
        {
          type: 'fold',
          fields: ['Likes', 'Passes']
        },
        {
          type: 'filter',
          expr: "(datum['Passes'] != null || datum['Likes'] != null) && datum['Ouvertures'] != null"
        }
      ]
    },
    {
      name: 'selected',
      on: [
        {
          trigger: 'clear',
          remove: true
        },
        {
          trigger: '!shift',
          remove: true
        },
        {
          trigger: '!shift && clicked',
          insert: 'clicked'
        },
        {
          trigger: 'shift && clicked',
          toggle: 'clicked'
        }
      ]
    }
  ],
  scales: [
    {
      name: 'x',
      type: 'linear',
      round: true,
      nice: true,
      zero: true,
      domain: {
        data: 'source',
        field: 'Ouvertures'
      },
      range: 'width'
    },
    {
      name: 'y',
      type: 'linear',
      round: true,
      nice: true,
      zero: true,
      domain: {
        data: 'source',
        field: 'value'
      },
      range: 'height'
    },
    {
      name: 'color',
      type: 'ordinal',
      range: ['#414141', '#ff6a6e'],
      domain: {
        data: 'source',
        field: 'key'
      }
    }
  ],
  axes: [
    {
      scale: 'x',
      grid: true,
      domain: false,
      orient: 'bottom',
      tickCount: 5,
      titlePadding: 10,
      title: "Nombre de fois que l'application est ouverte par jour",
      titleColor: {
        value: '#2e3131'
      },
      titleFontWeight: {
        value: 'bold'
      },
      titleFontSize: {
        value: 10
      },
      titleFont: {
        value: 'Tahoma'
      }
    },
    {
      scale: 'y',
      grid: true,
      domain: false,
      orient: 'left',
      titlePadding: 10,
      title: 'Nombre de likes/passes',
      titleColor: {
        value: '#2e3131'
      },
      titleFontWeight: {
        value: 'bold'
      },
      titleFontSize: {
        value: 10
      },
      titleFont: {
        value: 'Tahoma'
      }
    }
  ],
  legends: [
    {
      stroke: 'color',
      title: "Type d'action",
      titleColor: {
        value: '#2e3131'
      },
      titleFontWeight: {
        value: 'bold'
      },
      titleFontSize: {
        value: 10
      },
      titleFont: {
        value: 'Tahoma'
      },
      encode: {
        symbols: {
          name: 'legendSymbol',
          interactive: true,
          update: {
            fill: {
              value: 'transparent'
            },
            strokeWidth: {
              value: 2
            },
            opacity: [
              {
                test: "!length(data('selected')) || indata('selected', 'value', datum.value)",
                value: 0.9
              },
              {
                value: 0.15
              }
            ],
            size: {
              value: 64
            }
          }
        },
        labels: {
          name: 'legendLabel',
          interactive: true,
          update: {
            opacity: [
              {
                test: "!length(data('selected')) || indata('selected', 'value', datum.value)",
                value: 1
              },
              {
                value: 0.25
              }
            ]
          }
        }
      }
    }
  ],
  marks: [
    {
      type: 'rect',
      name: 'xaxis',
      interactive: true,
      encode: {
        enter: {
          x: {
            value: 0
          },
          height: {
            value: 35
          },
          fill: {
            value: 'transparent'
          },
          cursor: {
            value: 'ew-resize'
          }
        },
        update: {
          y: {
            signal: 'height'
          },
          width: {
            signal: "span(range('x'))"
          }
        }
      }
    },
    {
      type: 'rect',
      interactive: false,
      encode: {
        enter: {
          y: {
            value: 0
          },
          height: {
            signal: 'height'
          },
          fill: {
            value: '#ddd'
          }
        },
        update: {
          x: {
            signal: 'brush[0]'
          },
          x2: {
            signal: 'brush[1]'
          },
          fillOpacity: {
            signal: 'domain ? 0.2 : 0'
          }
        }
      }
    },
    {
      name: 'marks',
      type: 'symbol',
      from: {
        data: 'source'
      },
      interactive: false,
      encode: {
        enter: {
          tooltip: {
            signal: 'datum.value '
          }
        },
        update: {
          x: {
            scale: 'x',
            field: 'Ouvertures'
          },
          y: {
            scale: 'y',
            field: 'value'
          },
          shape: {
            value: 'circle'
          },
          strokeWidth: {
            value: 2
          },
          opacity: [
            {
              test: "(!domain || inrange(datum.open, domain)) && (!length(data('selected')) || indata('selected', 'value', datum.key))",
              value: 0.9
            },
            {
              value: 0.15
            }
          ],
          stroke: [
            {
              test: "(!domain || inrange(datum.open, domain)) && (!length(data('selected')) || indata('selected', 'value', datum.key))",
              scale: 'color',
              field: 'key'
            },
            {
              value: '#ccc'
            }
          ],
          fill: {
            value: 'transparent'
          }
        }
      }
    },
    {
      type: 'rect',
      name: 'brush',
      encode: {
        enter: {
          y: {
            value: 0
          },
          height: {
            signal: 'height'
          },
          fill: {
            value: 'transparent'
          }
        },
        update: {
          x: {
            signal: 'brush[0]'
          },
          x2: {
            signal: 'brush[1]'
          }
        }
      }
    },
    {
      type: 'rect',
      interactive: false,
      encode: {
        enter: {
          y: {
            value: 0
          },
          height: {
            signal: 'height'
          },
          width: {
            value: 1
          },
          fill: {
            value: 'firebrick'
          }
        },
        update: {
          fillOpacity: {
            signal: 'domain ? 1 : 0'
          },
          x: {
            signal: 'brush[0]'
          }
        }
      }
    },
    {
      type: 'rect',
      interactive: false,
      encode: {
        enter: {
          y: {
            value: 0
          },
          height: {
            signal: 'height'
          },
          width: {
            value: 1
          },
          fill: {
            value: 'firebrick'
          }
        },
        update: {
          fillOpacity: {
            signal: 'domain ? 1 : 0'
          },
          x: {
            signal: 'brush[1]'
          }
        }
      }
    }
  ]
}
