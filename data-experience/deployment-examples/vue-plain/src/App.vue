<template>
  <VApp>
    <VMain>
      <TheDataExperience v-bind="{ experienceConfig, siteConfig }"/>
    </VMain>
  </VApp>
</template>

<script>
import uberDriver from '@hestia.ai/uber-driver'
import colors from 'vuetify/lib/util/colors'

export default {
  name: 'App',
  data() {
    return {
      experienceConfig: uberDriver.config,
      siteConfig: {
        i18nLocales: ['fr', 'en'],
        theme: {
          primary: colors.deepOrange.base,
          secondary: colors.lightGreen.darken3
        },
        mapboxToken: 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
      }
    }
  }
}
</script>
