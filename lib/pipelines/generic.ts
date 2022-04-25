import type { ViewBlock, ViewBlocks } from 'types/view-block'

export const genericDateViewer: ViewBlock = {
  key: 'genericDateViewer',
  customPipeline: 'genericDateViewer',
  visualization: 'ChartViewGenericDateViewer.vue',
  title: 'Timeline',
  text: 'See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.'
}

export const genericLocationViewer: ViewBlock = {
  key: 'genericLocationViewer',
  customPipeline: 'genericLocationViewer',
  visualization: 'ChartViewGenericLocationViewer.vue',
  title: 'Location observations',
  text: 'See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location.'
}

export const genericViewers: ViewBlocks = [
  genericDateViewer,
  genericLocationViewer
]
