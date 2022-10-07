<template>
  <div id="app">
    <!--
    <ChartView2
      v-bind="{
        graphName: 'ChartViewTimeSeries',
        data: {
          headers: ['d', 'a'],
          items: [
            {d: '2010-03-24', a: 'eat'},
            {d: '2010-03-25', a: 'eat'},
            {d: '2010-03-26', a: 'sleep'},
            {d: '2010-03-27', a: 'eat'},
            {d: '2010-03-28', a: 'sleep'}
          ]
        },
        vizProps: {
          title: 'Followers vs Followings over time',
          legendOffset: 350,
          dateAccessor: { text: 'Date', value: 'd' },
          seriesAccessor: { text: 'Action', value: 'a' }
        }
      }"
    />
    <ChartView2
      v-bind="{
        graphName: 'ChartViewHeatMapCalendar',
        data: {
          headers: ['d', 'a'],
          items: [
            {d: '2010-03-24', a: 'eat'},
            {d: '2010-03-25', a: 'eat'},
            {d: '2010-03-26', a: 'sleep'},
            {d: '2010-03-27', a: 'eat'},
            {d: '2010-03-28', a: 'sleep'}
          ]
        },
        vizProps: {
          dateAccessor: 'd'
        }
      }"
    />
    -->
    <TheDataExperience2 v-bind="{experienceConfig, siteConfig}" />
    <!--
    <HelloWorld />
     -->
  </div>
</template>
<script>
export default {
  name: 'Modul',
  data() {
    const { experiences, config } = this.$store.state
    console.log(config, experiences)
    return {
      experienceConfig: experiences.find(e => e.slug === 'twitter') || {},
      siteConfig: config
    }
  }
}
</script>
