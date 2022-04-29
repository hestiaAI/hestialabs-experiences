import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/spotify.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'spotify',
  title: 'Spotify',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
