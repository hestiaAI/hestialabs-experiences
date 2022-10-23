<template>
  <div id="app">
    <TheDataExperience2 v-bind="props" />
  </div>
</template>

<script>
import twitterExperience from './twitter'
import TheDataExperience2 from '@/components/TheDataExperience.vue'

const siteConfig = {
  experiences: ['tracker-control', 'twitter'],
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
    return {
      props: {
        experienceConfig: twitterExperience.config,
        siteConfig
      }
    }
  }
}
</script>
