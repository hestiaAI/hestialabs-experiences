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

// :( this needs to be initialized here to be seen in func_load_scripts
$dataexp_version = '2.0.8';

function func_load_scripts() {
  // global $dataexp_version;
  // wp_register_script( 'daex_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js');
  // wp_register_script( 'daex_vuei18n', 'https://cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js');
  // wp_register_script( 'daex_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js');
  // wp_register_script( 'daex_vuex', 'https://cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js');
  // wp_register_script( 'daex_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
  //                     .$dataexp_version.'/dist/DataExperience.umd.min.js');
  // wp_register_script('daex_setup', plugin_dir_url( __FILE__ ).'data-experience-setup.js', 'daex_dataexp', true );
  wp_register_script('daex_iframe', plugin_dir_url( __FILE__ ).'iframe.js');
}
// function add_module_to_script( $tag, $handle, $src ) {
//   global $dataexp_setup_js;
//   $modules = array('daex_vuetify', 'daex_setup');
//   if (in_array($handle, $modules)) {
//       $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
//   }
//   if ($handle == 'daex_dataexp') {
//       // $tag = $tag.'<script type="module">console.log("Hello from filter, world!", `'.$dataexp_setup_js.'`);</script>';
//       $tag = $tag.'<script type="module">'.$dataexp_setup_js.'</script>';
//   }
//   return $tag;
// }

add_action('wp_enqueue_scripts', 'func_load_scripts');
// add_filter( 'script_loader_tag', 'add_module_to_script', 10, 3 );

// function func_load_styles() {
//   global $dataexp_version;
//   wp_register_style('daex_font_roboto', 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
//   wp_register_style('daex_font_icons', 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');
//   wp_register_style('daex_style_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css');
//   wp_register_style('daex_style_uppy', 'https://releases.transloadit.com/uppy/v3.3.0/uppy.min.css');
//   wp_register_style('daex_style_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
//                       .$dataexp_version.'/dist/DataExperience.css');
// }
// add_action('wp_enqueue_scripts', 'func_load_styles');

//Add shortcode
// https://developer.wordpress.org/plugins/shortcodes/shortcodes-with-parameters/#complete-example
function func_data_experience($atts){

  global $dataexp_version;
  global $dataexp_setup_js;

// TODO: $dataexp_version is read earlier by register_script/style sees it
// the value set here is ignored
//
// solution 1: pass argumetns to action somehow
// https://wordpress.stackexchange.com/questions/45901/passing-a-parameter-to-filter-and-action-functions
// https://wordpress.stackexchange.com/questions/69605/passing-parameters-to-do-action-from-shortcode-to-wp-footer
//
// solution 2: add the script tags in the filters
// since it apparently reads $dataexp_setup_js
// but would this work with css styles too?

// this is overwrittent to late here
  $dataexp_version = $atts['version'] ?? '2.0.8';

  //this works
  $experience = $atts['experience'] ?? 'uber-driver';
  // print 'atts '.$dataexp_version;

  $html = <<<END
  <iframe id="data-experience-iframe" width="100%" height="100%"></iframe>
END;

//   $dataexp_setup_js = <<<END
//   import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/$experience/dist/index.mjs'
//   Vue.use(Vuex)
//   Vue.use(VueI18n)
//   const i18n = new VueI18n(DataExperience.i18nOpts)
//   const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))
//   const store = new Vuex.Store({})
//   Vue.use(DataExperience.DataExperience, { store })
//   const mapboxToken = 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
//   new Vue({
//     el: '#app',
//     i18n,
//     vuetify,
//     store,
//     data: {
//       experienceConfig: experience.config,
//       siteConfig: { mapboxToken }
//     }
//   })
// END;

  wp_enqueue_script('daex_iframe');
  // wp_enqueue_script('daex_vuejs');
  // wp_enqueue_script('daex_vuei18n');
  // wp_enqueue_script('daex_vuetify');
  // wp_enqueue_script('daex_vuex');
  // wp_enqueue_script('daex_dataexp');
  // wp_enqueue_script('daex_setup');

  // wp_enqueue_style('daex_font_roboto');
  // wp_enqueue_style('daex_font_icons');
  // wp_enqueue_style('daex_style_vuetify');
  // wp_enqueue_style('daex_style_uppy');
  // wp_enqueue_style('daex_style_dataexp');

   return $html;
}

// https://developer.wordpress.org/plugins/shortcodes/
add_shortcode( 'dataexperience', 'func_data_experience' );
?>
