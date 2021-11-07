import { Experience, ExperienceOptions } from 'shared/index'
import { theEyeballs } from 'collaborators/index'
import preprocessor from 'preprocessors/facebook'
import icon from 'icons/facebook.png'

const options: ExperienceOptions = {
  allowMissingFiles: true,
  collaborator: theEyeballs,
  dataPortal: 'https://www.facebook.com/help/212802592074644',
  fileExtensions: ['zip'],
  icon: icon,
  preprocessor,
  slug: 'facebook',
  title: 'Facebook',
  zipFilePaths: [
    'apps_and_websites_off_of_facebook/your_off-facebook_activity.json',
    'your_topics/your_topics.json',
    "ads_information/advertisers_you've_interacted_with.json",
    'ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json'
  ]
}

export default new Experience(options)
