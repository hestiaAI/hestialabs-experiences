<template>
  <div class="top-days-wrapper">
    <h3>Top 5 Most Profitable Days (All Time)</h3>

    <table class="top-days-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Earnings</th>
          <th>Total time worked</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="d in days" :key="d.date">
          <td>{{ format(d.date) }}</td>
          <td>{{ d.amount.toFixed(2) }} {{ currency }}</td>
          <td>{{ d.hours }} h</td>
        </tr>
      </tbody>
    </table>

    <div v-if="days.length === 0">
      No payment data available.
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'TopDays',
  props: {
    days: Array,
    currency: String
  },
  methods: {
    /**
     * Transform dayjs date to DD.MM.YYYY format
     * @param d
     */
    format(d) {
      return dayjs(d).format('DD.MM.YYYY')
    }
  }
}
</script>

<style scoped>
.top-days-wrapper {
  width: 100%;
  text-align: center;
}

.top-days-table {
  margin-top: 16px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}

.top-days-table th,
.top-days-table td {
  border: 1px solid #aaa;
  padding: 8px 12px;
}

.top-days-table th {
  background-color: #ddd;
}
</style>
