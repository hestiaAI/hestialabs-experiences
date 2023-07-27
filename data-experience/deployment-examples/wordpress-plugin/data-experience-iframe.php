<?php
/**
 * Plugin Name: Data Experience Iframe
 * Description: A shortcode to include data-experience on a page, in an iframe.
 *
 * Zip this file and upload it to plugins in the wordpress dashboard
 * https://themewaves.com/how-to-upload-plugin-to-wordpress/
 *
 * Based on https://dev.to/workingwebsites/using-vue-in-wordpress-1b9l
 */

//Add shortcode
// https://developer.wordpress.org/plugins/shortcodes/shortcodes-with-parameters/#complete-example
function func_data_experience_iframe($atts){

  $dataexp_version = $atts['version'] ?? 'latest';
  $experience = $atts['experience'] ?? 'uber-driver';
  $viewer_opts = $atts['viewer-opts'] ?? null;
  $viewer_opts = $viewer_opts === null ? 'undefined' : "'$viewer_opts'";
  $bubble = $atts['bubble'] ?? '';
  $iframe_class = $atts['class'] ?? '';
  $iframe_style = $atts['style'] ?? '';


  $html = <<<END
  <div id="app">
    <v-app>
      <v-main>
        <the-data-experience v-bind="{ experienceModule, bubbleConfig, siteConfig }"/>
      </v-main>
    </v-app>
  </div>
END;

  $dataexp_setup_js = <<<END
  import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/$experience/dist/index.mjs'
  Vue.use(Vuex)
  Vue.use(VueI18n)
  const i18n = new VueI18n(DataExperience.i18nOpts)
  const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))
  const store = new Vuex.Store({})
  Vue.use(DataExperience.DataExperience, { store })
  const experienceViewerOptions = $viewer_opts
  const theApiUrl = 'https://bubbles.hestialabs.org'
  const bubbleAPI = new DataExperience.BubbleAPI(theApiUrl)
  const bubble = '$bubble'
  let bubbleConfig = undefined
  if (bubble) {
    bubbleConfig = await bubbleAPI.getConfig('$bubble')
    if (experienceViewerOptions !== undefined) {
      bubbleConfig.experienceViewerOptions = experienceViewerOptions
    }
  }

  const mapboxToken = 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
  new Vue({
    el: '#app',
    i18n,
    vuetify,
    store,
    data: {
      experienceModule: experience,
      bubbleConfig,
      siteConfig: { mapboxToken, experienceViewerOptions }
    }
  })
END;

  $iframe_setup_js = <<<END
    const stylesheets = [
      "fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
      "cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css",
      "cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css",
      "releases.transloadit.com/uppy/v3.3.0/uppy.min.css",
      "cdn.jsdelivr.net/npm/@hestia.ai/data-experience@$dataexp_version/dist/DataExperience.css"
    ].map(s => `<link href="https://\${ s }" rel="stylesheet" />`)
    const scripts = [
      ["cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"],
      ["cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js"],
              ["cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js", "module"],
      ["cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js"],
      ["cdn.jsdelivr.net/npm/@hestia.ai/data-experience@$dataexp_version/dist/DataExperience.umd.min.js"]
    ].map(s =>
      `<script src="https://\${s[0]}" \${s[1] ? 'type="module"' : ''} crossorigin> <\/script>`
    )
    const iframeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          \${ stylesheets.join('\\n') }
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
        <\/head>
        <body>
          <div id="app">
          <v-app>
            <v-main>
              <the-data-experience v-bind="{ experienceModule, siteConfig, bubbleConfig }"\/>
            <\/v-main>
          <\/v-app>
          <\/div>
         \${ scripts.join('\\n') }
         <script type="module">
           $dataexp_setup_js
         <\/script>
        <\/body>
      <\/html>`

    const iframe = document.getElementById("dataexperience_iframe_id");
    iframe.srcdoc = iframeHtml
END;

  //TODO add style and class
  $iframe_html = <<<END
    <iframe id="dataexperience_iframe_id"
            class="$iframe_class"
            style="$iframe_style"
    ></iframe>
    <script>
      $iframe_setup_js
    </script>
END;

   return $iframe_html;
}

// https://developer.wordpress.org/plugins/shortcodes/
add_shortcode( 'dataexperience-iframe', 'func_data_experience_iframe' );

?>
