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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8%;
  margin-bottom: 32px;
}

.top-days-table {
  width: 70%;
  border-collapse: collapse;
  margin: 22px auto 44px auto;
}

.top-days-table th,
.top-days-table td {
  padding: 20px 24px;
  text-align: center;
}

.top-days-table th,
.top-days-table tr:not(:last-child) {
  border-bottom: 1px solid #ccc;
}

.top-days-table th:not(:last-child),
.top-days-table td:not(:last-child) {
  border-right: 1px solid #ccc;
}

.top-days-table thead {
  background-color: #fff3e0;
  font-weight: 600;
}

.top-days-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

.top-days-table tbody tr:nth-child(even) {
  background-color: #ffffff;
}

.top-days-table tbody tr:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .top-days-table th,
  .top-days-table td {
    padding: 12px 12px;
    text-align: center;
  }

  .top-days-table {
    width: 90%;
  }
}
</style>
