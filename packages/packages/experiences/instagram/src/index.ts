import packageJSON from '../package.json'
import { Experience, ExperienceOptions, LoaderOptions } from '@/index'
// import icon from '@/icons/instagram.png'
// import viewBlocks from './blocks'
import databaseConfig from './database'
// import messages from './messages.json'
// import dataSample from '@/data-samples/instagramV2.zip'
import preprocessor from '../../facebook/src/preprocessor'
import viewerOptions from './viewer.json'

const loaderOptions: LoaderOptions = {
  // version: 2,
  //
  // version 3 load external viewer.json during build
  // version 4 load external viewer.json during runtime (user)
  // problem: aggregation bubbles depend on presentation of view tabs
  // loader
  databaseConfig,
  files: {
    messages: '**/messages/inbox/**/message_*.json',
    followers: '**/followers.json',
    followings: '**/following.json',
    postsViewed: '**/posts_viewed.json',
    videosWatched: '**/videos_watched.json',
    adsViewed: '**/ads_viewed.json',
    likedComments: '**/liked_comments.json',
    likedPosts: '**/liked_posts.json',
    advertisers: '**/advertisers_using_your_activity_or_information.json',
    adsClicked: '**/ads_clicked.json',
    adsInterests: '**/ads_interests.json',
    yourTopics: '**/your_topics.json',
    yourReelsSentiments: '**/your_reels_sentiments.json',
    yourReelsTopics: '**/your_reels_topics.json',
    posts: '**/posts_*.json',
    stories: '**/stories.json',
    personalInfos: '**/personal_information.json'
  },
  preprocessors: {
    '**/*.json': preprocessor
  }
}

const options = { ...loaderOptions, ...viewerOptions } as ExperienceOptions
// const oldViewerOptions: ViewerOptions = {
//   title: 'Instagram',
//   dataPortal: 'https://help.instagram.com/181231772500920',
//   dataPortalMessage:
//     '<strong>Important:</strong> To make the experience work, please request your data in <strong>JSON</strong> format.',
//   dataSamples: [dataSample],
//   // icon,
//   icon: 'https://raw.githubusercontent.com/hestiaAI/hestialabs-experiences/a29ee41dca8d2d8aaf2e377e6422e820f66db1bd/packages/lib/icons/instagram.png',
//   hideFileExplorer: false,
//   viewBlocks,
//   messages
// }
// const oldOptions = { ...loaderOptions, ...oldViewerOptions } as ExperienceOptions

export default new Experience(options, packageJSON, import.meta.url)
