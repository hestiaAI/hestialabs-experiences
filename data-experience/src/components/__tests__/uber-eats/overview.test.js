/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import Overview from '@/components/chart/view/uberEats/Overview.vue'

/* --------------------------
 * Mocks
 * -------------------------- */

// Mock ApexCharts
jest.mock('vue-apexcharts', () => ({
  __esModule: true,
  default: {
    name: 'ApexChart',
    render: () => null
  }
}))

// Mock periodStore (interaction only)
jest.mock('@/components/chart/view/uberEats/store/periodStore', () => ({
  periodStore: {
    mode: 'week',
    periodStart: '2023-10-09T00:00:00.000Z',
    periodEnd: '2023-10-15T23:59:59.999Z',
    setMode: jest.fn(),
    setPeriod: jest.fn(),
    initFromTrips: jest.fn()
  }
}))

// Mock onboarding tour
jest.mock('@/components/chart/view/uberEats/onboarding/tour', () => ({
  createTour: jest.fn(() => ({
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
    online: { items: [] },
    payments: { items: [] },
    trips: {
      items: [
        {
          deliveryStatus: 'completed',
          dropoffDeliveryDistanceKm: 0.055
        }
      ]
    }
  }
]

/* --------------------------
 * Helpers
 * -------------------------- */

function mountOverview(props = {}) {
  return mount(Overview, {
    props: {
      values: mockPipelineValues,
      ...props
    },
    global: {
      stubs: {
        ApexChart: true,
        MonthlyCalendar: true,
        TopDays: true
      }
    }
  })
}

/* --------------------------
 * Tests
 * -------------------------- */

describe('Overview.vue (Option A – UI & interactions)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  /* ---------------------------------------------
   * Rendering
   * ------------------------------------------- */

  test('renders main overview sections', () => {
    const wrapper = mountOverview()

    expect(wrapper.text()).toContain('Total Earnings')
    expect(wrapper.text()).toContain('Total Hours Worked')
    expect(wrapper.text()).toContain('Number of Deliveries')
    expect(wrapper.text()).toContain('Distance travelled')
    expect(wrapper.text()).toContain('Average delivery time')
  })

  test('renders period mode buttons', () => {
    const wrapper = mountOverview()

    expect(wrapper.text()).toContain('WEEK')
    expect(wrapper.text()).toContain('MONTH')
    expect(wrapper.text()).toContain('TOTAL')
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking MONTH calls periodStore.setMode', async () => {
    const wrapper = mountOverview()

    const btn = wrapper
      .findAll('button')
      .filter(b => b.text() === 'MONTH')
      .at(0)

    expect(btn).toBeTruthy()

    await btn.trigger('click')

    const { periodStore } =
      require('@/components/chart/view/uberEats/store/periodStore')

    expect(periodStore.setMode).toHaveBeenCalledWith('month')
  })

  test('clicking TOTAL calls periodStore.setMode', async () => {
    const wrapper = mountOverview()

    const btn = wrapper
      .findAll('button')
      .filter(b => b.text() === 'TOTAL')
      .at(0)

    expect(btn).toBeTruthy()

    await btn.trigger('click')

    const { periodStore } =
      require('@/components/chart/view/uberEats/store/periodStore')

    expect(periodStore.setMode).toHaveBeenCalledWith('total')
  })

  /* ---------------------------------------------
   * Navigation
   * ------------------------------------------- */

  test('navigation buttons call setPeriod when clicked', async () => {
    const wrapper = mountOverview()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBeGreaterThan(0)

    await navButtons.at(0).trigger('click')

    const { periodStore } =
      require('@/components/chart/view/uberEats/store/periodStore')

    expect(periodStore.setPeriod).toHaveBeenCalled()
  })

  /* ---------------------------------------------
   * Mounted side-effects
   * ------------------------------------------- */

  test('initializes periodStore from trips on mount', () => {
    mountOverview()

    const { periodStore } =
      require('@/components/chart/view/uberEats/store/periodStore')

    expect(periodStore.initFromTrips).toHaveBeenCalled()
  })

  test('starts onboarding tour when not shown before', () => {
    mountOverview()

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'uberEatsTourShown',
      'yes'
    )
  })

  /* ---------------------------------------------
   * Edge cases
   * ------------------------------------------- */

  test('does not crash with empty values', () => {
    const wrapper = mountOverview({
      values: [{ online: {}, payments: {}, trips: {} }]
    })

    expect(wrapper.exists()).toBe(true)
  })
})
