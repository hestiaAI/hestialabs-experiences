/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import EarningsDistribution from '@/components/chart/view/babysits/EarningsDistribution.vue'

/* --------------------------
 * Mocks
 * -------------------------- */

jest.mock('vue-apexcharts', () => ({
  __esModule: true,
  default: {
    name: 'ApexChart',
    render: () => null
  }
}))

/* --------------------------
 * Test data
 * -------------------------- */

const mockPipelineValues = [
  {
    job_id: 'job_1',
    date: '2024-01-15',
    start_time: '09:00',
    end_time: '11:00',
    job_type: 'babysitting',
    category: 'Garde d\'enfants',
    duration_hours: 2,
    earnings: 40,
    currency: 'CHF',
    status: 'completed'
  },
  {
    job_id: 'job_2',
    date: '2024-01-16',
    start_time: '14:00',
    end_time: '17:00',
    job_type: 'household',
    category: 'Ménage',
    duration_hours: 3,
    earnings: 60,
    currency: 'CHF',
    status: 'completed'
  },
  {
    job_id: 'job_3',
    date: '2024-01-17',
    start_time: '22:30',
    end_time: '23:30',
    job_type: 'babysitting',
    category: 'Garde d\'enfants',
    duration_hours: 1,
    earnings: 25,
    currency: 'CHF',
    status: 'completed'
  }
]

/* --------------------------
 * Helpers
 * -------------------------- */

function mountEarningsDistribution(props = {}) {
  return mount(EarningsDistribution, {
    props: {
      values: mockPipelineValues,
      ...props
    },
    global: {
      stubs: {
        ApexChart: true,
        EarningsByDay: true,
        TotalStackedBar: true,
        EarningsPerHourBar: true
      }
    }
  })
}

/* --------------------------
 * Tests
 * -------------------------- */

describe('EarningsDistribution.vue - UI & interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset periodStore between tests
    const { periodStore } = require('@/components/chart/view/babysits/store/periodStore')
    periodStore.mode = 'week'
    periodStore.periodStart = null
    periodStore.periodEnd = null
    periodStore.allTimeStart = null
    periodStore.allTimeEnd = null
    // Initialize period to match test data so week label is predictable
    const dayjs = require('dayjs')
    const latest = mockPipelineValues
      .map(v => dayjs(v.date))
      .filter(d => d.isValid())
      .sort((a, b) => b.valueOf() - a.valueOf())[0]
    if (latest) {
      const day = latest.day()
      const monday = day === 0 ? latest.subtract(6, 'day').startOf('day') : latest.subtract(day - 1, 'day').startOf('day')
      periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
    }
  })

  /* ---------------------------------------------
   * Basic rendering
   * ------------------------------------------- */

  test('renders period switch buttons', () => {
    const wrapper = mountEarningsDistribution()
    const buttons = wrapper.findAll('.switch-btn')

    expect(buttons.length).toBe(3)
    expect(wrapper.text()).toContain('WEEK')
    expect(wrapper.text()).toContain('MONTH')
    expect(wrapper.text()).toContain('TOTAL')
  })

  test('renders navigation buttons', () => {
    const wrapper = mountEarningsDistribution()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)
  })

  test('renders earnings distribution header', () => {
    const wrapper = mountEarningsDistribution()
    expect(wrapper.text()).toContain('Earnings by Time of Day')
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking WEEK button does not crash', async() => {
    const wrapper = mountEarningsDistribution()
    const weekBtn = wrapper.findAll('.switch-btn').at(0)

    await expect(weekBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking MONTH button does not crash', async() => {
    const wrapper = mountEarningsDistribution()
    const monthBtn = wrapper.findAll('.switch-btn').at(1)

    await expect(monthBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking TOTAL button does not crash', async() => {
    const wrapper = mountEarningsDistribution()
    const totalBtn = wrapper.findAll('.switch-btn').at(2)

    await expect(totalBtn.trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Navigation buttons
   * ------------------------------------------- */

  test('prev / next navigation buttons are clickable', async() => {
    const wrapper = mountEarningsDistribution()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)

    await expect(navButtons.at(0).trigger('click')).resolves.not.toThrow()
    await expect(navButtons.at(1).trigger('click')).resolves.not.toThrow()
  })

  /* ----------- Removed: tests for job list panel - structure changed in new UI --------- */

  test('renders total layout in TOTAL mode', async() => {
    const wrapper = mountEarningsDistribution()

    // Switch to TOTAL mode
    await wrapper.findAll('.switch-btn').at(2).trigger('click')

    const totalLayout = wrapper.find('.total-layout')
    expect(totalLayout.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Data validation
   * ------------------------------------------- */

  test('renders without crashing with empty values', () => {
    const wrapper = mountEarningsDistribution({
      values: []
    })

    expect(wrapper.exists()).toBe(true)
  })

  test('renders without crashing with minimal data', () => {
    const wrapper = mountEarningsDistribution({
      values: [
        {
          job_id: 'test_1',
          date: '2024-01-15',
          start_time: '09:00',
          duration_hours: 1,
          earnings: 20,
          currency: 'CHF'
        }
      ]
    })

    expect(wrapper.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Period label display
   * ------------------------------------------- */

  test('displays correct label for week period', () => {
    const wrapper = mountEarningsDistribution()
    const label = wrapper.find('.week-label')

    expect(label.exists()).toBe(true)
    expect(label.text()).toMatch(/\d{2}\.\d{2}\s*-\s*\d{2}\.\d{2}\.\d{4}/)
  })

  test('displays date range label for total period', async() => {
    const wrapper = mountEarningsDistribution()

    // Switch to TOTAL mode
    await wrapper.findAll('.switch-btn').at(2).trigger('click')

    const label = wrapper.find('.week-label')
    expect(label.exists()).toBe(true)
    // In total mode, can show either date range or "Entire Period"
    const text = label.text()
    expect(
      text === 'Entire Period' || /\d{2}\.\d{2}\.\d{4}\s*-\s*\d{2}\.\d{2}\.\d{4}/.test(text)
    ).toBe(true)
  })

  test('renders stacked bar chart in TOTAL mode with category data', async() => {
    const wrapper = mountEarningsDistribution()

    await wrapper.findAll('.switch-btn').at(2).trigger('click')

    const vm = wrapper.vm

    expect(Array.isArray(vm.totalStackedBarSeries)).toBe(true)

    expect(wrapper.find('.total-layout').exists()).toBe(true)
  })
})
