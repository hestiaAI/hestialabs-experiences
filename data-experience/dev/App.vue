<template>
  <VApp>
    <VMain>
      <div class="d-flex-column justify-center" style="width: 100%;">
        <div class="dev-toolbar">
          <VSelect
            label="Experience"
            v-model="experience"
            :items="availableExperiences"
            outlined
            dense
            class="v-select__experiences"
            attach=".v-select__experiences"
            :menu-props="{ bottom: true, offsetY: true }"
            style="margin: auto; width: 200px;"
          />
          <VSelect
            label="Bubble"
            v-model="bubble"
            :items="bubbles"
            outlined
            dense
            class="v-select__bubbles"
            attach=".v-select__bubbles"
            :menu-props="{ bottom: true, offsetY: true }"
            style="margin: auto; width: 200px;"
          />
        </div>
        <TheDataExperience v-bind="props" />
      </div>
    </VMain>
  </VApp>
</template>

<script>
import BubbleAPI from '@/utils/bubble-api'
import { mapMutations } from '@/utils/store-helper'

import appleTracker from '@hestia.ai/apple-tracker'
import appleTrackerAgg from '@hestia.ai/apple-tracker-agg'
import chatgpt from '@hestia.ai/chatgpt'
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

const experienceObjects = [
  appleTracker,
  appleTrackerAgg,
  chatgpt,
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
]

const experiences = experienceObjects.map(e => e.config.slug)
const initialExperience = 'uber-driver'

const siteConfig = {
  i18nLocales: ['fr', 'en'],
  i18nUrl: '/i18n-messages-custom-dev.json',
  experienceViewOptionsUrl: 'https://raw.githubusercontent.com/digipower-academy/experience-viewer-options/main',
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

const experienceViewerOptions = {}
async function populateExperienceViewerOptions() {
  const experiencesWithOpts = ['instagram', 'uber-driver']
  const optPromises = experiencesWithOpts.map(
    async e => [e, await fetchViewerOptions(e)])
  const opts = await Promise.all(optPromises)
  opts.forEach(([exp, conf]) => { experienceViewerOptions[exp] = conf })
}
await populateExperienceViewerOptions()

async function fetchViewerOptions(experience) {
  const relativeUrl = `/${experience}-viewer.json`
  const resp = await fetch(relativeUrl)
  if (resp.ok) {
    const viewerOptions = await resp.json()
    return viewerOptions
  }
  return undefined
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
      props: {
        siteConfig
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
        let expObj = experienceObjects.find(e => e.config.slug === experience)
        const viewerOpts = experienceViewerOptions[experience]
        if (viewerOpts) {
          console.log('reconfiguring', experience)
          expObj = expObj.reconfigure(viewerOpts)
        }
        this.props.experienceConfig = expObj.config
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
