<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/admin
 * @author     Aidan Campbell <aidancalebcampbell@gmail.com>
 */
class Cwd_Dynamic_Maps_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Cwd_Dynamic_Maps_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Cwd_Dynamic_Maps_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/cwd-dynamic-maps-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Cwd_Dynamic_Maps_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Cwd_Dynamic_Maps_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// Enqueue main admin JS
		wp_enqueue_script( $this->plugin_name.'-admin-js', plugin_dir_url( __FILE__ ) . 'js/cwd-dynamic-maps-admin.js', array( 'jquery' ), $this->version, false );

		// Enqueue MAPS
			// Google Maps - NOTE: loading api may conflicts with themes/plugin so I include in necesarry javascript files
	/*
		wp_enqueue_script( $this->plugin_name.'-google-maps', 'https://maps.googleapis.com/maps/api/js?key='.get_option('cwd_dynamic_maps_option_api_key').'&language=en', array(), $this->version, true );
		}
	*/
			// Enqueue Marker Clusterer
			wp_enqueue_script( $this->plugin_name.'-marker-cluster', plugin_dir_url( __FILE__ ) . 'js/markerclusterer.js', array(), $this->version, true );


		// Pass PHP to admin JS
			// Ajax for sending data to PHP/database 
			wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_ajax_url', admin_url( 'admin-ajax.php' ) );

			// Table Data
			wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_php_vars', stripslashes(wp_json_encode(Cwd_Dynamic_Maps_Marker_Table::get_table_data_by_cols(Cwd_Dynamic_Maps_Marker_Table::get_table_cols_clean_3() ))) ); 
			// Api Key
			wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_api_key', get_option('cwd_dynamic_maps_option_api_key') );





	}

    function create_admin_menu() {
        add_menu_page( 'CWD Maps Settings Page', 'CWD Maps Settings', 'manage_options', 'cwd_maps_settings', array( $this, 'create_settings_page' ), 'dashicons-layout', 70 );
        add_submenu_page( 'cwd_maps_settings', 'Settings Page', 'Settings', 'manage_options', 'cwd_maps_settings', array( $this, 'create_settings_page' ) );
        add_submenu_page( 'cwd_maps_settings', 'Markers Page', 'Markers', 'manage_options', 'cwd_maps_markers_edit', array( $this, 'create_markers_page' ) );
        add_submenu_page( 'cwd_maps_settings', 'Maps Page', 'Maps', 'manage_options', 'cwd_maps_maps_edit', array( $this, 'create_maps_page' ) );
    }

    function create_settings_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-settings-page.php';
    }

    function create_markers_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-markers-page.php';
    }

    function create_maps_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-maps-page.php';
    }

    // Add Links to Plugin Listing on the Plugins Page
    function create_action_links( $links ) {
		$new_links = ['<a href="admin.php?page=cwd_maps_settings">Settings</a>', 
					  '<a href="admin.php?page=cwd_maps_markers_edit">Markers</a>', 
					  '<a href="admin.php?page=cwd_maps_maps_edit">Maps</a>'
					  ];
		foreach ($new_links as $new_link) {
			array_push( $links, $new_link );
		}
		return $links;
	}

	// Add Ajax Handler 
	// ***??? Can we make this a wrapper and move the code to ...Table::...()
	function cwd_ajax_handler() {
		$param = isset($_REQUEST['param']) ? $_REQUEST['param'] : "";
		if (!empty($param) && $param == "update_marker") {
			//print_r($_REQUEST);
			$args=$_REQUEST;
			$response = Cwd_Dynamic_Maps_Marker_Table::update_marker($args);

			if($response === false) {
				$response = 'Error: Marker Update failed';
			}
			else {
				$response = (string)$response . ' marker(s) successfully updated';
			}
		}
		else {
			$response = 'Error: Marker Update was unable to be completed';
		}

		print_r($response);
		wp_die();
	}

	// Register these Settings in the wp_options table
    function register_admin_settings() {
    	//register options to be filled out in plugin settings page on backend 
		register_setting( 'cwd_dynamic_maps_options', 'cwd_dynamic_maps_option_api_key' );

	}


}
