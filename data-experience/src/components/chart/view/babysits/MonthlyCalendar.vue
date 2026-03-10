<template>
  <div class="calendar">
    <!-- Grey overlay if no month data -->
    <div v-if="!hasMonthData" class="calendar-overlay">
      <div class="overlay-box">
        <div class="overlay-title">No data for this month</div>
        <div class="overlay-text">
          Check whether your dataset is empty, or select another month.
        </div>
      </div>
    </div>

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
      :class="{ selected: isSelectedDay(day) }"
      @click="selectDay(day)"
      :title="`${day.day} - Click to view week`"
    >
      <div class="day-number">{{ day.day }}</div>

      <div class="stats" v-if="day.hours > 0 || day.earnings > 0">
        <div class="stat-job-type" v-if="day.jobTypes.length > 0">
          {{ day.jobTypes.join(', ') }}
        </div>
        <div class="stat-hours">{{ formatMinutesToHM(day.minutes) }}</div>
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
    payments: { type: Array, default: () => [] },
    selectedDate: String // ISO date string
  },
  emits: ['select-day'],
  setup(props, { emit }) {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const start = computed(() => dayjs().year(props.year).month(props.month).startOf('month'))
    const end = computed(() => start.value.endOf('month'))

    // Determine the currency to display based on the first shift's currency (if available)
    const currency = computed(() => {
      return props.shifts[0]?.currency || 'CHF'
    })

    // On day selection, emit the 'select-day' event with the selected date
    const selectDay = (day) => {
      emit('select-day', day.date)
    }

    // Check if a given day is the currently selected day (for highlighting in the calendar)
    const isSelectedDay = (day) => {
      if (!props.selectedDate) return false
      return dayjs(props.selectedDate).isSame(dayjs(day.date), 'day')
    }

    // Calculate the offset for the first day of the month to determine how many empty cells to render before it
    const firstDayOffset = computed(() => {
      const weekday = start.value.day() // Sunday=0
      return weekday === 0 ? 6 : weekday - 1
    })

    // Prepare the data for each day in the month by aggregating shifts and payments
    const formatMinutesToHM = (totalMinutes) => {
      const m = Math.max(0, Math.round(totalMinutes || 0))
      const h = Math.floor(m / 60)
      const mm = m % 60
      return `${String(h).padStart(2, '0')}h ${String(mm).padStart(2, '0')}min`
    }

    // For each day of the month, calculate total minutes worked, total earnings, and job types
    const daysInMonth = computed(() => {
      if (!start.value.isValid() || !end.value.isValid()) return []

      const days = []
      const totalDays = end.value.date()

      for (let i = 1; i <= totalDays; i++) {
        const date = start.value.clone().date(i)

        const dayShifts = props.shifts.filter(
          s => s.date && dayjs(s.date).isSame(date, 'day')
        )

        // Sum minutes (prefer a minutes field if it exists; otherwise derive from hours)
        const minutesWorked = dayShifts.reduce((sum, s) => {
          const mins = parseFloat(s.minutes || s.duration_minutes || 0)
          if (!Number.isNaN(mins) && mins > 0) return sum + mins

          const hours = parseFloat(
            s.duration_hours ||
              s.nbHours ||
              s.duration ||
              s.hours ||
              s.work_hours ||
              0
          )
          return sum + (Number.isFinite(hours) ? hours * 60 : 0)
        }, 0)

        const hoursWorked = minutesWorked / 60

        const totalEarnings = dayShifts.reduce(
          (sum, s) => sum + (parseFloat(s.earnings) || 0),
          0
        )

        const jobTypes = [
          ...new Set(dayShifts.map(s => s.job_type).filter(Boolean))
        ]

        days.push({
          day: i,
          date: date.toISOString(),
          minutes: minutesWorked,
          hours: hoursWorked,
          earnings: totalEarnings,
          jobTypes
        })
      }

      return days
    })

    // true if at least one day has hours or earnings > 0
    const hasMonthData = computed(() =>
      daysInMonth.value.some(d => (d.hours ?? 0) > 0 || (d.earnings ?? 0) > 0)
    )

    return {
      weekDays,
      start,
      end,
      firstDayOffset,
      daysInMonth,
      hasMonthData,
      formatMinutesToHM,
      selectDay,
      currency,
      isSelectedDay
    }
  }
}
</script>

<style scoped>
.calendar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-template-rows: 28px repeat(6, 1fr);
  gap: 6px;
  padding-top: 4px;
}

/* Overlay on top of the calendar grid */
.calendar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(240, 240, 240, 0.6);
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.overlay-box {
  pointer-events: auto;
  text-align: center;
}

.overlay-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.overlay-text {
  font-size: 13px;
  opacity: 0.85;
}

.calendar-header {
  text-align: center;
  font-weight: bold;
  background: #f4f4f4;
  border: 1px solid #b9b9b9;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-header:nth-child(6),
.calendar-header:nth-child(7) {
  background: #e3f2fd;
  border-color: #2196f377;
}

.calendar-cell {
  height: 78px;
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

.day-cell.selected {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
  box-shadow: 0 0 8px rgba(255, 152, 0, 0.3);
}

.day-cell:hover {
  background-color: #f2f2f2;
  box-shadow:
      0 2px 1px -1px rgba(0,0,0,.22),
      0 1px 3px 0 rgba(0,0,0,.18);
}

.day-number {
  font-size: 13px;
  font-weight: bold;
}

.stat-job-type {
  font-size: 10px;
  color: #ff9800;
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

@media (max-width: 768px) {
  .calendar { padding: 4px 6px 0 6px; gap: 4px; }
  .calendar-header { height: 24px; font-size: 12px; }
  .calendar-cell { height: 90px; padding: 2px; }
  .day-number { font-size: 11px; }
  .stat-hours, .stat-money { font-size: 9px; }
  .empty-stats { font-size: 11px; }
}
</style>
