/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import UnitFilterableTable from '../UnitFilterableTable'
import defaultMessages from '@/i18n/en.json'

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
const store = new Store()

// Mock createObjectURL because it is not implemented in jsdom
global.URL.createObjectURL = () => { }

test('data table contains passed items', () => {
  // Mount the vue component, pass some data and a mocked vuex store
  const wrapper = mount(UnitFilterableTable, {
    propsData: {
      ...data
    },
    store,
    localVue,
    mocks: {
      $tev: msg => defaultMessages[msg]
    }
  })
  // Check that the child component exists
  expect(wrapper.find('[data-testid="data-table"]').exists()).toBe(true)
})

test('data table is not rendered when data is malformed', () => {
  // Mount the vue component, pass some data and a mocked vuex store
  const wrapper = mount(UnitFilterableTable, {
    propsData: {
      items: data.items
    },
    store,
    localVue,
    mocks: {
      $tev: msg => defaultMessages[msg]
    }
  })
  // Check that the child component exists
  expect(wrapper.find('[data-testid="data-error"]').exists()).toBe(false)
})

test('data table html corresponds to snapshot', () => {
  // Mount the vue component, pass some data and a mocked vuex store
  const wrapper = mount(UnitFilterableTable, {
    propsData: {
      ...data
    },
    store,
    localVue,
    mocks: {
      $tev: msg => defaultMessages[msg]
    }
  })
  // Check that the html is the same as in the snapshot
  expect(wrapper.html()).toMatchSnapshot()
})
