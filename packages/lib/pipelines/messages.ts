import type { Messages } from '@/types/experience-options'

const genericDateViewer: Messages = {
  en: {
    viewBlocks: {
      genericDateViewer: {
        name: 'Timeline',
        title: 'Timeline',
        text: 'See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.',
        graphTitle: 'Number of dated events in your files',
        graphNoDate: 'No dated events were found in your file(s).',
        datedEvents:
          'From {currMinDate} to {currMaxDate} we found {total} dated events in your file(s).',
        headers: {
          'File name': 'File name',
          Date: 'Date',
          Description: 'Description'
        }
      }
    }
  },
  fr: {
    viewBlocks: {
      genericDateViewer: {
        name: 'Chronologie',
        title: 'Chronologie',
        text: 'Voir tous les événements datés dans vos dossiers, correspondant aux données qui ont été collectées sur vous à ou concernant une date spécifique.',
        graphTitle: "Nombre d'événements datés dans vos dossiers",
        graphNoDate:
          "Aucun événement daté n'a été trouvé dans votre (vos) dossier(s).",
        datedEvents:
          'De {currMinDate} à {currMaxDate} nous avons trouvé {total} événements datés dans votre (vos) fichier(s).',
        headers: {
          'File name': 'Nom de fichier',
          Date: 'Date',
          Description: 'Description'
        }
      }
    }
  }
}

const genericLocationViewer: Messages = {
  en: {
    viewBlocks: {
      genericLocationViewer: {
        name: 'Location Observations',
        title: 'Location Observations',
        text: 'See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location.',
        graphTitle: 'Number of location records in your files',
        graphNoLocation: 'No location were found in your file(s).',
        locations: 'We found {total} locations in your file(s).',
        headers: {
          File: 'File',
          Path: 'Path',
          Latitude: 'Latitude',
          Longitude: 'Longitude',
          Description: 'Description'
        }
      }
    }
  },
  fr: {
    viewBlocks: {
      genericLocationViewer: {
        name: 'Positions',
        title: 'Observations de localisation',
        text: 'Voir tous les événements de localisation dans vos fichiers, correspondant aux données qui ont été collectées sur vous à ou concernant un lieu spécifique.',
        graphTitle: 'Nombre de localisation dans vos fichiers',
        graphNoLocation:
          "Aucune localisation n'a été trouvé dans votre/vos fichier(s).",
        locations:
          'Nous avons trouvé {total} observations de localisation dans votre/vos fichier(s).',
        headers: {
          File: 'Fichier',
          Path: 'Chemin',
          Latitude: 'Latitude',
          Longitude: 'Longitude',
          Description: 'Description'
        }
      }
    }
  }
}

const viewers: {
  [key: string]: Messages
} = {
  genericDateViewer,
  genericLocationViewer
}

export default viewers
