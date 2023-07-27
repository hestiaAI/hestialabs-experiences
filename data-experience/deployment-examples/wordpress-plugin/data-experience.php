<?php
/**
 * Plugin Name: Data Experience
 * Description: A shortcode to include data-experience on a page.
 *
 * Zip this file and upload it to plugins in the wordpress dashboard
 * https://themewaves.com/how-to-upload-plugin-to-wordpress/
 *
 * Based on https://dev.to/workingwebsites/using-vue-in-wordpress-1b9l
 */

//Add shortcode
// https://developer.wordpress.org/plugins/shortcodes/shortcodes-with-parameters/#complete-example
function func_data_experience($atts){

  global $dataexp_setup_js;

  $dataexp_version = $atts['version'] ?? 'latest';
  $experience = $atts['experience'] ?? 'uber-driver';
  $viewer_opts = $atts['viewer-opts'] ?? null;
  $viewer_opts = $viewer_opts === null ? 'undefined' : "'$viewer_opts'";
  $bubble = $atts['bubble'] ?? '';
  // print 'atts '.$dataexp_version.' '.$experience.' '.$bubble;

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

  wp_enqueue_script('daex_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js');
  wp_enqueue_script('daex_vuei18n', 'https://cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js');
  wp_enqueue_script('daex_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js');
  wp_enqueue_script('daex_vuex', 'https://cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js');
  // wp_enqueue_script('daex_dataexp', 'http://localhost:8000/dist/DataExperience.umd.min.js');
  wp_enqueue_script('daex_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
                     .$dataexp_version.'/dist/DataExperience.umd.min.js');

  wp_enqueue_style('daex_font_roboto', 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
  wp_enqueue_style('daex_font_icons', 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');
  wp_enqueue_style('daex_style_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css');
  wp_enqueue_style('daex_style_uppy', 'https://releases.transloadit.com/uppy/v3.3.0/uppy.min.css');
  wp_enqueue_style('daex_style_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
                      .$dataexp_version.'/dist/DataExperience.css');

   return $html;
}

function add_module_to_script( $tag, $handle, $src ) {
  global $dataexp_setup_js;
  $modules = array('daex_vuetify');
  if (in_array($handle, $modules)) {
      $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
  }
  if ($handle == 'daex_dataexp') {
      // $tag = $tag.'<script type="module">console.log("Hello from filter, world!", `'.$dataexp_setup_js.'`);</script>';
      $tag = $tag.'<script type="module">'.$dataexp_setup_js.'</script>';
  }
  return $tag;
}

// https://developer.wordpress.org/plugins/shortcodes/
add_shortcode( 'dataexperience', 'func_data_experience' );
add_filter( 'script_loader_tag', 'add_module_to_script', 10, 3 );

?>
