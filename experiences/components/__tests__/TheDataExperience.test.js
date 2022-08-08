/**
 * @jest-environment jsdom
 */
import fs from 'fs'
import path from 'path'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TheDataExperience from '~/components/TheDataExperience'
import defaultMessages from '~/i18n-messages-default.json'

// Mock the Vuex store
const localVue = createLocalVue()
localVue.use(Vuex)

let store

// We need to disable workers for these tests
jest.mock('~/utils/file-manager-workers', () => {})
const originalScrollTo = window.scrollTo

beforeAll(() => {
  window.scrollTo = jest.fn()
})

beforeEach(() => {
  // eslint-disable-next-line import/no-named-as-default-member
  store = new Vuex.Store({
    state: () => ({
      config: {},
      fileManager: null
    }),
    getters: {
      experience: () => () => ({
        files: {},
        keepOnlyFiles: true,
        preprocessors: {},
        viewBlocks: []
      }),
      routeConfig: () => () => ({})
    },
    mutations: {
      clearStore: () => {},
      setFileManager: () => {},
      setConsentForm: () => {}
    },
    modules: {
      experience: {
        namespaced: true,
        state: () => ({
          progress: false
        })
      }
    }
  })
})

afterAll(() => {
  window.scrollTo = originalScrollTo
})

test('mounts without error', () => {
  const wrapper = mount(TheDataExperience, {
    propsData: {
      title: 'Test',
      ext: 'all'
    },
    store,
    localVue,
    mocks: {
      $route: { params: {} },
      $router: {
        push: () => {}
      },
      $t: msg => defaultMessages.en[msg],
      $tev: msg => defaultMessages.en[msg],
      $tet: msg => defaultMessages.en[msg],
      $tetv: msg => defaultMessages.en[msg]
    }
  })
  expect(wrapper.exists()).toBeTruthy()
  // For some reason it doesn't find the component if we search by name or by import
  expect(
    wrapper.findComponent({ ref: 'unit-introduction' }).exists()
  ).toBeTruthy()
})

test('process simple text file', async() => {
  const wrapper = mount(TheDataExperience, {
    propsData: {
      title: 'Test',
      ext: 'all'
    },
    store,
    localVue,
    mocks: {
      $route: { params: {} },
      $router: {
        push: () => {}
      },
      $t: msg => defaultMessages.en[msg],
      $tev: msg => defaultMessages.en[msg],
      $tet: msg => defaultMessages.en[msg],
      $tetv: msg => defaultMessages.en[msg]
    }
  })

  const fileContent = fs.readFileSync(
    path.resolve(__dirname, 'data/test.txt'),
    'utf8'
  )
  const file = new File([fileContent], 'test.txt')

  // Trigger the data processing function
  const unitFiles = wrapper.findComponent({ ref: 'unit-introduction' })
  await unitFiles.trigger('update', { uppyFiles: [file] })

  // I don't know why we need so many ticks
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.$data.error).toBeFalsy()
  expect(wrapper.vm.$data.success).toBeTruthy()
})
