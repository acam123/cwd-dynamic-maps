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

		// Conditionally load scripts if page base matches one from this plugin's pages list 
		if ( (get_current_screen()->base == 'cwd-maps-settings_page_cwd_maps_markers_edit') | 
			 (get_current_screen()->base == 'cwd-maps-settings_page_cwd_maps_maps_edit') | 
			 (get_current_screen()->base == 'cwd-maps-settings_page_cwd_maps_groups_edit') |
			 (get_current_screen()->base == 'toplevel_page_cwd_maps_settings') ) {


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

				// Marker Table Data
				$maps = new Cwd_Dynamic_Maps_Map_Table();
				if (isset($_SESSION['cwd-dynamic-maps-group-selection'])) {
					// Selected Marker Group ID
					wp_localize_script( $this->plugin_name.'-admin-js', 'marker_selected_group_id', $_SESSION['cwd-dynamic-maps-group-selection'] );

					$markers = new Cwd_Dynamic_Maps_Marker_Table($_SESSION['cwd-dynamic-maps-group-selection']);

					// Marker Data Cols
					$marker_col_types =  ($markers->get_data_types() == null) ? wp_json_encode(array()) : stripslashes(wp_json_encode($markers->get_data_types()));

					wp_localize_script( $this->plugin_name.'-admin-js', 'marker_col_types', $marker_col_types );

					// Marker Data
					wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_php_vars', stripslashes(wp_json_encode($markers->get_table_data_by_cols($markers->get_table_cols_clean_3() ))) ); 
				}

				if (isset($_SESSION['cwd-dynamic-maps-map-selection'])) {
					// Selected Map ID
					wp_localize_script( $this->plugin_name.'-admin-js', 'marker_selected_map_id', $_SESSION['cwd-dynamic-maps-map-selection'] );
				}

				//wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_php_vars', stripslashes(wp_json_encode(Cwd_Dynamic_Maps_Marker_Table::get_table_data_by_cols(Cwd_Dynamic_Maps_Marker_Table::get_table_cols_clean_3() ))) ); 

				// Api Key
				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_api_key', get_option('cwd_dynamic_maps_option_api_key') );

				// Map Table Data
				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_map_data', stripslashes(wp_json_encode($maps->get_table_data() )) );

				// Visible Columns
				$visible_cols = get_option('cwd_dynamic_maps_visible_cols');
				$visible_cols = ( empty($visible_cols) ? null :  $visible_cols );

				// Infowindow Display
				$infowindow_display = get_option('cwd_dynamic_maps_display_infowindow');
				$infowindow_display = ( empty($infowindow_display) ? null : array_map('stripslashes', $infowindow_display) );

				// Cluster Display
				$cluster_display = get_option('cwd_dynamic_maps_display_cluster');
				$cluster_display = ( empty($cluster_display) ? null : array_map('stripslashes', $cluster_display) );

				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_visible_cols', $visible_cols );

				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_infowindow_display', $infowindow_display );

				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_cluster_display', $cluster_display);

				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_plugins_url', plugins_url() );

				wp_localize_script( $this->plugin_name.'-admin-js', 'cwd_base_url', get_site_url() );

		}


	}

    function create_admin_menu() {
        add_menu_page( 'CWD Maps Settings Page', 'CWD Maps Settings', 'manage_options', 'cwd_maps_settings', array( $this, 'create_settings_page' ), 'dashicons-layout', 70 );
        add_submenu_page( 'cwd_maps_settings', 'Settings Page', 'Settings', 'manage_options', 'cwd_maps_settings', array( $this, 'create_settings_page' ) );
        add_submenu_page( 'cwd_maps_settings', 'Markers Page', 'Markers', 'manage_options', 'cwd_maps_markers_edit', array( $this, 'create_markers_page' ) );
        add_submenu_page( 'cwd_maps_settings', 'Groups Page', 'Groups', 'manage_options', 'cwd_maps_groups_edit', array( $this, 'create_groups_page' ) );
        add_submenu_page( 'cwd_maps_settings', 'Maps Page', 'Maps', 'manage_options', 'cwd_maps_maps_edit', array( $this, 'create_maps_page' ) );
    }

    function create_settings_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-settings-page.php';
    }

    function create_markers_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-markers-page.php';
    }

    function create_groups_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-groups-page.php';
    }

    function create_maps_page() {
    	include_once CWD_DYNAMIC_MAPS_PLUGIN_DIR.'/admin/partials/cwd-dynamic-maps-maps-page.php';
    }

    // Add Links to Plugin Listing on the Plugins Page
    function create_action_links( $links ) {
		$new_links = ['<a href="admin.php?page=cwd_maps_settings">Settings</a>', 
					  '<a href="admin.php?page=cwd_maps_markers_edit">Markers</a>',
					  '<a href="admin.php?page=cwd_maps_groups_edit">Groups</a>',
					  '<a href="admin.php?page=cwd_maps_maps_edit">Maps</a>'
					  ];
		foreach ($new_links as $new_link) {
			array_push( $links, $new_link );
		}
		return $links;
	}

	// Add Ajax Handler 
	function cwd_ajax_handler() {
		$param = isset($_REQUEST['param']) ? $_REQUEST['param'] : "";

		if (!empty($param) && $param == "update_marker") {
			//print_r($_REQUEST);
			$args=$_REQUEST;
			$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($_SESSION['cwd-dynamic-maps-group-selection']);
			$response = $marker_obj->update_marker($args);

			if($response === false) {
				$response = 'Error: Marker update failed';
			}
			else {
				$response = (string)$response . ' marker(s) successfully updated';
			}
		}

		else if (!empty($param) && $param == "update_map") {
			$args=$_REQUEST;
			$map_obj = new Cwd_Dynamic_Maps_Map_Table();
			$response = $map_obj->update_map($args);

			if($response === false) {
				$response = 'Error: Map update failed';
			}
			else {
				$response = (string)$response . ' map(s) successfully updated';
			}
		}

		else if (!empty($param) && $param == "update_marker_cols") {
			$args=$_REQUEST;
			$group_number = $args['group_number'];
			$group_name = str_replace(' ', '_', $args['group_name']);
			$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($group_number);
			$response;

			if (empty($group_number)) {
				$group_number = $marker_obj->create_table($group_name);
				$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($group_number);
				$response = 'Marker Group '.$group_number. ' Created Successfully'; 
				$args['group_number'] = $group_number;
			}
			else if ( $group_name != ($marker_obj->get_group_name()) ) {
				$marker_obj->rename_group($group_name);
			}

			
			/*
			* TO DO: seperate isVisible cols, update wp_option, 
			*        send rest of args to be updated in table,
			*        renamed & deleted cols in table php applied 
			*        to isVisible wp_option
			*        NOTE: set up isVisible on table creation 
			*/


			//$args=$_REQUEST;

		/*	$response .= ' GROUP_NUM:'.$group_number; //***

			//$edit = $args['cwd_dynamic_maps_visible_cols'];
			$visible = get_option('cwd_dynamic_maps_display_cluster');
			$visible = ( empty($visible) ? array() : array_map('stripslashes', $visible) );
			$group = array_keys($edit)[0];
			$visible[$group] = $edit[$group];

			$response .= ' EDIT:'.$edit;

			$response .= ' GROUP:'. $group;

			$response .= update_option('cwd_dynamic_maps_visible_cols', $visible );
			//$response = ($response === true ? 'Cluster Display was Successfully Updated for Group: '.$group : 'No Update Made for Cluster Display Group: '.$group); 
		*/


			$response .= "\n".$marker_obj->update_marker_cols($args);
			if($response === false) {
				$response = 'Error: Marker columns update failed';
			}
			else {
				//$response = $response . ' Marker columns successfully updated';
			}
		}
		
		else if (!empty($param) && $param == "select_group") {
			$args=$_REQUEST;
			$group_number = $args['group_number'];
			$this_marker_obj = new Cwd_Dynamic_Maps_Marker_Table($group_number);
			$col_options = $this_marker_obj->get_table_cols_clean_2();
			$data_types = $this_marker_obj->get_data_types();
			$response = '';

			$visible_cols = get_option('cwd_dynamic_maps_visible_cols');

			//$visible_cols = ( empty($visible_cols) ? null : stripslashes(json_encode($visible_cols[$group_number]['unchecked'])) );

			// REMOVE LINE BELOW
			//$response .= '<tr><td>'.'VISIBLE'.gettype($visible_cols).$visible_cols.'</td></tr>';
			//$response .= '<tr><td>'.'VISIBLE'.$group_number.gettype($visible_cols['2']).$visible_cols['2'].'</td></tr>';

			


			foreach ($col_options as $key => $val) {
				$response .= '<tr class="cwd_form_group_marker_cols_row">
					<td></td>
					<td>
						<input type="checkbox" name="cwd_group_form_data_visible_curr_cols_'.esc_attr($val).'" style="vertical-align:text-top; margin:0px 20px 0px auto;" '.($visible_cols[$group_number][$val] === 'on' ? 'checked=checked' : null).'/><input type="text" class="regular-text" name="cwd_group_form_data_curr_cols_'.esc_attr($val).'" value="'. str_replace('_', ' ', esc_attr($val)).'" />

						<input type="button" class="cwd_options_remove_table_col_button button button-secondary" value="Delete"/> 
						<span>'. $data_types[$key]->COLUMN_COMMENT.'</span>
					</td>
				</tr>';
			}
		}

		else if (!empty($param) && $param == "marker_select_map") {
			$args=$_REQUEST;
			$map_id=$args['map_selected'];  
			$_SESSION['cwd-dynamic-maps-map-selection'] = $map_id;
			$response = $_SESSION['cwd-dynamic-maps-map-selection'];
		}

		else if (!empty($param) && $param == "marker_select_group") {
			$args=$_REQUEST;
			$group_selected = $args['group_selected'];
			$_SESSION['cwd-dynamic-maps-group-selection'] = $group_selected;
			$response = $_SESSION['cwd-dynamic-maps-group-selection'];
		}

		else if (!empty($param) && $param == "update_cluster_display") {
			$args=$_REQUEST;
			$edit = $args['cwd_dynamic_maps_display_cluster'];
			$infowindow = get_option('cwd_dynamic_maps_display_cluster');
			$infowindow = ( empty($infowindow) ? array() : array_map('stripslashes', $infowindow) );
			$group = array_keys($edit)[0];
			$infowindow[$group] = $edit[$group];
			$response = update_option('cwd_dynamic_maps_display_cluster', $infowindow );
			$response = ($response === true ? 'Cluster Display was Successfully Updated for Group: '.$group : 'No Update Made for Cluster Display Group: '.$group); 

		}
		else if (!empty($param) && $param == "update_infowindow") {
			$args=$_REQUEST;
			$edit = $args['cwd_dynamic_maps_display_infowindow'];
			
			$infowindow = get_option('cwd_dynamic_maps_display_infowindow');
			$infowindow = ( empty($infowindow) ? array() : array_map('stripslashes', $infowindow) ); 

			$group = array_keys($edit)[0];
			$infowindow[$group] = $edit[$group];

			$response = update_option('cwd_dynamic_maps_display_infowindow', $infowindow );
			$response = ($response === true ? 'Infowindow Display was Successfully Updated for Group: '.$group : 'No Update Made for Infowindow Display Group: '.$group); 
		}

		else if ( !empty($param) && $param == "delete_marker" ) {
			$args=$_REQUEST;
			$del_id = $args['marker_id'];

			$group_id = $_SESSION['cwd-dynamic-maps-group-selection'];

			$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($group_id);
			$response = $marker_obj->delete_table_row($del_id);

			$response = ($response == false ? 'An error occoured - No deletion was made' : $response . ' row(s) deleted');

		}
		else if (!empty($param) && $param == "delete_group") {
			$args=$_REQUEST;
			$grp_num = $args['group_number'];

			$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($grp_num);
			$response = $marker_obj->delete_table();

			// !!!START DROP INFOWINDOW DATA!!!
			$infowindow = get_option('cwd_dynamic_maps_display_infowindow');
			$infowindow = ( empty($infowindow) ? array() : array_map('stripslashes', $infowindow) ); 
			unset($infowindow[$grp_num]);
			//$response = $infowindow; 
			update_option('cwd_dynamic_maps_display_infowindow', $infowindow );
			// !!!END DROP INFOWINDOW DATA!!!

			$response = ($response === true ? 'The group was successfully deleted' : 'The group could not be deleted');
		}
		else if (!empty($param) && $param == "delete_map") {
			$args=$_REQUEST;
			$map_id = $args['map_id'];

			$map_obj = new Cwd_Dynamic_Maps_Map_Table();
			$response = $map_obj->delete_table_row($map_id);

			$response = ($response == false ? 'An error occoured - No deletion was made' : $response . ' map(s) deleted');

		}
		
		else if (!empty($param) && $param == "import_markers_csv") {
			$args=$_REQUEST;
			$grp_num = $args['grp_num'];

			$markers = new Cwd_Dynamic_Maps_Marker_Table($grp_num);

			//$response = $_FILES;
			//$response = $markers->get_table_name(); 
			$response = $markers->import_markers_data();

			$response = ($response ? 'Marker Table Successfully Imported' : 'Marker Table Import Failed' );

		}

		else if (!empty($param) && $param == "export_markers_csv") {
			$args=$_REQUEST;
			$grp_num = $args['marker_export_group'];

			$marker_obj = new Cwd_Dynamic_Maps_Marker_Table($grp_num);
			$response = $marker_obj->export_markers_data();

		}
		else {
			$response = 'There was an error with your request';
		}

		print_r($response);
		wp_die();
	}

	// Register these Settings in the wp_options table
    function register_admin_settings() {
    	//register options to be filled out in plugin settings page on backend 
		register_setting( 'cwd_dynamic_maps_options', 'cwd_dynamic_maps_option_api_key' );

		register_setting( 'cwd_dynamic_maps_displays', 'cwd_dynamic_maps_visible_cols');
		register_setting( 'cwd_dynamic_maps_displays', 'cwd_dynamic_maps_display_infowindow');
		register_setting( 'cwd_dynamic_maps_displays', 'cwd_dynamic_maps_display_cluster');

	}


}
