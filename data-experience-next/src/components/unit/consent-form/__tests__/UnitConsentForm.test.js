/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import JSZip from 'jszip'

import { testConsentForm } from './consent-form.helpers'
import UnitConsentForm from '~/components/unit/consent-form/UnitConsentForm'
import FileManager from '~/utils/file-manager'

const originalFetch = window.fetch
const originalCreateObjectURL = window.URL.createObjectURL

// Mock vuex store
const localVue = createLocalVue()
localVue.use(Vuex)

beforeAll(() => {
  window.fetch = jest.fn(() => Promise.resolve({ text: () => 'test' }))
  window.URL.createObjectURL = jest.fn(() => 'test')
  // JSZip doesn't work well in this environment
  jest.spyOn(JSZip.prototype, 'generateAsync').mockImplementation(() => 'test')
})

afterAll(() => {
  // Restore mocked functions
  window.fetch = originalFetch
  window.URL.createObjectURL = originalCreateObjectURL
  jest.restoreAllMocks()
})

test('generates a zip', async() => {
  const fileManager = new FileManager()

  const store = new Store({
    modules: {
      xp: {
        namespaced: true,
        state: () => ({
          bubbleConfig: {},
          experienceConfig: {
            viewBlocks: []
          },
          siteConfig: {},
          results: {},
          fileManager,
          consentForm: testConsentForm,
          selectedFiles: []
        })
      }
    }
  })

  const wrapper = mount(UnitConsentForm, {
    store,
    localVue,
    mocks: {
      $t: () => ''
    }
  })
  expect(wrapper.exists()).toBeTruthy()

  // Trigger the data processing function
  const button = wrapper.findComponent({ ref: 'downloadButton' })
  await button.trigger('click', {})
  expect(wrapper.vm.$data.generateProgress).toBeTruthy()
  // for some reason we need four ticks
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.$data.generateProgress).toBeFalsy()
  expect(wrapper.vm.$data.generateError).toBeFalsy()
  expect(wrapper.vm.$data.generateStatus).toBeTruthy()
})
