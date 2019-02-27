<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * When populating this file, consider the following flow
 * of control:
 *
 * - This method should be static
 * - Check if the $_REQUEST content actually is the plugin name
 * - Run an admin referrer check to make sure it goes through authentication
 * - Verify the output of $_GET makes sense
 * - Repeat with other user roles. Best directly by using the links/query string parameters.
 * - Repeat things for multisite. Once for a single site in the network, once sitewide.
 *
 * This file may be updated more in future version of the Boilerplate; however, this is the
 * general skeleton and outline for how the file should work.
 *
 * For more information, see the following discussion:
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/pull/123#issuecomment-28541913
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option('CWD_DYNAMIC_MAPS_VERSION');

global $wpdb;
$table_name = $wpbd->prefix.'cwd_dynamic_maps_marker_data';
$table_names = ( (count($wpdb->get_var("Show tables like'".$table_name."%'")) > 0 ) ? $wpdb->get_var("Show tables like'".$table_name."%'"): array() );

foreach ($table_names as $table_name) {
	$wpdb->query("DROP table IF EXISTS $table_name");
}

$table_name = $wpbd->prefix.'cwd_dynamic_maps_map_data';
$wpdb->query("DROP table IF EXISTS $table_name");




