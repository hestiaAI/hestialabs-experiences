/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import ActivityTypes from '@/components/chart/view/babysits/ActivityTypes.vue'

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
    nbHours: 2,
    duration_hours: 2,
    status: 'completed'
  },
  {
    job_id: 'job_2',
    date: '2024-01-16',
    start_time: '14:00',
    end_time: '17:00',
    job_type: 'household',
    nbHours: 3,
    duration_hours: 3,
    status: 'completed'
  },
  {
    job_id: 'job_3',
    date: '2024-01-17',
    start_time: '10:30',
    end_time: '13:00',
    job_type: 'babysitting',
    nbHours: 2.5,
    duration_hours: 2.5,
    status: 'completed'
  }
]

/* --------------------------
 * Helpers
 * -------------------------- */

function mountActivityTypes(props = {}) {
  return mount(ActivityTypes, {
    props: {
      values: mockPipelineValues,
      ...props
    },
    global: {
      stubs: {
        ApexChart: true
      }
    }
  })
}

/* --------------------------
 * Tests
 * -------------------------- */

describe('ActivityTypes.vue - UI & interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /* ---------------------------------------------
   * Basic rendering
   * ------------------------------------------- */

  test('renders period switch buttons', () => {
    const wrapper = mountActivityTypes()
    const buttons = wrapper.findAll('.switch-btn')

    expect(buttons.length).toBe(3)
    expect(wrapper.text()).toContain('WEEK')
    expect(wrapper.text()).toContain('MONTH')
    expect(wrapper.text()).toContain('TOTAL')
  })

  test('renders navigation buttons', () => {
    const wrapper = mountActivityTypes()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)
  })

  test('renders activity types header', () => {
    const wrapper = mountActivityTypes()
    expect(wrapper.text()).toContain('Activity Types')
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking WEEK button does not crash', async() => {
    const wrapper = mountActivityTypes()
    const weekBtn = wrapper.findAll('.switch-btn').at(0)

    await expect(weekBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking MONTH button does not crash', async() => {
    const wrapper = mountActivityTypes()
    const monthBtn = wrapper.findAll('.switch-btn').at(1)

    await expect(monthBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking TOTAL button does not crash', async() => {
    const wrapper = mountActivityTypes()
    const totalBtn = wrapper.findAll('.switch-btn').at(2)

    await expect(totalBtn.trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Navigation buttons
   * ------------------------------------------- */

  test('prev / next navigation buttons are clickable', async() => {
    const wrapper = mountActivityTypes()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)

    await expect(navButtons.at(0).trigger('click')).resolves.not.toThrow()
    await expect(navButtons.at(1).trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Data validation
   * ------------------------------------------- */

  test('renders without crashing with empty values', () => {
    const wrapper = mountActivityTypes({
      values: []
    })

    expect(wrapper.exists()).toBe(true)
  })

  test('renders without crashing with minimal data', () => {
    const wrapper = mountActivityTypes({
      values: [
        {
          job_id: 'test_1',
          date: '2024-01-15',
          job_type: 'babysitting',
          nbHours: 1
        }
      ]
    })

    expect(wrapper.exists()).toBe(true)
  })

  /* ---------------------------------------------
   * Period label display
   * ------------------------------------------- */

  test('displays correct label for week period', () => {
    const wrapper = mountActivityTypes()
    const label = wrapper.find('.week-label')

    expect(label.exists()).toBe(true)
    expect(label.text()).toMatch(/\d{2}\.\d{2}\s*-\s*\d{2}\.\d{2}\.\d{4}/)
  })

  test('displays "All time" label for total period', async() => {
    const wrapper = mountActivityTypes()

    // Switch to TOTAL mode
    await wrapper.findAll('.switch-btn').at(2).trigger('click')

    const label = wrapper.find('.week-label')
    expect(label.text()).toBe('All time')
  })
})
