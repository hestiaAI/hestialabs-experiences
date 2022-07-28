import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/facebook.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataPortal: 'https://www.facebook.com/help/212802592074644',
  dataPortalMessage:
    '<strong>Important:</strong> To make the experiment work, please request your data in <strong>JSON</strong> format.',
  files: {
    'advertisers-interacted':
      "**/ads_information/advertisers_you've_interacted_with.json",
    'advertisers-contact-list':
      '**/ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json',
    'advertisers-using-information':
      '**/ads_information/advertisers_using_your_activity_or_information.json',
    'off-facebook-activity':
      '**/apps_and_websites_off_of_facebook/your_off-facebook_activity.json',
    'ads-interests': '**/other_logged_information/ads_interests.json'
  },
  icon: icon,
  preprocessors: {
    '**/*.json': preprocessor
  },
  title: 'Facebook',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
