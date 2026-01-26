/**
 * @jest-environment jsdom
 */

import { shallowMount } from '@vue/test-utils'
import MyRoutes from '@/components/chart/view/uberEats/MyRoutes.vue'

/* -----------------------------------------------------
 * Mocks
 * --------------------------------------------------- */

jest.mock('@turf/turf')
jest.mock('@turf/bbox')

// Mock periodStore
jest.mock('@/components/chart/view/uberEats/store/periodStore', () => ({
  periodStore: {
    mode: 'week',
    periodStart: '2023-10-09T00:00:00.000Z',
    periodEnd: '2023-10-15T23:59:59.999Z',
    setMode: jest.fn(),
    setPeriod: jest.fn()
  }
}))

// Mock Kepler component
jest.mock('@/components/unit/UnitKepler.vue', () => ({
  name: 'UnitKepler',
  template: '<div class="kepler-stub" />',
  methods: {
    callIframeFunction: jest.fn()
  }
}))

/* -----------------------------------------------------
 * Test data
 * --------------------------------------------------- */

const mockValues = [
  {
    trips: {
      items: [
        {
          cityName: 'Basel',
          courierAcceptTimestampLocal: '2023-10-10T12:00:00.000Z',
          courierDropoffTimestampLocal: '2023-10-10T12:30:00.000Z',
          dropoffDeliveryDistanceKm: 2.1,
          deliveryStatus: 'completed'
        }
      ]
    }
  }
]

/* -----------------------------------------------------
 * Helpers
 * --------------------------------------------------- */

function mountComponent(props = {}) {
  return shallowMount(MyRoutes, {
    props: {
      values: mockValues,
      mapboxToken: 'test-token',
      ...props
    },
    global: {
      stubs: {
        UnitKepler: true
      }
    }
  })
}

/* -----------------------------------------------------
 * Tests — UI & interactions
 * --------------------------------------------------- */

describe('MyRoutes.vue UI & interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /* ---------------------------------------------
   * Basic rendering
   * ------------------------------------------- */

  test('renders period switch buttons', () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('.switch-btn')

    expect(buttons.length).toBe(3)
    expect(wrapper.text()).toContain('WEEK')
    expect(wrapper.text()).toContain('MONTH')
    expect(wrapper.text()).toContain('Uncompleted')
  })

  test('renders navigation buttons', () => {
    const wrapper = mountComponent()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)
  })

  test('renders map container', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.map-div').exists()).toBe(true)
  })

  test('renders selected routes container', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.selected-routes').exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking MONTH button does not crash', async () => {
    const wrapper = mountComponent()
    const monthBtn = wrapper.findAll('.switch-btn').at(1)

    await expect(monthBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking UNCOMPLETED button does not crash', async () => {
    const wrapper = mountComponent()
    const uncompletedBtn = wrapper.findAll('.switch-btn').at(2)

    await expect(uncompletedBtn.trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Navigation buttons
   * ------------------------------------------- */

  test('prev / next navigation buttons are clickable', async () => {
    const wrapper = mountComponent()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)

    await navButtons.at(0).trigger('click')
    await navButtons.at(1).trigger('click')
  })

  /* ---------------------------------------------
   * Trips UI
   * ------------------------------------------- */

  test('renders trip list container', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.trip-list').exists()).toBe(true)
  })

  test('renders empty state when no trips', () => {
    const wrapper = mountComponent({
      values: [{ trips: { items: [] } }]
    })

    expect(wrapper.text()).toContain('No trips available')
  })
})
