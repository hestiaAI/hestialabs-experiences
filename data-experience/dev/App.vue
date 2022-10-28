<template>
  <div id="app" class="app-dev d-inline-flex">
    <div style="margin: 30px 0; padding: 10px 0; border-bottom: dotted black 5px">
      <VSelect
        label="Experience"
        v-model="experience"
        :items="availableExperiences"
        outlined
        dense
        attach=".app-dev .v-select"
        :menu-props="{ bottom: true, offsetY: true }"
        style="margin: auto; width: 200px;"
      />
      <VSelect
        label="Bubble"
        v-model="bubble"
        :items="bubbles"
        outlined
        dense
        attach=".app-dev .v-select"
        :menu-props="{ bottom: true, offsetY: true }"
        style="margin: auto; width: 200px;"
      />
    </div>
    <TheDataExperience2 v-bind="props" />
  </div>
</template>

<script>
import TheDataExperience2 from '@/components/TheDataExperience.vue'
import BubbleApi from '@/utils/bubble-api'

import appleTracker from '../../packages/packages/apple-tracker/dist/index.mjs'
import appleTrackerAgg from '../../packages/packages/apple-tracker-agg/dist/index.mjs'
import explorer from '../../packages/packages/explorer/dist/index.mjs'
import facebook from '../../packages/packages/facebook/dist/index.mjs'
import fitbit from '../../packages/packages/fitbit/dist/index.mjs'
import google from '../../packages/packages/google/dist/index.mjs'
import googleAgg from '../../packages/packages/google-agg/dist/index.mjs'
import her from '../../packages/packages/her/dist/index.mjs'
import herTinderAgg from '../../packages/packages/her-tinder-agg/dist/index.mjs'
import instagram from '../../packages/packages/instagram/dist/index.mjs'
import linkedin from '../../packages/packages/linkedin/dist/index.mjs'
import netflix from '../../packages/packages/netflix/dist/index.mjs'
import strava from '../../packages/packages/strava/dist/index.mjs'
import tiktok from '../../packages/packages/tiktok/dist/index.mjs'
import tinder from '../../packages/packages/tinder/dist/index.mjs'
import trackerControl from '../../packages/packages/tracker-control/dist/index.mjs'
import trackerControlAgg from '../../packages/packages/tracker-control-agg/dist/index.mjs'
import twitter from '../../packages/packages/twitter/dist/index.mjs'
import twitterAgg from '../../packages/packages/twitter-agg/dist/index.mjs'
import uber from '../../packages/packages/uber/dist/index.mjs'
import uberDriver from '../../packages/packages/uber-driver/dist/index.mjs'
import youtube from '../../packages/packages/youtube/dist/index.mjs'
// import participantBubbleConfigFromServer from './pdio-participant.json'

const experienceConfigs = [
  appleTracker,
  appleTrackerAgg,
  explorer,
  facebook,
  fitbit,
  google,
  googleAgg,
  her,
  herTinderAgg,
  instagram,
  linkedin,
  netflix,
  strava,
  tiktok,
  tinder,
  trackerControl,
  trackerControlAgg,
  twitter,
  twitterAgg,
  uber,
  uberDriver,
  youtube
].map(e => e.config)

const experiences = experienceConfigs.map(e => e.slug)
const initialExperience = 'twitter'

const siteConfig = {
  experiences,
  i18nLocale: 'fr',
  theme: {
    primary: '#0C2D48',
    secondary: '#2E8BC0'
  }
}

const noBubble = 'no bubble'
const bubbleIds = [
  noBubble,
  // 'brown-aggregator',
  // 'brown-participant',
  // 'dating-apps-course',
  // 'health-course',
  // 'live-aggregator',
  // 'live-participant',
  // 'matching-algo-course',
  // 'mercator-aggregator',
  // 'mercator-participant',
  // 'observe-aggregator',
  // 'observe-participant',
  // 'pdio-aggregator',
  // 'pdio-participant',
  // 'policy-making-course',
  // 'reflets-aggregator',
  // 'reflets-participant',
  // 'sciencespo-aggregator',
  // 'sciencespo-participant',
  // 'sit-aggregator',
  // 'sit-participant',
  // 'swiss-mp-aggregator',
  // 'swiss-mp-participant',
  // 'th-aggregator',
  // 'th-participant',
  // 'tl-aggregator',
  // 'tl-participant',
  'demo-aggregator',
  // 'demo-computation',
  'demo-participant'
]
const configsFromServer = {}
async function populateServerConfigs() {
  const validBubbleIds = bubbleIds.filter(bi => bi !== noBubble)
  const ps = validBubbleIds.map(bi => bubbleApi.getConfig(bi))
  const serverConfigList = await Promise.all(ps)
  validBubbleIds.forEach((bi, i) => {
    configsFromServer[bi] = serverConfigList[i]
  })
}

function experiencesInBubble(bubbleId) {
  return configsFromServer[bubbleId]?.experiences
}

const theApiUrl = 'http://127.0.0.1:8000'
const bubbleApi = new BubbleApi(theApiUrl)

function makeBubbleConfig(bubbleId, experience) {
  const configFromServer = configsFromServer[bubbleId]
  if (!configFromServer) {
    return undefined
  }
  const id = bubbleId
  const apiUrl = theApiUrl
  let consent
  if (configFromServer.consent) {
    const { destinationBubble, ...consents } = configFromServer.consent
    const form = consents?.[experience] || consents?.default
    consent = { destinationBubble, form }
  }
  const bubbleConfig = { ...configFromServer, id, apiUrl, consent }
  return bubbleConfig
}

export default {
  name: 'App',
  components: { TheDataExperience2 },
  data() {
    return {
      experience: initialExperience,
      bubbles: bubbleIds,
      bubble: noBubble,
      props: {
        siteConfig
      }
    }
  },
  computed: {
    availableExperiences() {
      return experiencesInBubble(this.bubble) || experiences
    }
  },
  watch: {
    experience: {
      immediate: true,
      handler(v) {
        this.props.experienceConfig =
          experienceConfigs.find(e => e.slug === v)
        this.props.bubbleConfig =
          makeBubbleConfig(this.bubble, this.experience)
      }
    },
    bubble: {
      immediate: true,
      handler(bubbleId) {
        const available = experiencesInBubble(bubbleId)
        if (available?.includes(this.experience)) {
          this.props.bubbleConfig =
            makeBubbleConfig(this.bubble, this.experience)
        } else {
          const exp = this.experience
          const simi = available?.find(
            e => e.startsWith(exp) || exp?.startsWith(e))
          this.experience = simi || available?.[0] || initialExperience
        }
      }
    }
  },
  async created() {
    populateServerConfigs()
  }
}
</script>

<style scoped>
#app .v-select {
  font-family: sans-serif
}
</style>
