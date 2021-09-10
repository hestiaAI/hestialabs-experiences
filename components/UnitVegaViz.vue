<template>
  <div id="viz">Hi I'm vega</div>
</template>

<script>
import embed from 'vega-embed'

const someValues = [
  { category: 'A', amount: 28 },
  { category: 'B', amount: 55 },
  { category: 'C', amount: 43 },
  { category: 'D', amount: 91 },
  { category: 'E', amount: 81 },
  { category: 'F', amount: 53 },
  { category: 'G', amount: 19 },
  { category: 'H', amount: 87 }
]

const someBarChartSpec = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  description:
    'A basic bar chart example, with value labels shown upon mouse hover.',
  width: 400,
  height: 200,
  padding: 5,

  data: [
    {
      name: 'table',
      values: () => [
        { category: 'A', amount: 28 },
        { category: 'B', amount: 55 }
      ]
    }
  ],

  signals: [
    {
      name: 'tooltip',
      value: {},
      on: [
        { events: 'rect:mouseover', update: 'datum' },
        { events: 'rect:mouseout', update: '{}' }
      ]
    }
  ],

  scales: [
    {
      name: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: 'width',
      padding: 0.05,
      round: true
    },
    {
      name: 'yscale',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: 'height'
    }
  ],

  axes: [
    { orient: 'bottom', scale: 'xscale' },
    { orient: 'left', scale: 'yscale' }
  ],

  marks: [
    {
      type: 'rect',
      from: { data: 'table' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'amount' },
          y2: { scale: 'yscale', value: 0 }
        },
        update: {
          fill: { value: 'steelblue' }
        },
        hover: {
          fill: { value: 'red' }
        }
      }
    },
    {
      type: 'text',
      encode: {
        enter: {
          align: { value: 'center' },
          baseline: { value: 'bottom' },
          fill: { value: '#333' }
        },
        update: {
          x: { scale: 'xscale', signal: 'tooltip.category', band: 0.5 },
          y: { scale: 'yscale', signal: 'tooltip.amount', offset: -2 },
          text: { signal: 'tooltip.amount' },
          fillOpacity: [{ test: 'datum === tooltip', value: 0 }, { value: 1 }]
        }
      }
    }
  ]
}

export default {
  props: {
    spec: {
      type: Object,
      default: () => someBarChartSpec
      // required: true
    },
    data: {
      type: Array,
      default: () => someValues
      // default: () => []
    }
  },
  watch: {
    spec(v) {
      if (v) {
        this.draw()
      }
    }
  },
  async mounted() {
    console.log('THIS', Object.keys(this), this)
    await this.draw()
  },
  methods: {
    async draw() {
      await embed('#viz', this.buildUpdatedSpec(), { actions: false })
    },
    buildUpdatedSpec() {
      const clonedSpec = Object.assign({}, this.spec)
      clonedSpec.data = [{ name: 'table', values: this.data }]
      return clonedSpec
    }
  }
}
</script>
