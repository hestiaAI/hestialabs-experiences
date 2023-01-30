import appleTracker from '@hestia.ai/apple-tracker'
import explorer from '@hestia.ai/explorer'
import facebook from '@hestia.ai/facebook'
import google from '@hestia.ai/google'
import instagram from '@hestia.ai/instagram'
import linkedin from '@hestia.ai/linkedin'
import trackerControl from '@hestia.ai/tracker-control'
import twitter from '@hestia.ai/twitter'
import uber from '@hestia.ai/uber'
import uberDriver from '@hestia.ai/uber-driver'

export default Object.fromEntries([
  appleTracker,
  explorer,
  facebook,
  google,
  instagram,
  linkedin,
  trackerControl,
  twitter,
  uber,
  uberDriver
].map(xp => [xp.name, xp.config]))
