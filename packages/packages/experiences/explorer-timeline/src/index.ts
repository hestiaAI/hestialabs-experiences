import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './explorer-timeline-viewer.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  keepOnlyFiles: false
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
