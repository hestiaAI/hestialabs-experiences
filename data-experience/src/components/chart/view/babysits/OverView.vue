<template>
  <div class="p-4">
    <h2>Babysitter Jobs</h2>

    <table v-if="items.length" class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Hours</th>
          <th>Earnings</th>
          <th>Location</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(e, i) in items" :key="i">
          <td>{{ e.job_id }}</td>
          <td>{{ e.date }}</td>
          <td>{{ e.start_time }}</td>
          <td>{{ e.end_time }}</td>
          <td>{{ e.duration_hours.toFixed(2) }}</td>
          <td>{{ e.earnings ?? '-' }}</td>
          <td>{{ e.location }}</td>
          <td>{{ e.job_type }}</td>
          <td>{{ e.status }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No job data found.</p>
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
      return this.values
    }
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
