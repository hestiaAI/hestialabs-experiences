import type { ViewBlocks } from '@/types'
import allActivitySegment from './sql/all-activity-segment.sql'
import allPlaceVisit from './sql/all-place-visit.sql'
import recordsLinkedToMac from './sql/records-linked-to-mac.sql'
import placeLinkedToCandidate from './sql/place-linked-to-candidate.sql'
import recordsLinkedToTrips from './sql/records-linked-to-trips.sql'

const blocks: ViewBlocks = [
  {
    id: 'timedObservationViewer',
    customPipeline: 'timedObservationViewer',
    files: ['MY_ACTIVITY'],
    customPipelineOptions: {
      fileMatchers: [
        {
          regex:
            '(?:.*/)?(.+?)/(?:MyActivity|My Activity|MonActivité|Mon Activité|OmatTapahtumat|Omat Tapahtumat)\\.json',
          entryPath: '$[*]',
          fields: {
            date: {
              source: 'entry',
              path: '$.time'
            },
            eventValue: {
              source: 'entry',
              path: '$.title'
            },
            eventSource: {
              source: 'regex',
              path: '1'
            }
          }
        }
      ],
      parser: 'identifyTypeFromManifestList',
      eventTypes: {
        en: {
          Agenda: ['Searched'],
          'Audio search': ['Listened'],
          Podcasts: ['Listened'],
          'Voice and audio': ['said'],
          Assistant: ['Used', 'notification'],
          Android: ['Used'],
          YouTube: [
            'Liked',
            'Disliked',
            'Subscribed to',
            'Watched',
            'Searched',
            'Saved',
            'Visited'
          ],
          Search: ['Searched', 'Visited', 'Defined', 'Viewed', 'Used'],
          Maps: [
            'Viewed',
            'Directions',
            'Opened My Maps',
            'Searched',
            'Used Maps',
            'Viewed area',
            'Explored',
            'Used'
          ],
          'Image Search': ['Searched', 'Viewed', 'Used'],
          'Google Play Store': [
            'Visited',
            'Uninstalled',
            'Searched',
            'Installed',
            'Used'
          ],
          Ads: ['Visited'],
          'Video Search': ['Watched', 'Searched'],
          Help: ['Visited', 'Viewed', 'Searched', 'Interacted'],
          'Google Play Games': ['Played'],
          'Google Apps': ['Searched', 'Selected'],
          'Google Lens': ['Searched'],
          'Google Cloud': ['Searched', 'Visited'],
          Shopping: ['Viewed'],
          Books: ['Viewed', 'Searched'],
          Developers: ['Visited', 'Viewed'],
          Discover: [],
          News: ['Visited', 'Searched'],
          Gmail: ['Searched'],
          Drive: ['bulk download', 'Searched'],
          'Google Pay': [
            'contactless payment that failed',
            'contactless payment',
            'Used Google Pay'
          ],
          Takeout: ['Downloaded a Takeout archive', 'Initiated a Takeout']
        },
        fr: {
          Agenda: ['recherché'],
          'Recherche audio': ['écouté'],
          Podcasts: ['écouté'],
          Assistant: ['utilisée', 'notification'],
          'Voix et audio': ['dit'],
          YouTube: [
            'aimé',
            "n'a pas aimé",
            'abonné à',
            'regardé',
            'recherché',
            'enregistré',
            'consulté'
          ],
          Recherche: [
            'recherché',
            'visité',
            'Défini',
            'consulté',
            'utilisé',
            'Application ouverte'
          ],
          Maps: [
            'Zone consultée',
            'Itinéraire',
            'Carte My Maps ouverte',
            'recherché',
            'Cartes consultées',
            'explorée',
            'utilisée',
            'Lieu découvert',
            'Maps ouverte'
          ],
          'Recherche d_images': ['recherché', 'consulté', 'utilisé'],
          'Google Play Store': [
            'consulté',
            'Désinstallée',
            'recherché',
            'Installée',
            'utilisé'
          ],
          'Solutions publicitaires': ['consulté'],
          'Recherche de vidéos': ['regardé', 'recherché'],
          Aide: ['visité', 'consulté', 'recherché', 'interagi'],
          'Google Play Jeux': ['joué'],
          'Google Apps': ['recherché', 'sélectionné'],
          'Google Lens': ['Recherche'],
          'Google Cloud': ['recherché', 'consulté'],
          Shopping: ['consulté'],
          Livres: ['consulté', 'recherché'],
          Android: ['utilisée'],
          'Google Developers': ['consulté', 'visité'],
          Découvrir: [],
          'Google Actualités': ['consulté', 'recherché'],
          Gmail: ['recherché'],
          Drive: ['téléchargement groupé', 'recherché'],
          'Google Pay': [
            'paiement sans contact qui a échoué',
            'paiement sans contact',
            'utilisé'
          ],
          Takeout: ['téléchargé une archive Takeout', 'lancé une opération']
        },
        fi: {
          Agenda: ['Haku'],
          Assistant: ['Käytetty', 'ilmoitus'],
          Äänihaku: ['Kuunneltu'],
          Podcastit: ['Kuunneltu'],
          'Voice and audio': ['Sanoi'],
          Android: ['Käytetty'],
          Haku: [
            'Käytetty',
            'Haku',
            'avattiin',
            'katsottiin',
            'Määritelty',
            'Katsotut'
          ],
          YouTube: [
            'Tallennettu',
            'katsottiin',
            'Haku',
            'Tykkäsit',
            'Et tykännyt',
            'tilattu',
            'Katsoi myöhemmin poistetun videon',
            'avattiin'
          ],
          Maps: [
            'Katsottu',
            'Reittiohjeet',
            'Avoin omat kartat',
            'Haku',
            'Käytetyt kartat',
            'Katsottu alue',
            'Tutkittu',
            'Käytetty'
          ],
          Kuvahaku: ['Haku', 'Katsottu', 'Käytetty'],
          'Google Play Kauppa': [
            'avattiin',
            'Poistettu',
            'Haku',
            'Asennettu',
            'käytettiin'
          ],
          Ads: ['avattiin'],
          Videohaku: ['katsottiin', 'Haku'],
          Ohje: ['avattiin', 'käytettiin', 'Haku', 'Tarkasteli'],
          'Google Play Pelit': ['Pelasi kohdetta'],
          'Google Apps for Work': ['Haku', 'Valittu'],
          'Google Lens': ['Lens-haku'],
          'Google Cloud': ['Haku', 'avattiin'],
          Shopping: ['Katsoi'],
          Kirjat: ['Katsottu', 'Haku'],
          Developers: ['katsottiin', 'avattiin'],
          Löydä: [],
          Uutiset: ['Haku', 'avattiin'],
          Gmail: ['Haku'],
          Drive: ['käynnistettiin', 'Haku'],
          'Google Pay': [
            'lähimaksu, joka epäonnistui',
            'lähimaksu',
            'Käytetty Google Pay'
          ],
          Takeout: ['käynnistettiin', 'ladattiin']
        }
      }
    },
    visualization: 'ChartViewTimedObservationsViewer.vue',
    title: 'My activity information',
    text: 'Overview of what google knows about you, get all the dated observations we found in your Google My Activity folder.'
  },
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
