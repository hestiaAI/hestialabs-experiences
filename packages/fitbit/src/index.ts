import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/fitbit.jpg'
import { genericViewers } from '@/pipelines/generic'

const options: ExperienceOptions = {
  dataPortal: 'https://help.fitbit.com/articles/en_US/Help_article/1133.htm',
  icon: icon,
  slug: 'fitbit',
  title: 'Fitbit',
  viewBlocks: genericViewers
}

export default new Experience(options)
