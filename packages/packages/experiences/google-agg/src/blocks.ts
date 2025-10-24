import type { ViewBlocks } from '@/types'
import allPlaceVisit from '../../google-agg/src/sql/all-places.sql'
import allPlaceSearched from '../../google-agg/src/sql/all-searched.sql'
import allRecords from '../../google-agg/src/sql/all-records.sql'
import allWifi from '../../google-agg/src/sql/all-wifi.sql'
import allTravels from '../../google-agg/src/sql/all-travels.sql'
import allOtherCandidates from '../../google-agg/src/sql/all-other-candidates.sql'
import keplerConfigPlaces from './kepler/kepler_config_places'
import keplerConfigTrips from './kepler/kepler_config_trip'
import keplerConfigRecords from './kepler/kepler_config_records'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['placeVisited'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Places visited',
    text: 'This map shows the places that were visited by at least k participants:',
    vizProps: {
      keplerConfig: keplerConfigPlaces,
      doKAnonymity: true,
      groupKey: ['name', 'address'],
      otherKeys: ['latitude', 'longitude']
    }
  },
  {
    id: 'PlaceSearched',
    sql: allPlaceSearched,
    files: ['otherCandidate'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Places searched',
    text: 'This map shows the places that were searched by at least k participants:',
    vizProps: {
      keplerConfig: keplerConfigPlaces,
      doKAnonymity: true,
      groupKey: ['name'],
      otherKeys: ['latitude', 'longitude']
    }
  },
  {
    id: 'OnePlace',
    sql: allOtherCandidates,
    files: ['otherCandidate'],
    visualization: 'ChartViewGoogleOnePlace.vue',
    title: 'One Place',
    text: '',
    vizProps: {
      keplerConfig: keplerConfigPlaces
    }
  },
  {
    id: 'PublicTransport',
    sql: allTravels,
    files: ['travels'],
    visualization: 'ChartViewGoogleAggTrips.vue',
    title: 'Public Transport',
    text: '',
    vizProps: {
      keplerConfig: keplerConfigTrips
    }
  },
  {
    id: 'MeansOfTransport',
    sql: allRecords,
    files: ['records'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Means of Transport',
    text: 'This map shows the records that were logged during a travel with the color corresponding to an activity type:',
    vizProps: {
      keplerConfig: keplerConfigRecords
    }
  },
  {
    id: 'Wifi',
    sql: allWifi,
    files: ['wifi'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Wifi',
    text: 'This map shows the mac addresses that were detected by at least k participants:',
    vizProps: {
      keplerConfig: keplerConfigPlaces,
      doKAnonymity: true,
      groupKey: ['mac'],
      otherKeys: ['latitude', 'longitude']
    }
  }
]

export default blocks
