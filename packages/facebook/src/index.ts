import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from '@/preprocessors/facebook'
import icon from '@/icons/facebook.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  dataPortal: 'https://www.facebook.com/help/212802592074644',
  defaultView,
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
  slug: 'facebook',
  title: 'Facebook'
}

export default new Experience(options)
