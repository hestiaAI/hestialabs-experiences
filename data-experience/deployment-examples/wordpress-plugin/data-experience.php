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

function func_load_scripts() {
  wp_register_script( 'daex_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js');
  wp_register_script( 'daex_vuei18n', 'https://cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js');
  // module
  wp_register_script( 'daex_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js');
  wp_register_script( 'daex_vuex', 'https://cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js');
  wp_register_script( 'daex_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience/dist/DataExperience.umd.min.js');
  wp_register_script('daex_setup', plugin_dir_url( __FILE__ ).'data-experience-setup.js', 'daex_dataexp', true );
}
add_action('wp_enqueue_scripts', 'func_load_scripts');
add_filter( 'script_loader_tag', 'add_module_to_script', 10, 3 );

function add_module_to_script( $tag, $handle, $src ) {
    $modules = array('daex_vuetify', 'daex_setup');
    if (in_array($handle, $modules)) {
        $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
    }
    return $tag;
}

//Add shortcode
function func_data_experience(){
  wp_enqueue_script('daex_vuejs');
  wp_enqueue_script('daex_vuei18n');
  wp_enqueue_script('daex_vuetify');
  wp_enqueue_script('daex_vuex');
  wp_enqueue_script('daex_dataexp');
  wp_enqueue_script('daex_setup');

   // $str= "<div id='divWpVue'>"
   //  ."Message from Vue: "
   //  ."</div>";

  $html = "<div id=\"app\">"
  ."  <v-app>"
  ."    <v-main>"
  ."      <the-data-experience v-bind=\"{ experienceConfig, siteConfig }\"/>"
  ."    </v-main>"
  ."  </v-app>"
  ."</div>";

   return $html;
}
add_shortcode( 'dataexperience', 'func_data_experience' );
?>
