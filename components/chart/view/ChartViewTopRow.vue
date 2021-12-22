<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="12" class="text-center">
        <p>
          You have been targeted by <strong>{{ total }}</strong> ads between
          15/04/2021 and 13/06/2021
        </p>
        <div :id="graphId"></div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
// import * as d3 from 'd3'

export default {
  mixins: [mixin],
  props: {
    dateFormat: {
      type: String,
      default: () => '%Y-%m-%d'
    }
  },
  data() {
    return {
      total: 0
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      console.log(this.values)
    }
  }
}
</script>
<style scoped></style>
