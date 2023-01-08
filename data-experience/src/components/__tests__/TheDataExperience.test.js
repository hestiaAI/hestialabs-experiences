/**
 * @jest-environment jsdom
 */
import fs from 'fs'
import path from 'path'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TheDataExperience from '~/components/TheDataExperience'
import defaultMessages from '~/locales/en.json'
import xpStore from '~/store'
import resizeObserverPolyfill from 'resize-observer-polyfill'

// Mock the Vuex store
const localVue = createLocalVue()
localVue.use(Vuex)

let store

// We need to disable workers for these tests
jest.mock('~/utils/file-manager-workers', () => { })
const originalScrollTo = window.scrollTo
const originalFetch = window.fetch

const propsData = {
  experienceConfig: {
    dataPortal: '',
    dataPortalHtml: '',
    dataPortalMessage: '',
    dataSamples: [],
    tutorialVideos: [],
    videoHeight: 0,
    viewBlocks: [{}],
    files: [],
    slug: 'a-slug'
  },
  siteConfig: {
    experiences: []
  },
  bubbleConfig: {
    id: 'the-data-experience-test',
    apiUrl: 'http://localhost:0000',
    bypassLogin: true,
    experiences: []
  }
}

const mocks = {
  $vuetify: {
    breakpoint: {}
  },
  $i18n: {
    mergeLocaleMessage() {}
  },
  $t: msg => defaultMessages[msg],
  $te: msg => defaultMessages[msg],
  $tev: msg => defaultMessages[msg],
  $tet: msg => defaultMessages[msg]
}

beforeAll(() => {
  // mock fetch for d3.json()
  window.fetch = jest.fn(() => Promise.resolve({ json: () => 'test' }))
  window.scrollTo = jest.fn()
  // for uppy
  globalThis.ResizeObserver = resizeObserverPolyfill.default || resizeObserverPolyfill
})

afterAll(() => {
  delete globalThis.ResizeObserver
})

beforeEach(() => {
  // eslint-disable-next-line import/no-named-as-default-member
  store = new Vuex.Store({
    modules: {
      xp: xpStore
    }
  })
})

afterAll(() => {
  window.scrollTo = originalScrollTo
  window.fetch = originalFetch
})

test('mounts without error', async() => {
  const wrapper = mount(TheDataExperience, {
    propsData,
    store,
    localVue,
    mocks
  })
  expect(wrapper.exists()).toBeTruthy()
  // For some reason it doesn't find the component if we search by name or by import
  expect(
    wrapper.findComponent('[data-id="window-load-data"]').exists()
  ).toBeTruthy()
})

test('data experience html corresponds to snapshot', () => {
  const wrapper = mount(TheDataExperience, {
    propsData,
    store,
    localVue,
    mocks
  })
  expect(wrapper.html()).toMatchSnapshot()
})

test('process simple text file', async() => {
  const wrapper = mount(TheDataExperience, {
    propsData,
    store,
    localVue,
    mocks
  })
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, 'data/test.txt'),
    'utf8'
  )
  const file = new File([fileContent], 'test.txt')

  // Trigger the data processing function
  const unitIntroduction = wrapper.findComponent({ ref: 'unit-introduction' })
  unitIntroduction.vm.$emit('update', { uppyFiles: [file] })

  // I don't know why we need so many ticks
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.$data.error).toBeFalsy()
  expect(wrapper.vm.$data.success).toBeTruthy()
})
