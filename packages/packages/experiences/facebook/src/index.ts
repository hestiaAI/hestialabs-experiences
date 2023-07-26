import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './facebook-viewer.json'
import viewerFunctions from './viewer-functions'
import preprocessor from './preprocessor'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
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
  preprocessors: {
    '**/*.json': preprocessor
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
