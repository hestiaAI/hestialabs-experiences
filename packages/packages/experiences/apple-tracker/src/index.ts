import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/apple.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import ndjsonToJson from './preprocessor'
import dataSample from '@/data-samples/apple-tracker.ndjson'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortalHtml:
    'In iOS 15.2, iPadOS 15.2, and watchOS 8.3 or later, users can view a privacy report of when your apps ' +
    'accesses certain kinds of user data, like photos and contacts or sensitive device resources, ' +
    'like the camera and microphone. You can also see when they contacts network domains, including websites ' +
    'that you visit from within your apps. Examine the data that your apps contributes to this summary to make ' +
    'sure that your app behaves as you expect. Once you receive it, analyze it here.<div style="margin: 1rem;"><ul style="display: inline-block;">' +
    '<li align="left">Go to the Settings app then choose <b>Privacy > App Privacy Report</b>.</li>' +
    '<li align="left">Enable app activity recording on your device by tapping <b>Turn On App Privacy Report</b></li>' +
    '<li align="left">Run your apps for a while</li>' +
    '<li align="left">Download the report by tapping the <b>Share button</b> on the App Privacy Report screen</li>' +
    '<li align="left">Drop the downloaded file below</li></ul></div>',
  dataSamples: [dataSample],
  files: {
    'tracker-control-ios': '**/*.ndjson'
  },
  icon,
  preprocessors: {
    '**/*.ndjson': ndjsonToJson
  },
  subtitle: 'Tracking data',
  title: 'AppleTracker',
  viewBlocks
}

export default new Experience(options, undefined, packageJSON, import.meta.url)
