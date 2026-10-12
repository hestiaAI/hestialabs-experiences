/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import { vuetify } from '../vuetify.helpers'
import PeriodToolbar from '@/components/chart/view/shared/PeriodToolbar.vue'

function mountToolbar(props = {}) {
  return mount(PeriodToolbar, {
    vuetify: vuetify(),
    propsData: {
      mode: 'month',
      label: 'May 2025',
      descriptions: { week: 'Week text', month: 'Month text', total: 'Total text' },
      ...props
    }
  })
}

describe('PeriodToolbar', () => {
  test('shows the modes, the label and the description of the current mode', () => {
    const wrapper = mountToolbar()
    expect(wrapper.findAll('.switch-btn').wrappers.map(b => b.text())).toEqual(['WEEK', 'MONTH', 'TOTAL'])
    expect(wrapper.find('.week-label').text()).toBe('May 2025')
    expect(wrapper.text()).toContain('Month text')
    expect(wrapper.text()).not.toContain('Week text')
  })

  test('emits the chosen mode', async() => {
    const wrapper = mountToolbar()
    await wrapper.findAll('.switch-btn').at(2).trigger('click')
    expect(wrapper.emitted('mode')).toEqual([['total']])
  })

  test('emits prev and next', async() => {
    const wrapper = mountToolbar()
    const [prev, next] = wrapper.findAll('.nav-btn').wrappers
    await prev.trigger('click')
    await next.trigger('click')
    expect(wrapper.emitted('prev')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  test('hides navigation in total mode', () => {
    const wrapper = mountToolbar({ mode: 'total' })
    expect(wrapper.findAll('.nav-btn')).toHaveLength(0)
  })
})
