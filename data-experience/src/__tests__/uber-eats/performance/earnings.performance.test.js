/**
 * @jest-environment jsdom
 */

jest.mock('@/components/chart/view/mixin', () => ({
  methods: {
    drawChart: jest.fn()
  }
}))

import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import Earnings from '@/components/chart/view/uberEats/Earnings.vue'
import { periodStore } from '@/components/chart/view/uberEats/store/periodStore'

// Stub ApexCharts (we test data prep, not rendering)
jest.mock('vue-apexcharts', () => ({
  name: 'ApexChart',
  render: () => null
}))

// ---- helpers ------------------------------------------------------

function generatePayments(count, startDate) {
  const payments = []

  for (let i = 0; i < count; i++) {
    payments.push({
      recognizeTimestampLocal: startDate
        .add(i % 30, 'day')
        .toISOString(),
      amountLocal: (Math.random() * 20 + 5).toFixed(2),
      currencyCode: 'CHF',
      category: i % 5 === 0 ? 'tip' : 'delivery'
    })
  }

  return payments
}

function generateShifts(count, startDate) {
  const shifts = []

  for (let i = 0; i < count; i++) {
    const day = startDate.add(i % 7, 'day')
    const start = day.hour(10).minute(0)
    const end = start.add(2 + (i % 3), 'hour')

    shifts.push({
      begin: start.toISOString(),
      end: end.toISOString()
    })
  }

  return shifts
}

function mountEarnings(paymentsCount, shiftsCount) {
  const startDate = dayjs('2023-01-02')

  const payments = generatePayments(paymentsCount, startDate)
  const shifts = generateShifts(shiftsCount, startDate)

  periodStore.setMode('week')
  periodStore.setPeriod(
    startDate.startOf('week').add(1, 'day').toISOString(),
    startDate.startOf('week').add(7, 'day').toISOString()
  )

  return mount(Earnings, {
    propsData: {
      values: [
        {
          payments: { items: payments },
          online: { items: shifts }
        }
      ]
    },

    mounted() {},

    stubs: {
      ApexChart: true
    }
  })
}

// ---- tests --------------------------------------------------------

describe('Earnings performance test', () => {
  const cases = [
    { payments: 100, shifts: 100, max: 150 },
    { payments: 1000, shifts: 1000, max: 400 },
    { payments: 10000, shifts: 10000, max: 1200 } // sentinel
  ]

  cases.forEach(({ payments, shifts, max }) => {
    it(`payments=${payments}, shifts=${shifts}`, () => {
      const t0 = performance.now()

      const wrapper = mountEarnings(payments, shifts)
      const vm = wrapper.vm

      // Force evaluation of heavy computed properties
      void vm.allDays
      void vm.hoursPerDay
      void vm.earningsByDay
      void vm.earningsByYear
      void vm.avgEarningsPerDay
      void vm.avgEarningsByYear
      void vm.chartData
      void vm.chartSeries
      void vm.chartOptions

      const t1 = performance.now()
      const duration = t1 - t0

      console.log(
        `[Earnings] payments=${payments}, shifts=${shifts} → ${duration.toFixed(2)}ms`
      )

      expect(duration).toBeLessThan(max)
    })
  })
})