<template>
  <VApp>
    <VMain>
      <VRow class="dev-toolbar">
        <VCol>
          <VSelect
            label="Experience"
            v-model="experience"
            class="ma-2"
            :items="availableExperiences"
            outlined
            dense
            :menu-props="{ bottom: true, offsetY: true }"
          />
        </VCol>
        <VCol>
          <VSelect
            label="Bubble"
            v-model="bubble"
            class="ma-2"
            :items="bubbles"
            outlined
            dense
            :menu-props="{ bottom: true, offsetY: true }"
          />
        </VCol>
        <VCol>
          <VSelect
            label="Language"
            v-model="locale"
            class="ma-2"
            :items="locales"
            outlined
            dense
            @change="$i18n.locale = locale"
            :menu-props="{ bottom: true, offsetY: true }"
          />
        </VCol>
      </VRow>
      <TheDataExperience v-bind="props" />
    </VMain>
  </VApp>
</template>

<script>
import BubbleAPI from '@/utils/bubble-api'
import { mapMutations } from '@/utils/store-helper'

import appleTracker from '@hestia.ai/apple-tracker'
import appleTrackerAgg from '@hestia.ai/apple-tracker-agg'
import explorer from '@hestia.ai/explorer'
import facebook from '@hestia.ai/facebook'
import fitbit from '@hestia.ai/fitbit'
import google from '@hestia.ai/google'
import googleAgg from '@hestia.ai/google-agg'
import her from '@hestia.ai/her'
import herTinderAgg from '@hestia.ai/her-tinder-agg'
import instagram from '@hestia.ai/instagram'
import linkedin from '@hestia.ai/linkedin'
import linkedinAgg from '@hestia.ai/linkedin-agg'
import netflix from '@hestia.ai/netflix'
import strava from '@hestia.ai/strava'
import tiktok from '@hestia.ai/tiktok'
import tinder from '@hestia.ai/tinder'
import trackerControl from '@hestia.ai/tracker-control'
import trackerControlAgg from '@hestia.ai/tracker-control-agg'
import twitter from '@hestia.ai/twitter'
import twitterAgg from '@hestia.ai/twitter-agg'
import uber from '@hestia.ai/uber'
import uberDriver from '@hestia.ai/uber-driver'
import youtube from '@hestia.ai/youtube'

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
  linkedinAgg,
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
const initialExperience = 'uber-driver'

const siteConfig = {
  i18nLocales: ['fr', 'en'],
  i18nUrl: '/i18n-messages-custom-dev.json',
  theme: {
    primary: '#0C2D48',
    secondary: '#2E8BC0'
  },
  mapboxToken: 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
}

const noBubble = 'no bubble'
const bubbleIds = [
  noBubble,
  // 'brown-aggregator',
  // 'brown-participant',
  // 'dating-apps-course',
  // 'health-course',
  'live-aggregator',
  'live-participant',
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
  // 'swiss-mp-aggregator',
  // 'swiss-mp-participant',
  // 'th-aggregator',
  // 'th-participant',
  'tl-aggregator',
  'tl-participant',
  'demo-aggregator',
  // 'demo-computation',
  'demo-participant'
]
const configsFromServer = {}
async function populateServerConfigs() {
  const validBubbleIds = bubbleIds.filter(bid => bid !== noBubble)
  const ps = validBubbleIds.map(bid => bubbleAPI.getConfig(bid))
  const serverConfigList = await Promise.all(ps)
  validBubbleIds.forEach((bid, i) => {
    configsFromServer[bid] = serverConfigList[i]
  })
}

function experiencesInBubble(bubbleId) {
  return configsFromServer[bubbleId]?.experiences
}

const theApiUrl = 'http://127.0.0.1:8000'
const bubbleAPI = new BubbleAPI(theApiUrl)

function makeBubbleConfig(bubbleId) {
  const configFromServer = configsFromServer[bubbleId]
  if (!configFromServer) {
    return
  }
  return {
    ...configFromServer,
    id: bubbleId,
    apiUrl: theApiUrl
  }
}

export default {
  name: 'App',
  data() {
    return {
      experience: initialExperience,
      bubbles: bubbleIds,
      bubble: noBubble,
      locales: siteConfig.i18nLocales,
      locale: siteConfig.i18nLocales[0],
      props: {
        siteConfig,
        showLocales: true
      }
    }
  },
  computed: {
    availableExperiences() {
      return experiencesInBubble(this.bubble) || experiences.filter(slug => !slug.endsWith('-agg'))
    }
  },
  watch: {
    experience: {
      immediate: true,
      handler(experience) {
        this.props.experienceConfig =
          experienceConfigs.find(e => e.slug === experience)
        this.props.bubbleConfig = makeBubbleConfig(this.bubble)
      }
    },
    bubble: {
      immediate: true,
      handler(bubbleId) {
        const available = experiencesInBubble(bubbleId)
        if (available?.includes(this.experience)) {
          this.props.bubbleConfig = makeBubbleConfig(bubbleId)
        } else {
          const exp = this.experience
          const simi = available?.find(
            e => e.startsWith(exp) || exp?.startsWith(e))
          this.experience = simi || available?.[0] || initialExperience
        }
        this.setBubbleCodeword(undefined)
      }
    }
  },
  async beforeCreate() {
    await populateServerConfigs()
  },
  methods: {
    ...mapMutations(['setBubbleCodeword'])
  }
}
</script>

<style scoped>
#app .dev-toolbar {
  margin: 30px 0;
  padding: 10px 0;
  border-bottom: dotted black 5px;
}
#app .dev-toolbar .v-select {
  font-family: sans-serif;
}
</style>
