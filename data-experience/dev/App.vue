<template>
  <div id="app" class="app-dev">
    <div style="margin: 30px 0; padding: 10px 0; border-bottom: dotted black 5px">
      <VSelect
        v-model="experience"
        :items="experiences"
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

const siteConfig = {
  experiences,
  i18nLocale: 'fr',
  theme: {
    primary: '#0C2D48',
    secondary: '#2E8BC0'
  }
}

export default {
  name: 'App',
  components: { TheDataExperience2 },
  data() {
    const experience = 'twitter'
    return {
      experiences,
      experience,
      props: {
        siteConfig
      }
    }
  },
  watch: {
    experience: {
      immediate: true,
      handler(v) {
        this.props.experienceConfig = experienceConfigs.find(e => e.slug === v)
      }
    }
  }
}
</script>

<style scoped>
#app .v-select {
  font-family: sans-serif
}
</style>
