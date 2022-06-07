import type { ViewBlocks } from '@/types'
import allPlaceVisit from '../../google-agg/src/sql/all-places.sql'
import allOtherCandidate from '../../google-agg/src/sql/all-candidates.sql'
import allRecords from '../../google-agg/src/sql/all-records.sql'
import allWifi from '../../google-agg/src/sql/all-wifi.sql'
import allTravels from '../../google-agg/src/sql/all-travels.sql'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['placeVisited'],
    visualization: 'ChartViewGooglePlaces.vue',
    showTable: false,
    title: 'Places visited',
    text: ''
  },
  {
    id: 'OtherCandidate',
    sql: allOtherCandidate,
    files: ['otherCandidate'],
    visualization: 'ChartViewGoogleAggCandidates.vue',
    showTable: false,
    title: 'Other Candidates',
    text: ''
  },
  {
    id: 'Travels',
    sql: allTravels,
    files: ['travels'],
    visualization: 'ChartViewGoogleTrips.vue',
    showTable: false,
    title: 'Travels',
    text: ''
  },
  {
    id: 'Records',
    sql: allRecords,
    files: ['records'],
    visualization: 'ChartViewGoogleRecords.vue',
    showTable: false,
    title: 'Records',
    text: ''
  },
  {
    id: 'Wifi',
    sql: allWifi,
    files: ['wifi'],
    visualization: 'ChartViewGoogleWifi.vue',
    showTable: false,
    title: 'Wifi',
    text: ''
  }
]

export default blocks
