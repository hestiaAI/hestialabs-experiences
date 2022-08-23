<template>
  <div id="app">
    <DummyButton />
    <ChartViewBar values:="[1, 5, 3]" headers:="['mimi', 'toto', 'gugu']" />

    <ChartViewTimeSeries
      v-bind="{
        values: [
          {d: '2010-03-24', a: 'eat'},
          {d: '2010-03-25', a: 'eat'},
          {d: '2010-03-26', a: 'sleep'},
          {d: '2010-03-27', a: 'eat'},
          {d: '2010-03-28', a: 'sleep'}
        ],
        title: 'Followers vs Followings over time',
        legendOffset: 350,
        dateAccessor: { text: 'Date', value: 'd' },
        seriesAccessor: { text: 'Action', value: 'a' }
      }"
    />
    <HelloWorld />
  </div>
</template>
<script>
export default {
  name: 'Modul'
}
</script>
