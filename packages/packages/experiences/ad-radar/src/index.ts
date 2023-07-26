import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './ad-radar-viewer.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  disabled: true
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
