import type { ViewBlocks } from '@/types'
import allActivitySegment from './sql/all-activity-segment.sql'
import allPlaceVisit from './sql/all-place-visit.sql'
import recordsLinkedToMac from './sql/records-linked-to-mac.sql'
import placeLinkedToCandidate from './sql/place-linked-to-candidate.sql'
import recordsLinkedToTrips from './sql/records-linked-to-trips.sql'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGooglePlaces.vue',
    title: 'Places visited',
    text: ''
  },
  {
    id: 'OtherCandidates',
    sql: placeLinkedToCandidate,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGoogleCandidates.vue',
    title: 'Other Candidates',
    text: ''
  },
  {
    id: 'ActivitySegment',
    sql: allActivitySegment,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGoogleTrips.vue',
    title: 'Travels',
    text: ''
  },
  {
    id: 'Records',
    sql: recordsLinkedToTrips,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGoogleRecords.vue',
    title: 'Records',
    text: ''
  },
  {
    id: 'WifiScan',
    sql: recordsLinkedToMac,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGoogleWifi.vue',
    title: 'Wifi',
    text: ''
  }
]

export default blocks
