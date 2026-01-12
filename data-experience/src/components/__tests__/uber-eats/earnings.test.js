/**
 * @jest-environment jsdom
 */

import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { shallowMount } from '@vue/test-utils'
import EarningsView from '@/components/chart/view/uberEats/Earnings.vue'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

/* -----------------------------------------------------
 * Mocks
 * --------------------------------------------------- */

jest.mock('@/components/chart/view/uberEats/store/periodStore', () => ({
  periodStore: {
    mode: 'week',
    periodStart: '2023-10-09T00:00:00.000Z',
    periodEnd: '2023-10-15T23:59:59.999Z',
    setMode: jest.fn(),
    setPeriod: jest.fn()
  }
}))

jest.mock('vue-apexcharts', () => ({
  __esModule: true,
  default: {
    name: 'ApexChart',
    template: '<div class="apex-chart-stub"></div>'
  }
}))


jest.mock('@/components/chart/view/mixin', () => ({
  methods: {
    drawChart: jest.fn()
  },
  computed: {
    values() {
      return this.$props.values || []
    }
  }
}))


/* -----------------------------------------------------
 * Test data
 * --------------------------------------------------- */

const mockValues = [
  {
    online: {
      items: [
        {
          begin: '2023-10-10T10:00:00.000Z',
          end: '2023-10-10T12:00:00.000Z'
        }
      ]
    },
    payments: {
      items: [
        {
          recognizeTimestampLocal: '2023-10-10T12:00:00.000Z',
          amountLocal: 20,
          category: 'fare',
          currencyCode: 'CHF'
        },
        {
          recognizeTimestampLocal: '2023-10-10T12:05:00.000Z',
          amountLocal: 5,
          category: 'tip',
          currencyCode: 'CHF'
        }
      ]
    }
  }
]

/* -----------------------------------------------------
 * Helpers
 * --------------------------------------------------- */

function mountComponent(props = {}) {
  return shallowMount(EarningsView, {
    props: {
      values: mockValues,
      ...props
    },
    global: {
      stubs: {
        ApexChart: true
      }
    }
  })
}

/* -----------------------------------------------------
 * Tests — UI & interactions
 * --------------------------------------------------- */

describe('Earnings.vue - UI & interactions', () => {
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
    expect(wrapper.text()).toContain('TOTAL')
  })

  test('renders navigation buttons', () => {
    const wrapper = mountComponent()
    const navButtons = wrapper.findAll('.nav-btn')

    expect(navButtons.length).toBe(2)
  })

  test('renders earnings header', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Earnings Breakdown')
  })

  test('renders Apex chart container', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'ApexChart' }).exists()).toBe(true)
  })

  test('renders earnings legend', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Earnings (no tips)')
    expect(wrapper.text()).toContain('Tips')
  })

  /* ---------------------------------------------
   * Period switching
   * ------------------------------------------- */

  test('clicking WEEK button does not crash', async () => {
    const wrapper = mountComponent()
    const weekBtn = wrapper.findAll('.switch-btn').at(0)

    await expect(weekBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking MONTH button does not crash', async () => {
    const wrapper = mountComponent()
    const monthBtn = wrapper.findAll('.switch-btn').at(1)

    await expect(monthBtn.trigger('click')).resolves.not.toThrow()
  })

  test('clicking TOTAL button does not crash', async () => {
    const wrapper = mountComponent()
    const totalBtn = wrapper.findAll('.switch-btn').at(2)

    await expect(totalBtn.trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Navigation buttons
   * ------------------------------------------- */

  test('prev / next buttons are clickable', async () => {
    const wrapper = mountComponent()
    const navButtons = wrapper.findAll('.nav-btn')

    await expect(navButtons.at(0).trigger('click')).resolves.not.toThrow()
    await expect(navButtons.at(1).trigger('click')).resolves.not.toThrow()
  })

  /* ---------------------------------------------
   * Toggle (avg / total)
   * ------------------------------------------- */

  test('toggle switch exists', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  test('toggling avg checkbox does not crash', async () => {
    const wrapper = mountComponent()
    const checkbox = wrapper.find('input[type="checkbox"]')

    await expect(checkbox.setChecked(true)).resolves.not.toThrow()
    await expect(checkbox.setChecked(false)).resolves.not.toThrow()
  })
})
