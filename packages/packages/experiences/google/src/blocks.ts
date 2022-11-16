import type { ViewBlocks } from '@/types'
import allActivitySegment from './sql/all-activity-segment.sql'
import allPlaceVisit from './sql/all-place-visit.sql'
import recordsLinkedToMac from './sql/records-linked-to-mac.sql'
import placeLinkedToCandidate from './sql/place-linked-to-candidate.sql'
import recordsLinkedToTrips from './sql/records-linked-to-trips.sql'
import {
  placesPostProcessor,
  otherCandidatesPostProcessor,
  tripsPostProcessor,
  wifiPostProcessor,
  recordsPostProcessor
} from './postprocessor'
import keplerConfigWifi from './kepler/kepler_config_wifi'
import keplerConfigPlaces from './kepler/kepler_config_places'
import keplerConfigCandidate from './kepler/kepler_config_candidate'
import keplerConfigTrip from './kepler/kepler_config_trip'
import keplerConfigRecords from './kepler/kepler_config_records'

const blocks: ViewBlocks = [
  {
    id: 'PlaceVisited',
    sql: allPlaceVisit,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Places visited',
    text: 'This map shows what places Google think you visited with the size corresponding to the time you spent in this place:',
    postprocessor: placesPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces
    }
  },
  {
    id: 'OnePlace',
    sql: placeLinkedToCandidate,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGoogleOnePlace.vue',
    title: 'One Place',
    text: '',
    postprocessor: otherCandidatesPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces
    }
  },
  {
    id: 'OtherCandidates',
    sql: placeLinkedToCandidate,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Other Candidates',
    text: 'This map shows the other candidate places proposed by Google linked to the location that Google think you visited:',
    postprocessor: otherCandidatesPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigCandidate
    }
  },
  {
    id: 'ActivitySegment',
    sql: allActivitySegment,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Travels',
    text: 'This map shows what trips Google think you did:',
    postprocessor: tripsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigTrip,
      label: 'trips'
    }
  },
  {
    id: 'Records',
    sql: recordsLinkedToTrips,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Records',
    text: 'This map shows records associated to a trip with the color corresponding to an activity type:',
    postprocessor: recordsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigRecords,
      showButton: true
    }
  },
  {
    id: 'WifiScan',
    sql: recordsLinkedToMac,
    files: ['LOCATION_HISTORY'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Wifi',
    text: 'This map shows where your phone detected mac addresses with the size corresponding to the number of times it was detected:',
    postprocessor: wifiPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigWifi,
      label: 'mac adresses'
    }
  }
]

export default blocks
