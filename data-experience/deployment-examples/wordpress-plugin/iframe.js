const iframeHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>data-experience iframe</title>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
  <link href="https://releases.transloadit.com/uppy/v3.3.0/uppy.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@2.0.8/dist/DataExperience.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>
  <div id="app">
    <v-app>
      <v-main>
        <the-data-experience v-bind="{ experienceConfig, siteConfig }"/>
      </v-main>
    </v-app>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@2.0.8/dist/DataExperience.umd.min.js"></script>
  <script type="module">
    import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/uber-driver/dist/index.mjs'
    Vue.use(Vuex)
    Vue.use(VueI18n)
    const i18n = new VueI18n(DataExperience.i18nOpts)
    const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))
    const store = new Vuex.Store({})
    Vue.use(DataExperience.DataExperience, { store })
    const mapboxToken = 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
    new Vue({
      el: '#app',
      i18n,
      vuetify,
      store,
      data: {
        experienceConfig: experience.config,
        siteConfig: { mapboxToken }
      }
    })
  </script>
</body>
</html>
`

const iframe = document.getElementById('data-experience-iframe')
iframe.srcdoc = iframeHtml
