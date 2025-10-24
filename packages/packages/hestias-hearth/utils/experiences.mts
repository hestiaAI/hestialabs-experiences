import { Experience } from '../../../lib/index'

import appleTracker from '../../experiences/apple-tracker/dist/index.mjs'
import facebook from '../../experiences/facebook/dist/index.mjs'
import google from '../../experiences/google/dist/index.mjs'
import her from '../../experiences/her/dist/index.mjs'
import instagram from '../../experiences/instagram/dist/index.mjs'
import linkedin from '../../experiences/linkedin/dist/index.mjs'
import netflix from '../../experiences/netflix/dist/index.mjs'
import tiktok from '../../experiences/tiktok/dist/index.mjs'
import tinder from '../../experiences/tinder/dist/index.mjs'
import trackerControl from '../../experiences/tracker-control/dist/index.mjs'
import twitter from '../../experiences/twitter/dist/index.mjs'
import uber from '../../experiences/uber/dist/index.mjs'
import uberDriver from '../../experiences/uber-driver/dist/index.mjs'

export const experiences: {
  [key: string]: Experience
} = {
  appleTracker,
  facebook,
  google,
  her,
  instagram,
  linkedin,
  netflix,
  tiktok,
  tinder,
  trackerControl,
  twitter,
  uber,
  uberDriver
}
