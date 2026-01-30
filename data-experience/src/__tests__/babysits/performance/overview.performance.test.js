/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import OverView from '@/components/chart/view/babysits/OverView.vue'
import MonthlyCalendar from '@/components/chart/view/babysits/MonthlyCalendar.vue'

// Mock the tour
jest.mock('@/components/chart/view/babysits/onboarding/babysitterTour', () => ({
  createBabysitterTour: () => ({ start: jest.fn() })
}))

// Stub ApexCharts
jest.mock('vue-apexcharts', () => ({
  name: 'ApexChart',
  render: () => null
}))

// ---- helpers -------------------------------------------------------

function generateJobs(count, startDate) {
  const jobTypes = ['Evening babysit', 'Night shift', 'Weekend care', 'Holiday care', 'After-school care']
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
      status: Math.random() > 0.3 ? 'completed' : 'paid'
    })
  }

  return jobs
}

function mountOverview(jobsCount) {
  const startDate = dayjs('2023-01-02')
  const jobs = generateJobs(jobsCount, startDate)

  return mount(OverView, {
    propsData: {
      values: jobs
    },
    stubs: {
      ApexChart: true,
      MonthlyCalendar: true
    }
  })
}

// ---- tests --------------------------------------------------------

describe('Babysits OverView performance test', () => {
  const cases = [
    { jobs: 100, max: 200 },
    { jobs: 500, max: 400 },
    { jobs: 1000, max: 600 },
    { jobs: 5000, max: 1200 }
  ]

  cases.forEach(({ jobs, max }) => {
    it(`jobs=${jobs}`, () => {
      const t0 = performance.now()

      const wrapper = mountOverview(jobs)
      const vm = wrapper.vm

      // Force evaluation of heavy computed properties
      void vm.filteredJobs
      void vm.pageJobTypes
      void vm.activityTypeColors
      void vm.totalEarnings
      void vm.totalHours
      void vm.totalJobs
      void vm.dailyStats
      void vm.timelineSeriesData
      void vm.weekHeatmapSeries

      const t1 = performance.now()
      const duration = t1 - t0

      console.log(
        `[OverView] jobs=${jobs} → ${duration.toFixed(2)}ms`
      )

      expect(duration).toBeLessThan(max)
    })
  })
})
