<?php

/**
 * Fired during plugin activation
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 * @author     Aidan Campbell <aidancalebcampbell@gmail.com>
 */
class Cwd_Dynamic_Maps_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		update_option( 'CWD_DYNAMIC_MAPS_VERSION', CWD_DYNAMIC_MAPS_VERSION);
		Cwd_Dynamic_Maps_Marker_Table::create_table();
		Cwd_Dynamic_Maps_Map_Table::create_table();
		flush_rewrite_rules();

	}



}
