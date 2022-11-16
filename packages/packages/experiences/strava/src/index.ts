import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/strava.png'
import { genericViewers } from '@/pipelines/generic'

const options: ExperienceOptions = {
  dataPortal:
    'https://support.strava.com/hc/en-us/articles/216918437-Exporting-your-Data-and-Bulk-Export#Bulk',
  hideFileExplorer: false,
  icon,
  title: 'Strava',
  viewBlocks: genericViewers
}

export default new Experience(options, packageJSON, import.meta.url)
