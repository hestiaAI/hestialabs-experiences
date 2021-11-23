/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import UnitFilterableTable from '../UnitFilterableTable'

const data = {
  headers: ['col1', 'col2', 'col3'],
  items: [
    {
      col1: 'Hello world',
      col2: 5,
      col3: false
    }
  ]
}

// Mock vuex store
const localVue = createLocalVue()
localVue.use(Vuex)
const state = { power: false }
const store = new Store({
  state
})

test('data table contains passed items', () => {
  // Mock createObjectURL because it is not implemented in jsdom
  global.URL.createObjectURL = () => {}
  // Mount the vue component, pass some data and a mocked vuex store
  const wrapper = mount(UnitFilterableTable, {
    propsData: {
      data
    },
    store,
    localVue
  })
  // Check that the child component exists
  expect(wrapper.find('[data-testid="data-table"]').exists()).toBe(true)
})

test('data table shows error message when data is malformed', () => {
  // Mock createObjectURL because it is not implemented in jsdom
  global.URL.createObjectURL = () => {}
  // Mount the vue component, pass some data and a mocked vuex store
  const wrapper = mount(UnitFilterableTable, {
    propsData: {
      data: data.items
    },
    store,
    localVue
  })
  // Check that the child component exists
  expect(wrapper.find('[data-testid="data-error"]').exists()).toBe(true)
})
