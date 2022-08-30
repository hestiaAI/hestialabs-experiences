import type { Messages } from '@/types/experience-options'

const genericDateViewer: Messages = {
  en: {
    viewBlocks: {
      genericDateViewer: {
        name: 'Timeline',
        title: 'Timeline',
        text: 'See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.',
        'graph-title': 'Number of dated events in your files',
        'graph-no-date': 'No dated events were found in your file(s).',
        from: 'From',
        to: 'to',
        found: 'we found',
        'dated-event': 'dated events in your file(s).',
        columns: {
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
        'graph-title': "Nombre d'événements datés dans vos dossiers",
        'graph-no-date':
          "Aucun événement daté n'a été trouvé dans votre (vos) dossier(s).",
        from: 'De',
        to: 'à',
        found: 'nous avons trouvé',
        'dated-event': 'événements datés dans votre (vos) fichier(s).',
        columns: {
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
        'graph-title': 'Number of location records in your files',
        'graph-no-location': 'No location were found in your file(s).',
        found: 'We found',
        location: 'locations in your file(s).',
        columns: {
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
        'graph-title': 'Nombre de localisation dans vos fichiers',
        'graph-no-location':
          "Aucune localisation n'a été trouvé dans votre/vos fichier(s).",
        found: 'Nous avons trouvé',
        location: 'dans votre/vos fichier(s).',
        columns: {
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
