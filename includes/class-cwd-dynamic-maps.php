<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 * @author     Aidan Campbell <aidancalebcampbell@gmail.com>
 */
class Cwd_Dynamic_Maps {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Cwd_Dynamic_Maps_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'cwd_dynamic_maps_version' ) ) {
			$this->version = cwd_dynamic_maps_version;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'cwd-dynamic-maps';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Cwd_Dynamic_Maps_Loader. Orchestrates the hooks of the plugin.
	 * - Cwd_Dynamic_Maps_i18n. Defines internationalization functionality.
	 * - Cwd_Dynamic_Maps_Admin. Defines all hooks for the admin area.
	 * - Cwd_Dynamic_Maps_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cwd-dynamic-maps-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cwd-dynamic-maps-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-cwd-dynamic-maps-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-cwd-dynamic-maps-public.php';



		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-cwd-dynamic-maps-table.php';




		$this->loader = new Cwd_Dynamic_Maps_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Cwd_Dynamic_Maps_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Cwd_Dynamic_Maps_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Cwd_Dynamic_Maps_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'create_admin_menu' );
		$this->loader->add_filter( "plugin_action_links_$this->plugin_name/$this->plugin_name.php", $plugin_admin, 'create_action_links');
		$this->loader->add_action( 'wp_ajax_cwd_request', $plugin_admin, 'cwd_ajax_handler' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'register_admin_settings' );


		//$this->loader->add_action( 'admin_init', $plugin_admin, 'download_csv' );
		//$this->loader->add_action( 'admin_init', new Cwd_Dynamic_Maps_Marker_Table(), 'export_markers' );

		

		/*
		$this->loader->add_action( 'admin_init', 'Cwd_Dynamic_Maps_Marker_Table', 'export_markers' );
		$this->loader->add_action( 'admin_init', 'Cwd_Dynamic_Maps_Marker_Table', 'import_markers' );
		$this->loader->add_action( 'admin_init', 'Cwd_Dynamic_Maps_Map_Table', 'export_maps' );
		$this->loader->add_action( 'admin_init', 'Cwd_Dynamic_Maps_Map_Table', 'import_maps' );
		*/
		

		// !!!! THESE SHOULD BE AJAXified !!!!
		$marker_table_admin = new Cwd_Dynamic_Maps_Marker_Table(1);
		$map_table_admin = new Cwd_Dynamic_Maps_Map_Table();

		$this->loader->add_action( 'admin_init', $marker_table_admin, 'export_markers' );
		$this->loader->add_action( 'admin_init', $marker_table_admin, 'import_markers' );
		$this->loader->add_action( 'admin_init', $map_table_admin, 'export_maps' );
		$this->loader->add_action( 'admin_init', $map_table_admin, 'import_maps' );

		// moved cwd_settings_update to branch from ajax call
		//$this->loader->add_action( 'admin_init', 'Cwd_Dynamic_Maps_Marker_Table', 'cwd_settings_update');


	}

   


	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Cwd_Dynamic_Maps_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		
		$this->loader->add_action( 'init', $plugin_public, 'register_shortcodes' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Cwd_Dynamic_Maps_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
