import type { ViewBlocks } from '@/types'
import allPlaceVisit from '../../google-agg/src/sql/all-places.sql'
import allPlaceSearched from '../../google-agg/src/sql/all-searched.sql'
import allRecords from '../../google-agg/src/sql/all-records.sql'
import allWifi from '../../google-agg/src/sql/all-wifi.sql'
import allTravels from '../../google-agg/src/sql/all-travels.sql'
import TLBuilding from '../../google-agg/src/sql/tl-building.sql'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['placeVisited'],
    visualization: 'ChartViewGoogleAggPlaces.vue',
    title: 'Places visited',
    text: ''
  },
  {
    id: 'PlaceSearched',
    sql: allPlaceSearched,
    files: ['otherCandidate'],
    visualization: 'ChartViewGoogleAggSearched.vue',
    title: 'Places searched',
    text: ''
  },
  {
    id: 'TLBuilding',
    sql: TLBuilding,
    files: ['otherCandidate', 'placeVisited'],
    visualization: 'ChartViewGoogleAggTLBuilding.vue',
    title: 'TL Building',
    text: ''
  },
  {
    id: 'PublicTransport',
    sql: allTravels,
    files: ['travels'],
    visualization: 'ChartViewGoogleAggTrips.vue',
    title: 'Public Transport',
    text: ''
  },
  {
    id: 'MeansOfTransport',
    sql: allRecords,
    files: ['records'],
    visualization: 'ChartViewGoogleAggRecords.vue',
    title: 'Means of Transport',
    text: ''
  },
  {
    id: 'Wifi',
    sql: allWifi,
    files: ['wifi'],
    visualization: 'ChartViewGoogleAggWifi.vue',
    title: 'Wifi',
    text: ''
  }
]

export default blocks
