/**
 * @jest-environment jsdom
 */
import fs from 'fs'
import path from 'path'
import { mount } from '@vue/test-utils'
import TheDataExperience from '~/components/TheDataExperience'

// We need to disable workers for these tests
jest.mock('~/utils/file-manager-workers', () => {})

test('mounts without error', () => {
  const wrapper = mount(TheDataExperience, {
    propsData: {
      title: 'Test',
      ext: 'all'
    }
  })
  expect(wrapper.exists()).toBeTruthy()
  // For some reason it doesn't find the component if we search by name or by import
  expect(
    wrapper.findComponent({ ref: 'unit-introduction' }).exists()
  ).toBeTruthy()
  expect(wrapper.findComponent({ ref: 'unit-files' }).exists()).toBeTruthy()
})

test('process simple text file', async () => {
  const wrapper = mount(TheDataExperience, {
    propsData: {
      title: 'Test',
      ext: 'all'
    },
    mocks: {
      $store: {
        state: {
          config: {}
        },
        commit: () => {}
      }
    }
  })

  const fileContent = fs.readFileSync(
    path.resolve(__dirname, 'data/test.txt'),
    'utf8'
  )
  const file = new File([fileContent], 'test.txt')

  // Trigger the data processing function
  const unitFiles = wrapper.findComponent({ ref: 'unit-files' })
  await unitFiles.trigger('update', { uppyFiles: [file] })

  // I don't know why we need so many ticks
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  expect(wrapper.vm.$data.error).toBeFalsy()
  expect(wrapper.vm.$data.success).toBeTruthy()
})
