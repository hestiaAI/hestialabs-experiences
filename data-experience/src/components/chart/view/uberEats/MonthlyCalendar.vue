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
    >
      <div class="day-number">{{ day.day }}</div>

      <div class="stats" v-if="day.hours > 0 || day.earnings > 0">
        <div class="stat-hours">{{ formatMinutesToHM(day.minutes) }}</div>
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
    month: Number,
    dailyStats: { type: Object, required: true },
    currency: { type: String, default: '$' },
    selectedDate: String
  },
  emits: ['select-day'],
  setup(props, { emit }) {
    // Weekday labels
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // Start and end of the month
    const start = computed(() => {
      if (
        typeof props.year !== 'number' ||
        typeof props.month !== 'number'
      ) return dayjs.invalid()

      return dayjs(`${props.year}-${String(props.month + 1).padStart(2, '0')}-01`)
    })

    const end = computed(() => {
      return start.value.isValid() ? start.value.endOf('month') : dayjs.invalid()
    })

    // Handle day selection
    const selectDay = (day) => {
      emit('select-day', day.date) // full ISO date string
    }

    // Check if a day is selected
    const isSelectedDay = (day) => {
      if (!props.selectedDate) return false
      return dayjs(props.selectedDate).isSame(dayjs(day.date), 'day')
    }

    // Offset for the first day of the month (0=Mon, 6=Sun)
    const firstDayOffset = computed(() => {
      if (!start.value.isValid()) return 0
      const weekday = start.value.day() // Sunday=0
      return weekday === 0 ? 6 : weekday - 1
    })

    // Days in the month with aggregated stats
    const daysInMonth = computed(() => {
      if (!start.value.isValid() || !end.value.isValid()) return []

      const days = []
      const totalDays = end.value.date()

      for (let i = 1; i <= totalDays; i++) {
        const date = start.value.clone().date(i)
        const key = date.format('YYYY-MM-DD')
        const stat = props.dailyStats[key] || { earnings: 0, minutes: 0 }

        const minutes = Number(stat.minutes || 0)

        days.push({
          day: i,
          date: key,
          minutes,
          hours: minutes / 60,
          earnings: stat.earnings || 0
        })
      }

      return days
    })

    // Helper to format minutes to "Xh YYmin"
    const formatMinutesToHM = (totalMinutes) => {
      const m = Math.max(0, Math.round(totalMinutes || 0))
      const h = Math.floor(m / 60)
      const mm = m % 60
      return `${String(h).padStart(2, '0')}h ${String(mm).padStart(2, '0')}min`
    }

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
      isSelectedDay,
      selectDay
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

.stat-hours {
  font-size: 11px;
  color: #4caf50;
}

.stat-money {
  font-size: 11px;
  color: #2196f3;
  margin-bottom: 5px;
}

.empty-stats {
  opacity: 0.3;
  font-size: 12px;
  text-align: center;
}

/* Mobile layout */
@media (max-width: 768px) {
  .calendar-header {
    font-size: 12px;
    height: 24px;
  }

  .day-number {
    font-size: 11px;
  }

  .stat-hours, .stat-money {
    font-size: 9px;
  }
}
</style>
