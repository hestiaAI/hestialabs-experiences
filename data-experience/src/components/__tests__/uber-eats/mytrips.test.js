/**
 * @jest-environment jsdom
 */

import { shallowMount } from '@vue/test-utils'
import MyTrips from '@/components/chart/view/uberEats/MyTrips.vue'

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
  return shallowMount(MyTrips, {
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

describe('MyTrips.vue UI & interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /* ---------------------------------------------
   * Basic rendering
   * ------------------------------------------- */

  test('renders Filters button', () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('.switch-btn')
    expect(buttons.length).toBe(1)
    expect(wrapper.text()).toContain('Filters')
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
 * Filters panel & checkboxes
 * ------------------------------------------- */

  test('Filters button toggles filter panel', async() => {
    const wrapper = mountComponent()

    // Panel should be hidden initially
    expect(wrapper.find('.filters-panel').exists()).toBe(false)

    // Click Filters button
    const filtersBtn = wrapper.find('.switch-btn')
    await filtersBtn.trigger('click')

    // Panel should now exist
    expect(wrapper.find('.filters-panel').exists()).toBe(true)

    // Clicking again hides the panel
    await filtersBtn.trigger('click')
    expect(wrapper.find('.filters-panel').exists()).toBe(false)
  })

  test('Completed and Uncompleted checkboxes exist and are clickable', async() => {
    const wrapper = mountComponent()

    // Open the filters panel
    const filtersBtn = wrapper.find('.switch-btn')
    await filtersBtn.trigger('click')

    // Get all checkboxes
    const allCheckboxes = wrapper.findAll('input[type="checkbox"]').wrappers

    // Pick by parent label text
    const completedCheckbox = allCheckboxes.find(c =>
      c.element.parentElement.textContent.includes('Completed')
    )
    const uncompletedCheckbox = allCheckboxes.find(c =>
      c.element.parentElement.textContent.includes('Uncompleted')
    )

    expect(completedCheckbox).toBeTruthy()
    expect(uncompletedCheckbox).toBeTruthy()

    // Toggle checkboxes
    await completedCheckbox.setChecked(false)
    expect(wrapper.vm.filters.status.completed).toBe(false)

    await uncompletedCheckbox.setChecked(true)
    expect(wrapper.vm.filters.status.uncompleted).toBe(true)
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
