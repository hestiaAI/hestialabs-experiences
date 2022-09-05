import vegaWordcloudTargetingCriteria, {
  options
} from './wordcloud-targeting-criteria'

const descriptions = [
  "Twitter détermine les utilisateurs similaires à ceux qui suivent des comptes sur la base d'une variété de signaux, notamment ce qu'ils Retweetent, cliquent, Tweetent, etc.",
  "Twitter détermine les intérêts en fonction de divers signaux, notamment les personnes qu'elles suivent, ce qu'elles retweetent, ce qu'elles cliquent, ce qu'elles tweetent, etc",
  'Atteignez les groupes de personnes qui ont effectué une action spécifique dans votre application, comme les installations ou les inscriptions.',
  "Il est possible de collecter ces données à l'aide de la balise de site web de Twitter disponible via Twitter Ads.",
  "Les listes sont créées en téléchargeant un fichier contenant votre adresse e-mail, votre identifiant publicitaire mobile ou votre nom d'utilisateur Twitter.",
  "Les personnes peuvent être considérées comme faisant partie d'une audience de conversation si elles ont tweeté ou se sont engagées avec un tweet mentionnant le sujet.",
  "Le ciblage par mot-clé permet aux annonceurs d'atteindre des personnes sur Twitter sur la base de mots-clés dans leurs requêtes de recherche, de Tweets récents et de Tweets avec lesquels ils se sont récemment engagés.",
  "Le ciblage géographique de Twitter est basé sur la localisation récente d'une personne. Il s'agit d'une combinaison de la localisation actuelle et de l'historique des localisations récentes. Twitter utilise plusieurs signaux pour déterminer si quelqu'un se trouve actuellement dans un lieu géographique particulier, comme l'adresse IP web, le signal GPS mobile, le signal WiFi mobile, et des signaux en temps réel, comme lorsque quelqu'un inclut son emplacement dans un Tweet.",
  "S'il n'est pas spécifié dans votre profil Twitter, Twitter le déduit des utilisateurs qui l'ont fait, en se basant sur un certain nombre d'attributs tels que les comptes qu'ils suivent et leurs intérêts ",
  "Twitter déduit la langue d'une personne à partir de la langue sélectionnée dans les paramètres de son profil, des langues qui correspondent à son activité sur Twitter et plus encore.",
  "Twitter utilise le genre fourni par les personnes dans leurs profils, et étend ces données à d'autres personnes en fonction de facteurs de ressemblance de comptes pour déterminer le genre des personnes n'ayant pas saisi manuellement leur genre préféré.",
  "Les annonceurs peuvent cibler par système d'exploitation (par exemple, IOS vs Android)",
  'Les annonceurs peuvent cibler par plateforme utilisée par le client (par exemple Iphone 7 vs Iphone 8)',
  "Avec le ciblage par événement, Twitter peut découvrir et cibler les événements qui correspondent le mieux à l'audience des annonceurs - puis créer une campagne qui diffuse leurs publicités au bon moment, à la bonne audience, au fur et à mesure que l'événement se déroule."
]

const dictionary = {
  filterSignalName: 'Critères',
  'was used by': 'a été utilisé',
  'advertiser(s)': 'annonceur(s)'
}

const labels = [
  'Abonnés similaires',
  'Intérêts',
  "Activité de l'application",
  'Website Activity',
  'Liste',
  'Sujets de conversation',
  'Mots clés',
  'Emplacements',
  'Âge',
  'Langues',
  'Genre',
  'OS versions',
  'Plateformes',
  'Événements'
]
export default vegaWordcloudTargetingCriteria(descriptions, dictionary, labels)
