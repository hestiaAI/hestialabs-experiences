import type { ViewBlocks } from '@/types/view-block'
import { customPipelineMergeCSV } from '@/pipelines/custom'
import { genericDateViewer } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    key: 'inference',
    customPipeline: customPipelineMergeCSV('inference'),
    files: ['inference'],
    visualization: 'ListLinkedinInference.vue',
    title: 'Inferences about you',
    text: 'Each card below represents an inference that Linkedin has made about you, either positively or negatively, e.g. Am I a joob seeker -> true or false.'
  },
  {
    key: 'ad-targeting',
    customPipeline: customPipelineMergeCSV('ad-targeting'),
    files: ['ad-targeting'],
    visualization: 'LinkedinAdTargeting.vue',
    title: 'Ad targeting',
    text: 'This information is used by Linkedin to determine which ads to show you. Some of the targeting data may be derived from other information you have provided to them. For example, they may use your title as an indication of your seniority level.'
  },
  {
    key: 'connections',
    customPipeline: customPipelineMergeCSV('connections'),
    files: ['connections'],
    visualization: 'ChartViewOverviewLinkedinConnection.vue',
    title: 'Connections',
    text: 'This tool allows you to track all the connections you have made with Linkedin, you can filter by date, day or by company and position in your address book.'
  },
  genericDateViewer
]

export default blocks
