<template>
  <VContainer>
    <VRow><div id="my_dataviz" /></VRow>
  </VContainer>
</template>

<script>
// import * as d3 from 'd3'
// import * as dc from 'dc'
// import _ from 'lodash'
// import mixin from './mixin'
//
// export default {
//  name: 'HelloWorld',
//  mixins: [mixin],
//  props: {
//    msg: String
//  },
//  mounted() {
//    console.log(this.values)
//  },
//  methods: {
//    drawViz() {
//      const categoriesToKeep = [
//        'FingerprintingGeneral',
//        'FingerprintingInvasive'
//      ]
//
//      this.result = this.values.filter(
//        row => categoriesToKeep.includes(row.Category) && row.uncertain === '0'
//      )
//      result.map(o => _.pick(o, ['App', 'Tracker']))
//
//      const nodesToRemove = ['Chrome', 'Firefox', 'Samsung Internet']
//      this.result = result.filter(row => !nodesToRemove.includes(row.App))
//    }
//  }
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
