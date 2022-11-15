import type { ViewBlocks } from '@/types'

import allInferences from './sql/inference.sql'
import allConnections from './sql/connection.sql'
import allAdTargeting from './sql/ad-targeting.sql'

import { strToArray } from './postprocessors'

const blocks: ViewBlocks = [
  {
    id: 'inference',
    sql: allInferences,
    files: ['inference'],
    showTable: false,
    visualization: 'ChartViewListLinkedinInference.vue',
    title: 'Inferences about your group',
    text: 'The cards below represent the inferences (positive or negative) that Linkedin has made about the members of your group, classified according to the number of occurrences (from the most present to the least present inference).'
  },
  {
    id: 'ad-targeting',
    sql: allAdTargeting,
    files: ['ad-targeting'],
    showTable: false,
    postprocessor: strToArray,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      showTable: false,
      graphs: [
        {
          valueLabel: 'occurences',
          title: 'Skills',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'memberSkills',
          valueAsArray: true
        },
        {
          cols: '8'
        },
        {
          valueLabel: 'occurences',
          title: 'Job Seniorities',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'jobSeniorities',
          isScrollable: true,
          topK: 100,
          valueAsArray: true
        },
        {
          valueLabel: 'occurences',
          title: 'Years of experience',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'yearsOfExperience',
          valueAsArray: true
        },
        {
          cols: '4'
        },
        {
          valueLabel: 'occurences',
          title: 'Degrees',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'degrees',
          valueAsArray: true
        },
        {
          valueLabel: 'occurences',
          title: 'Fields of Study',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'fieldsOfStudy',
          valueAsArray: true
        },
        {
          valueLabel: 'occurences',
          title: 'Member schools',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'memberSchools',
          valueAsArray: true
        }
      ]
    },
    title: 'Skills and diversity',
    text: 'The charts below represent the criteria Linkedin uses to determine which ads to show to your group members. They draw an interesting map of the skills and experiences of your group and its diversity.'
  },
  {
    id: 'connections',
    sql: allConnections,
    files: ['connections'],
    showTable: true,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          valueLabel: 'contacts',
          title: 'Number of unique connections',
          cols: '12',
          height: 220,
          type: 'TimelineChart.vue',
          dateAccessor: 'connectedOn',
          cumulativeGroup: true
        },
        {
          valueLabel: 'contacts',
          title: 'Employers of your contacts',
          cols: '6',
          height: 220,
          type: 'TopChart.vue',
          isScrollable: true,
          topK: 100,
          defaultValue: 'Not mentioned',
          valueAccessor: 'company'
        },
        {
          valueLabel: 'contacts',
          title: 'Jobs of your contacts',
          cols: '6',
          height: 220,
          type: 'TopChart.vue',
          isScrollable: true,
          topK: 100,
          defaultValue: 'Not mentioned',
          valueAccessor: 'position'
        }
      ]
    },
    title: 'Collective network ( Reach )',
    text: "This infographic represents the scope of your group's network. Clicking on an item will filter all the graphs according to this criterion."
  }
]

export default blocks
