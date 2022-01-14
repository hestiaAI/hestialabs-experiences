/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import TheDataExperience from '~/components/TheDataExperience'

test('TheDataExperience mounts without error', () => {
  const wrapper = mount(TheDataExperience, {
    propsData: {
      title: 'Test',
      ext: 'all'
    }
  })
  expect(wrapper.exists()).toBeTruthy()
})
