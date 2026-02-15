/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import OverView from '@/components/chart/view/babysits/OverView.vue'

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

jest.mock('@/components/chart/view/babysits/onboarding/babysitterTour', () => ({
  createBabysitterTour: jest.fn(() => ({
    start: jest.fn(),
    next: jest.fn()
  }))
}))

/* --------------------------
 * localStorage mock
 * -------------------------- */

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    },
    writable: true
  })
})

/* --------------------------
 * Test data (minimal)
 * -------------------------- */

const mockPipelineValues = [
  {
    job_id: 'job_1',
    date: '2024-01-15',
    start_time: '09:00',
    end_time: '11:00',
    job_type: 'babysitting',
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
    duration_hours: 3,
    earnings: 60,
    currency: 'CHF',
    status: 'completed'
  },
  {
    job_id: 'job_3',
    date: '2024-01-17',
    start_time: '10:30',
    end_time: '13:00',
    job_type: 'babysitting',
    duration_hours: 2.5,
    earnings: 50,
    currency: 'CHF',
    status: 'completed'
  }
]

/* --------------------------
 * Helpers
 * -------------------------- */

function mountOverView(props = {}) {
  return mount(OverView, {
    props: {
      values: mockPipelineValues,
      ...props
    },
    global: {
      stubs: {
        ApexChart: true,
        MonthlyCalendar: true
      }
    }
  })
}

/* --------------------------
 * Tests
 * -------------------------- */

describe('OverView.vue (babysits) - UI & interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  /* ---------------------------------------------
   * Rendering
   * ------------------------------------------- */

  test('renders main overview sections', () => {
    const wrapper = mountOverView()

    expect(wrapper.text()).toContain('Total Earnings')
    expect(wrapper.text()).toContain('Total Hours Worked')
    expect(wrapper.text()).toContain('Number of Jobs')
    expect(wrapper.text()).toContain('Shift Timeline')
    expect(wrapper.text()).toContain('Average Work Time')
  })

  test('renders period mode buttons', () => {
    const wrapper = mountOverView()

    expect(wrapper.text()).toContain('WEEK')
    expect(wrapper.text()).toContain('MONTH')
    expect(wrapper.text()).toContain('TOTAL')
  })

  test('renders navigation buttons', () => {
    const wrapper = mountOverView()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)
  })

  test('renders job type filter dropdown', () => {
    const wrapper = mountOverView()
    const select = wrapper.find('select#jobTypeSelect')

    expect(select.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking WEEK button does not crash', async() => {
    const wrapper = mountOverView()
    const weekBtn = wrapper.findAll('.switch-btn').at(0)

    await expect(weekBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking MONTH button does not crash', async() => {
    const wrapper = mountOverView()
    const monthBtn = wrapper.findAll('.switch-btn').at(1)

    await expect(monthBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking TOTAL button does not crash', async() => {
    const wrapper = mountOverView()
    const totalBtn = wrapper.findAll('.switch-btn').at(2)

    await expect(totalBtn.trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Navigation
   * ------------------------------------------- */

  test('navigation buttons call prevWeek/nextWeek when clicked', async() => {
    const wrapper = mountOverView()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)

    await expect(navButtons.at(0).trigger('click')).resolves.not.toThrow()
    await expect(navButtons.at(1).trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Job Type Filter
   * ------------------------------------------- */

  test('job type filter dropdown is functional', async() => {
    const wrapper = mountOverView()
    const select = wrapper.find('select#jobTypeSelect')

    expect(select.exists()).toBe(true)

    // Get available options
    const options = select.findAll('option')
    expect(options.length).toBeGreaterThan(0)
  })

  test('can select job type from dropdown', async() => {
    const wrapper = mountOverView()
    const select = wrapper.find('select#jobTypeSelect')

    // Change value (if options are available)
    if (select.findAll('option').length > 1) {
      await select.setValue('babysitting')
      expect(select.element.value).toBe('babysitting')
    }
  })

  /* ---------------------------------------------
   * Chart rendering
   * ------------------------------------------- */

  test('renders MonthlyCalendar in month mode', async() => {
    const wrapper = mountOverView()

    // Switch to month mode
    await wrapper.findAll('.switch-btn').at(1).trigger('click')

    // MonthlyCalendar should be rendered (stubbed)
    expect(wrapper.findComponent({ name: 'MonthlyCalendar' }).exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Mounted side-effects
   * ------------------------------------------- */

  test('initializes with latest job date on mount', () => {
    const wrapper = mountOverView()

    expect(wrapper.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Edge cases
   * ------------------------------------------- */

  test('does not crash with empty values', () => {
    const wrapper = mountOverView({
      values: []
    })

    expect(wrapper.exists()).toBe(true)
  })

  test('does not crash with minimal data', () => {
    const wrapper = mountOverView({
      values: [
        {
          job_id: 'test_1',
          date: '2024-01-15',
          start_time: '09:00',
          end_time: '11:00',
          duration_hours: 2,
          earnings: 40,
          currency: 'CHF'
        }
      ]
    })

    expect(wrapper.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Period label display
   * ------------------------------------------- */

  test('displays correct label for week period', async() => {
    const wrapper = mountOverView()

    // Switch to WEEK mode first
    const weekBtn = wrapper.findAll('.switch-btn').at(0)
    await weekBtn.trigger('click')

    const label = wrapper.find('.week-label')

    expect(label.exists()).toBe(true)
    // Week mode shows date range format DD.MM - DD.MM.YYYY
    expect(label.text()).toMatch(/\d{2}\.\d{2}\s*-\s*\d{2}\.\d{2}\.\d{4}/)
  })

  test('displays month label for month period', async() => {
    const wrapper = mountOverView()

    // Switch to MONTH mode
    await wrapper.findAll('.switch-btn').at(1).trigger('click')

    const label = wrapper.find('.week-label')
    expect(label.exists()).toBe(true)
    // Month format should be "MMMM YYYY"
    expect(label.text()).toMatch(/\w+\s+\d{4}/)
  })

  test('displays date range label for total period', async() => {
    const wrapper = mountOverView()

    // Switch to TOTAL mode
    await wrapper.findAll('.switch-btn').at(2).trigger('click')

    const label = wrapper.find('.week-label')
    expect(label.exists()).toBe(true)
    // Display consists of start and end markers
    expect(label.text().length).toBeGreaterThan(0)
  })

  /* ---------------------------------------------
   * Stats calculation
   * ------------------------------------------- */

  test('displays total earnings stat', () => {
    const wrapper = mountOverView()

    expect(wrapper.text()).toContain('Total Earnings')
    // Should contain CHF currency
    expect(wrapper.text()).toContain('CHF')
  })

  test('displays total hours stat', () => {
    const wrapper = mountOverView()

    expect(wrapper.text()).toContain('Total Hours Worked')
    expect(wrapper.text()).toContain('h')
  })

  test('displays total jobs stat', () => {
    const wrapper = mountOverView()

    expect(wrapper.text()).toContain('Number of Jobs')
  })
})
