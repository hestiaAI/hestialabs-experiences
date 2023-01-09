<template>
  <div id="app">
    <VApp>
      <VMain>
        <TheDataExperience v-bind="{ experienceConfig, siteConfig }"/>
      </VMain>
    </VApp>
  </div>
</template>

<script>
import uberDriver from '@hestia.ai/uber-driver'

export default {
  name: 'App',
  data() {
    return {
      experienceConfig: uberDriver.config,
      siteConfig: {
        // experiences,
        i18nLocales: ['fr', 'en'],
        theme: {
          primary: 'deep-orange',
          secondary: 'light-green-darken-3'
        },
        mapboxToken: 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
