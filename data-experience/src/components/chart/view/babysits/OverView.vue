<template>
  <div class="p-4">
    <h2>Online/Offline Shifts</h2>

    <ul v-if="values && values.length">
      <li v-for="(entry, i) in values" :key="i">
        {{ entry.begin }} – {{ entry.end }} ({{ parseFloat(entry.hours).toFixed(2) }} hours)
      </li>
    </ul>

    <p v-else>No shift data found.</p>
  </div>
</template>

<script>
import mixin from '@/components/chart/view/mixin'

export default {
  name: 'OverView',
  mixins: [mixin],

  computed: {
    items() {
      if (!this.values || !this.values.length) return []
      return this.values.map(v => ({
        begin: v.begin ?? v.Begin ?? '',
        end: v.end ?? v.End ?? '',
        hours: Number.parseFloat(v.hours ?? v.Hours ?? 0)
      }))
    }
  },

  watch: {
    values(newVal) {
      console.log('Values loaded:', newVal)
    }
  },
  mounted() {
    console.log('Headers:', this.headers)
    console.log('Items:', this.items)
    console.log('Values:', this.values)
  }
}
</script>

<style>
.uber-eats-tabs-wrapper .v-tabs {
  width: 500px;
  margin-left: 16px;
}

.uber-eats-tabs-wrapper .v-tabs-slider {
  background-color: green !important;
}
</style>
