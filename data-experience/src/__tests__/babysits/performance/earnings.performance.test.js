/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import EarningsDistribution from '@/components/chart/view/babysits/EarningsDistribution.vue'

// Stub ApexCharts
jest.mock('vue-apexcharts', () => ({
  name: 'ApexChart',
  render: () => null
}))

// ---- helpers -------------------------------------------------------

function generateJobs(count, startDate) {
  const jobTypes = ['Evening babysit', 'Night shift', 'Weekend care', 'Holiday care', 'After-school care']
  const categories = ['Ménage', 'Animaux', 'Aménagement', 'Garde d\'enfants']
  const jobs = []

  for (let i = 0; i < count; i++) {
    const day = startDate.add(i % 30, 'day')
    const startHour = 8 + (i % 12)
    const duration = 2 + (i % 4)

    jobs.push({
      job_id: `job-${i}`,
      date: day.format('YYYY-MM-DD'),
      start_time: `${String(startHour).padStart(2, '0')}:00`,
      end_time: `${String((startHour + duration) % 24).padStart(2, '0')}:00`,
      duration_hours: duration,
      earnings: (Math.random() * 30 + 15).toFixed(2),
      location: ['Basel', 'Zurich', 'Bern', 'Lucerne'][i % 4],
      job_type: jobTypes[i % jobTypes.length],
      category: categories[i % categories.length],
      status: Math.random() > 0.3 ? 'completed' : 'paid',
      currency: 'CHF'
    })
  }

  return jobs
}

function mountEarningsDistribution(jobsCount) {
  const startDate = dayjs('2023-01-02')
  const jobs = generateJobs(jobsCount, startDate)

  return mount(EarningsDistribution, {
    propsData: {
      values: jobs
    },
    stubs: {
      ApexChart: true
    }
  })
}

// ---- tests --------------------------------------------------------

// Skip performance tests unless RUN_PERF=true
const describeIfPerf =
  process.env.RUN_PERF === 'true' ? describe : describe.skip

describeIfPerf('Babysits EarningsDistribution performance test', () => {
  const cases = [
    { jobs: 100, max: 300 },
    { jobs: 500, max: 500 },
    { jobs: 1000, max: 800 },
    { jobs: 5000, max: 1800 }
  ]

  cases.forEach(({ jobs, max }) => {
    it(`jobs=${jobs}`, () => {
      const t0 = performance.now()

      const wrapper = mountEarningsDistribution(jobs)
      const vm = wrapper.vm

      // Force evaluation of heavy computed properties
      void vm.filteredJobs
      void vm.chartSeries
      void vm.totalStackedBarSeries
      void vm.earningsPerHourSeries
      void vm.totalPanelActivities
      void vm.monthDays
      void vm.latestJobDate
      void vm.earliestJobDate

      const t1 = performance.now()
      const duration = t1 - t0

      console.log(
        `[EarningsDistribution] jobs=${jobs} → ${duration.toFixed(2)}ms`
      )

      expect(duration).toBeLessThan(max)
    })
  })
})
