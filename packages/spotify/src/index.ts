import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/spotify.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'spotify',
  title: 'Spotify'
}

export default new Experience(options)
