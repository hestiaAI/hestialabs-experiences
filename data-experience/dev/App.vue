<template>
  <div id="app">
    Hello
    <!-- <TheDataExperience2 v-bind="{experienceConfig, siteConfig}" /> -->
  </div>
</template>
<script>
import experienceConfig from './twitter'
const siteConfig =
{ experiences: ['tracker-control', 'twitter'] }

export default {
  name: 'App',
  data() {
    return {
      experienceConfig,
      siteConfig
    }
  }
}
</script>
