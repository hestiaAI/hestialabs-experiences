<template>
  <VContainer>
    <VCard :style="`width: 100%; height: ${height}px`">
      <div
        v-if="!loaded"
        class="d-flex flex-column align-center justify-center"
        :style="`width: 100%; height: ${height}px`"
      >
        <BaseProgressCircular
          size="64"
          width="4"
          color="primary"
        />
      </div>
      <iframe
        ref="iframe"
        :srcDoc="iframeHtml"
        class="frame"
        :style="`width: 100%; height: ${height}px`"
        frameborder="0"
        @load="onload"
      />
    </VCard>
  </VContainer>
</template>

<script>
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
function buildIframeHtml() {
  // eslint-disable-next-line no-useless-escape
  const scriptEndTag = '<\/script>'
  const stylesheets = [
    'd1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css',
    'api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css'
  ].map(s => `<link href="https://${s}" rel="stylesheet" />`)
  const headerScripts = [
    'react@16.8.4/umd/react.production.min.js',
    'react-dom@16.8.4/umd/react-dom.production.min.js',
    'redux@3.7.2/dist/redux.js',
    'react-redux@7.1.3/dist/react-redux.min.js',
    'styled-components@4.1.3/dist/styled-components.min.js',
    'kepler.gl@2.5.5/umd/keplergl.min.js'
  ].map(s =>
      `<script src="https://unpkg.com/${s}" crossorigin>${scriptEndTag}`)
  const keplerIframeUrl = 'https://unpkg.com/@hestia.ai/kepler-iframe@1.0.0/index.js'
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          ${stylesheets.join('\n')}
          ${headerScripts.join('\n')}
          <style type="text/css">
            body { margin: 0; padding: 0; overflow: hidden; }
            #app, #app .kepler-gl { width: auto; }
          </style>
        </head>
        <body>
          <div id="app"></div>
          <!--
          // eslint-next-disable-line no-useless-escape -->
          <script src="${keplerIframeUrl}" type="module">${scriptEndTag}
        </body>
      </html>`
}

const iframeHtml = buildIframeHtml()

export default {
  name: 'UnitKepler',
  components: { BaseProgressCircular },
  props: {
    args: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      loaded: false,
      iframeHtml
    }
  },
  computed: {
    finalArgs() {
      const args = this.args
      args.mapboxToken = this.args.mapboxToken
      return args
    }
  },
  watch: {
    finalArgs(newArgs) {
      if (this.loaded) {
        this.callIframeFunction('update', newArgs)
      }
    }
  },
  methods: {
    onload() {
      const initParameters = {
        height: this.height,
        width: (this.width = this.$refs.iframe.offsetWidth),
        ...this.finalArgs
      }
      this.callIframeFunction('init', initParameters)
      this.callIframeFunction('update', this.finalArgs)
      this.loaded = true
    },
    callIframeFunction(functionName, ...args) {
      const func = this.$refs.iframe.contentWindow?.[functionName]
      if (func) {
        try {
          func(...args)
        } catch (error) {
          console.error('problem in iframe', error)
        }
      } else {
        console.error('iframe does not have a function called ' + functionName)
      }
    }
  }
}
</script>
