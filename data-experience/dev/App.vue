<template>
  <div id="app">
    <TheDataExperience2 v-bind="{experienceConfig, siteConfig}" />
  </div>
</template>
<script>
import twitterExperience from './twitter'
import TheDataExperience2 from '@/components/TheDataExperience.vue'

function formatExperienceAsInStore(exp) {
  const { name, version, options } = exp
  return {
    slug: name,
    version,
    ...options
  }
}

const siteConfig =
{ experiences: ['tracker-control', 'twitter'] }

export default {
  name: 'App',
  components: { TheDataExperience2 },
  data() {
    return {
      experienceConfig: formatExperienceAsInStore(twitterExperience),
      siteConfig
    }
  }
}
</script>
