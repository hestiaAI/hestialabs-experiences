import appleTracker from '../../../packages/apple-tracker/src/index'
import appleTrackerAgg from '../../../packages/apple-tracker-agg/src/index'
import facebook from '../../../packages/facebook/src/index'
import google from '../../../packages/google/src/index'
import googleAgg from '../../../packages/google-agg/src/index'
import her from '../../../packages/her/src/index'
import instagram from '../../../packages/instagram/src/index'
import linkedin from '../../../packages/linkedin/src/index'
import netflix from '../../../packages/netflix/src/index'
import tiktok from '../../../packages/tiktok/src/index'
import tinder from '../../../packages/tinder/src/index'
import trackerControl from '../../../packages/tracker-control/src/index'
import trackerControlAgg from '../../../packages/tracker-control-agg/src/index'
import twitter from '../../../packages/twitter/src/index'
import twitterAgg from '../../../packages/twitter-agg/src/index'
import uber from '../../../packages/uber/src/index'
import uberDriver from '../../../packages/uber-driver/src/index'

const experiences = {
  appleTracker,
  appleTrackerAgg,
  facebook,
  google,
  googleAgg,
  her,
  instagram,
  linkedin,
  netflix,
  tiktok,
  tinder,
  trackerControl,
  trackerControlAgg,
  twitter,
  twitterAgg,
  uber,
  uberDriver
}

Object.values(experiences).forEach(experience => {
  const {
    options: {
      title,
      databaseConfig,
      files,
      keepOnlyFiles,
      preprocessors,
      viewBlocks
    }
  } = experience
  experience.options = {
    title,
    databaseConfig,
    files,
    keepOnlyFiles,
    preprocessors,
    viewBlocks
  }
})

export default experiences
