<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              aidan-campbell.com
 * @since             1.0.0
 * @package           Cwd_Dynamic_Maps
 *
 * @wordpress-plugin
 * Plugin Name:       CWD Dynamic Maps
 * Plugin URI:        aidan-campbell.com
 * Description:       This plugin can be used to create maps with marker objects that possess a variable number of data fields for a fully customizable .  
 * Version:           1.0.0
 * Author:            Aidan Campbell
 * Author URI:        aidan-campbell.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       cwd-dynamic-maps
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CWD_DYNAMIC_MAPS_VERSION', '1.0.0' );

if(!defined('CWD_DYNAMIC_MAPS_PLUGIN_DIR'))
	define('CWD_DYNAMIC_MAPS_PLUGIN_DIR', plugin_dir_path(__FILE__));
if(!defined('CWD_DYNAMIC_MAPS_PLUGIN_URL'))
	define('CWD_DYNAMIC_MAPS_PLUGIN_URL', plugins_url().'/cwd-dynamic-maps');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-cwd-dynamic-maps-activator.php
 */
function activate_cwd_dynamic_maps() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cwd-dynamic-maps-activator.php';
	Cwd_Dynamic_Maps_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-cwd-dynamic-maps-deactivator.php
 */
function deactivate_cwd_dynamic_maps() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cwd-dynamic-maps-deactivator.php';
	Cwd_Dynamic_Maps_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_cwd_dynamic_maps' );
register_deactivation_hook( __FILE__, 'deactivate_cwd_dynamic_maps' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-cwd-dynamic-maps.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_cwd_dynamic_maps() {

	$plugin = new Cwd_Dynamic_Maps();
	$plugin->run();

}
run_cwd_dynamic_maps();
