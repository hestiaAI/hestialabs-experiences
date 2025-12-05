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
        <div class="stat-money">{{ day.earnings.toFixed(2) }}{{ currency }}</div>
      </div>

      <div class="stats empty-stats" v-else>
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
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const start = computed(() => dayjs().year(props.year).month(props.month).startOf('month'))
    const end = computed(() => start.value.endOf('month'))

    const currency = computed(() => {
      return props.shifts[0]?.currency || 'CHF'
    })

    const selectDay = (day) => {
      emit('select-day', day.date)
    }

    const firstDayOffset = computed(() => {
      const weekday = start.value.day() // Sunday=0
      return weekday === 0 ? 6 : weekday - 1
    })

    const daysInMonth = computed(() => {
      const days = []
      const totalDays = end.value.date()

      for (let i = 1; i <= totalDays; i++) {
        const date = start.value.date(i)

        // Calculate hours worked from shifts (using duration_hours field)
        const hoursWorked = props.shifts
          .filter(s => s.date && dayjs(s.date).isSame(date, 'day'))
          .reduce((sum, s) => {
            const duration = parseFloat(
              s.duration_hours ||
              s.nbHours ||
              s.duration ||
              s.hours ||
              s.work_hours ||
              0
            )
            return sum + duration
          }, 0)

        // Calculate total earnings from shifts
        const totalEarnings = props.shifts
          .filter(s => s.date && dayjs(s.date).isSame(date, 'day'))
          .reduce((sum, s) => sum + (parseFloat(s.earnings) || 0), 0)

        days.push({
          day: i,
          date: date.toISOString(),
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
      selectDay,
      currency
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
}

.day-cell:hover {
  background-color: #ddd;
}

.day-number {
  font-size: 14px;
  font-weight: bold;
}

.stats {
  margin-top: 2px;
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
  margin-top: auto;
  margin-bottom: auto;
}
</style>
