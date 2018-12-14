<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/public
 * @author     Aidan Campbell <aidancalebcampbell@gmail.com>
 */
class Cwd_Dynamic_Maps_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/cwd-dynamic-maps-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/cwd-dynamic-maps-public.js', array( 'jquery' ), $this->version, false );

		// Pass PHP to admin JS
			// Api Key
			wp_localize_script( $this->plugin_name /*.'-public-js'*/, 'cwd_api_key', get_option('cwd_dynamic_maps_option_api_key') );

	}

	/*
	 * Register all Shortcode callback functions
	 */
	public function register_shortcodes() {
		add_shortcode('cwdmaps', array($this, 'cwd_shortcode_callback') );

	}

	public function cwd_shortcode_callback($atts) {
		$a = shortcode_atts( array(
			'map' => 'the map',
			'markers' => 'some markers'
			), $atts);

		return "<div id='cwd-map-wrap-frontend'></div>" . ob_get_clean() ;
	}

}
