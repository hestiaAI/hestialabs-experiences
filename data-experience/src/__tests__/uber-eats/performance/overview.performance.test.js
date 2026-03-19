import { shallowMount } from '@vue/test-utils'
import dayjs from 'dayjs'
import OverView from '@/components/chart/view/uberEats/Overview.vue'
import { periodStore } from '@/components/chart/view/uberEats/store/periodStore'
import { max } from 'lodash-es'

jest.mock('@/components/chart/view/uberEats/onboarding/tour', () => ({
  createTour: () => ({ start: jest.fn() })
}))

const mountOverview = (paymentsCount, shiftsCount) => {
  const startDate = dayjs('2023-01-02')

  const payments = generatePayments(paymentsCount, startDate)
  const shifts = generateShifts(shiftsCount, startDate)

  periodStore.setMode('week')
  periodStore.setPeriod(
    startDate.startOf('week').add(1, 'day').toISOString(),
    startDate.startOf('week').add(7, 'day').toISOString()
  )

  return shallowMount(OverView, {
    stubs: {
      ApexChart: true,
      MonthlyCalendar: true,
      TopDays: true
    },
    propsData: {
      values: [
        {
          online: { items: shifts },
          payments: { items: payments },
          trips: { items: [] },
          currency: 'CHF'
        }
      ]
    }
  })
}

// Skip performance tests unless RUN_PERF=true
const describeIfPerf = process.env.RUN_PERF === 'true' ? describe : describe.skip

describeIfPerf('OverView performance test', () => {
  const cases = [
    { payments: 100, shifts: 100, max: 150 },
    { payments: 1000, shifts: 1000, max: 400 },
    { payments: 10000, shifts: 10000, max: 2000 }
  ]

  cases.forEach(({ payments, shifts, max }) => {
    it(`payments=${payments}, shifts=${shifts}`, () => {
      const t0 = performance.now()
      const wrapper = mountOverview(payments, shifts)
      const vm = wrapper.vm

      // Force evaluation of heavy computed properties
      void vm.totalEarnings
      void vm.totalHours
      void vm.dailyStatsByDate
      void vm.paymentsByDayTotal
      void vm.top5Days
      void vm.timelineSeries
      void vm.avgDeliveryTimeFormatted

      const t1 = performance.now()
      const duration = t1 - t0

      console.log(
        `[OverView] payments=${payments}, shifts=${shifts} → ${duration.toFixed(2)}ms`
      )

      expect(duration).toBeLessThan(max)
    })
  })
})

function generatePayments(count, startDate) {
  const payments = []
  for (let i = 0; i < count; i++) {
    payments.push({
      recognizeTimestampLocal: startDate.add(i % 30, 'day').toISOString(),
      amountLocal: (Math.random() * 20 + 5).toFixed(2),
      currencyCode: 'CHF'
    })
  }
  return payments
}

function generateShifts(count, startDate) {
  const shifts = []
  for (let i = 0; i < count; i++) {
    const day = startDate.add(i % 7, 'day')
    const start = day.hour(8 + (i % 4)).minute(0)
    const end = start.add(3 + (i % 3), 'hour')

    shifts.push({
      begin_timestamp_utc: start.toISOString(),
      end_timestamp_utc: end.toISOString(),
      earner_state: i % 5 === 0 ? 'offline' : 'ontrip'
    })
  }
  return shifts
}
