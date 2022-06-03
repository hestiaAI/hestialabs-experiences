import type { ViewBlocks } from '@/types'
import allPlaceVisit from '../../google/src/sql/all-place-visit.sql'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['placeVisited'],
    visualization: 'ChartViewGooglePlaces.vue',
    showTable: false,
    title: 'Places visited',
    text: ''
  }
]

export default blocks
