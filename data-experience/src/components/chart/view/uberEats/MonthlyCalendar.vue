<template>
  <div class="calendar">
    <!-- Weekday headers -->
    <div class="calendar-header" v-for="d in weekDays" :key="d">
      {{ d }}
    </div>

    <!-- Empty cells before the first day -->
    <div
      v-for="n in firstDayOffset"
      :key="n"
      class="calendar-cell empty"
    ></div>

    <!-- Day cells -->
    <div
      v-for="day in daysInMonth"
      :key="day.date"
      class="calendar-cell day-cell"
      @click="selectDay(day)"
    >
      <div class="day-number">{{ day.day }}</div>

      <div class="stats" v-if="day.hours > 0 || day.earnings > 0">
        <div class="stat-hours">{{ day.hours.toFixed(1) }}h</div>
        <div class="stat-money">{{ currency }} {{ day.earnings.toFixed(2) }}</div>
      </div>

      <div class=" stats empty-stats" v-else>
        —
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import dayjs from 'dayjs'
import mixin from '@/components/chart/view/mixin'

export default {
  name: 'MonthlyCalendar',
  mixins: [mixin],
  props: {
    year: Number,
    month: Number, // 0–11
    shifts: { type: Array, default: () => [] },
    payments: { type: Array, default: () => [] }
  },
  emits: ['select-day'],
  setup(props, { emit }) {
    // Weekday labels
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // Start and end of the month
    const start = computed(() => dayjs().year(props.year).month(props.month).startOf('month'))
    const end = computed(() => start.value.endOf('month'))

    // Handle day selection
    const selectDay = (day) => {
      emit('select-day', day.date) // full ISO date string
    }

    // Currency used in the month
    const currency = computed(() => {
      return props.shifts[0]?.currency || '$'
    })

    // Offset for the first day of the month (0=Mon, 6=Sun)
    const firstDayOffset = computed(() => {
      const weekday = start.value.day() // Sunday=0
      return weekday === 0 ? 6 : weekday - 1
    })

    // Days in the month with aggregated stats
    const daysInMonth = computed(() => {
      const days = []
      const totalDays = end.value.date()

      for (let i = 1; i <= totalDays; i++) {
        const date = start.value.date(i)

        const hoursWorked = props.shifts
          .filter(s => s.begin_timestamp_utc && s.end_timestamp_utc)
          .filter(s => dayjs(s.begin_timestamp_utc).isSame(date, 'day'))
          .reduce((sum, s) => {
            const begin = dayjs(s.begin_timestamp_utc)
            const end = dayjs(s.end_timestamp_utc)
            return sum + end.diff(begin, 'hour', true)
          }, 0)

        const totalEarnings = props.payments
          .filter(p => p.recognizeTimestampLocal)
          .filter(p => dayjs(p.recognizeTimestampLocal).isSame(date, 'day'))
          .reduce((sum, p) => sum + Number(p.amountLocal || 0), 0)

        days.push({
          day: i,
          date: date.toString(),
          hours: hoursWorked,
          earnings: totalEarnings
        })
      }

      return days
    })

    return {
      weekDays,
      start,
      end,
      firstDayOffset,
      daysInMonth,
      currency,
      selectDay
    }
  }
}
</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-template-rows: 28px repeat(6, 1fr);
  gap: 6px;
  padding: 4px 10px 0px 10px;
}

.calendar-header {
  text-align: center;
  font-weight: bold;
  background: #f4f4f4;
  height: 28px;
}

.calendar-cell {
  height: 62px;
  overflow: hidden;
  border: 1px solid #ddd;
  padding: 3px;
  display: flex;
  flex-direction: column;
}

.empty {
  background: transparent;
  border: none;
}

.day-cell {
  background: white;
}

.day-cell:hover {
  background-color: #ddd;
}

.day-number {
  font-size: 14px;
  font-weight: bold;
}

.stat-hours {
  font-size: 12px;
  color: #4caf50;
}

.stat-money {
  font-size: 12px;
  color: #2196f3;
  margin-bottom: 5px;
}

.empty-stats {
  opacity: 0.3;
  font-size: 12px;
  text-align: center;
}
</style>
