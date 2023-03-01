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

$plugin_path = plugin_dir_path(__FILE__);
$json_data = file_get_contents($plugin_path . 'config.json');

// Decode the JSON data into a PHP object
$config = json_decode($json_data);
$dataexp_version = $config->data_experience_version;


function func_load_scripts() {
  global $dataexp_version;
  wp_register_script( 'daex_vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js');
  wp_register_script( 'daex_vuei18n', 'https://cdn.jsdelivr.net/npm/vue-i18n@8.x/dist/vue-i18n.js');
  wp_register_script( 'daex_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js');
  wp_register_script( 'daex_vuex', 'https://cdn.jsdelivr.net/npm/vuex@3.x/dist/vuex.min.js');
  wp_register_script( 'daex_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
                      .$dataexp_version.'/dist/DataExperience.umd.min.js');
  wp_register_script('daex_setup', plugin_dir_url( __FILE__ ).'data-experience-setup.js', 'daex_dataexp', true );
}
add_action('wp_enqueue_scripts', 'func_load_scripts');
add_filter( 'script_loader_tag', 'add_module_to_script', 10, 3 );

function func_load_styles() {
  global $dataexp_version;
  wp_register_style('daex_font_roboto', 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
  wp_register_style('daex_font_icons', 'https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');
  wp_register_style('daex_style_vuetify', 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css');
  wp_register_style('daex_style_uppy', 'https://releases.transloadit.com/uppy/v3.3.0/uppy.min.css');
  wp_register_style('daex_style_dataexp', 'https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience@'
                      .$dataexp_version.'/dist/DataExperience.css');
}
add_action('wp_enqueue_scripts', 'func_load_styles');

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

  wp_enqueue_style('daex_font_roboto');
  wp_enqueue_style('daex_font_icons');
  wp_enqueue_style('daex_style_vuetify');
  wp_enqueue_style('daex_style_uppy');
  wp_enqueue_style('daex_style_dataexp');

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
