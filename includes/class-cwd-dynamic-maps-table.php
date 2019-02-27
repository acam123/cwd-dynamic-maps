<?php

/**
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 */

/**
 *
 * This class defines all code necessary to manipulate the table data.
 * @since      1.0.0
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/includes
 * @author     Aidan Campbell <aidancalebcampbell@gmail.com>
 */

class Cwd_Dynamic_Maps_Map_Table {

	public function get_table_name() {
		global $wpdb;

		return $wpdb->prefix.'cwd_dynamic_maps_map_data';
	}//End get_table_name()

	public function get_table_header() {
		global $wpdb;

		$table_name = $this->get_table_name();
		$cols = $wpdb->get_col("DESC {$table_name}", 0);
		return $cols;
	}//End get_table_header()

	public function get_table_data_by_cols($cols) {
		global $wpdb;
		$table_name = $this->get_table_name();

		$cols = implode(',', $cols);
		$table = (
			$wpdb->get_results( "SELECT $cols from $table_name Order by id desc")
		);

		return $table;
	}//End get_table_data_by_cols()

	public function get_table_data() {
		$cols = array ('*');
		return $this->get_table_data_by_cols($cols);
	}//End get_table_data()	

	// *** What columns do i need??? ***
	public function create_table() {
		global $wpdb;
		$table_name = $this->get_table_name();
		if ( count($wpdb->get_var("Show tables like'".$table_name."'")) == 0) {
			$sql = "CREATE TABLE $table_name (
				id mediumint(9) NOT NULL AUTO_INCREMENT,
				time datetime DEFAULT '1000-01-01 00:00:00',
				mapName varchar(255),
				zoom int,
				minZoom int,
				maxZoom int,
				centerLat float(10,6),
				centerLng float(10,6),
				mapTypeId varchar(255), 
				tilt int,
				heading int,
				northBound float(10,6), 
				eastBound float(10,6),
				southBound float(10,6),
				westBound float(10,6),
				polyline varchar(2048), 
				UNIQUE KEY id (id)
			)";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );
		}
	}//End create_table()

	public function delete_table_row($id) {
		$table_name = $this->get_table_name();
		$wpdb->delete( $table_name, array('id' => $id) );
	}//End delete_table_row()

	public function update_map($args) {
		global $wpdb;

		$table_name = $this->get_table_name();

		$data_row = $args;
		unset($data_row['action']);
		unset($data_row['param']);
		$data_row['mapName'] = str_replace(' ', '_', $data_row['mapName']);
		$data_row['time'] = current_time('mysql'); 

		$id = $args['id']; 
		if ( count($wpdb->get_var("SELECT * from $table_name  WHERE id = '$id'")) == 1 ) {
			$result = $wpdb->update( 
				$table_name, 
				$data_row,
				array(
					'id' => $id,
				) 
			);
		}
		else {
			//unset($data_row['id'])
			$result = $wpdb->insert( 
				$table_name,
				$data_row
			);
		}
		return $result;
	}//End update_map

	//Registered on admin_init  
	public function export_maps() {
		if (isset($_POST['cwd_download_maps_csv'])) {
			global $wpdb;
			$table_name = $this->get_table_name();
	    	$sql = "SELECT * FROM $table_name";
	    	$rows = $wpdb->get_results($sql, 'ARRAY_A');

	    	if ($rows) {
		        $output_filename = 'cwd_dynamic_maps_map_data_' .date('m-d-Y'). '.csv';
		        $output_handle = @fopen('php://output', 'w');

		        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		        header('Content-Description: File Transfer');
		        header('Content-type: text/csv');
		        header('Content-Disposition: attachment; filename=' . 
		        $output_filename);
		        header('Expires: 0');
		        header('Pragma: public');

		        $first = true;
		       // Parse results to csv format
		        foreach ($rows as $row) {

		       // Add table headers
		            if ($first) {
		               $titles = array();
		                foreach ($row as $key => $val) {
		                    $titles[] = $key;
		                }
		                fputcsv($output_handle, $titles);
		                $first = false;
		            }

		            $leadArray = (array) $row; // Cast the Object to an array

		            // Add row to file
		            fputcsv($output_handle, $leadArray, $delimiter = ',', $enclosure = '\'',  $escape_char="\\");
		            //fputcsv($output_handle, $leadArray);
		        }
		        // Close output file stream
		        fclose($output_handle);
		        //wp_die();
		        exit();
			}
		}
	}//End export_markers()

	//Registered on admin_init  
	public function import_maps() {
		if(isset($_POST['upload_maps_csv'])) {
            $filename = $_FILES['file']['tmp_name'];

            if($_FILES["file"]["size"] > 0)
			 {

			 	/* !!!IMPORTANT: Check the file cols against the database if they exist!!! */

			 	//$table_cols = json_decode(get_option('cwd_dynamic_maps_option_marker_attributes'), true);
			 	//$table_cols = array_values($table_cols);
			 	

				$x = 0;
				$file_cols = array();

			  	$file = fopen($filename, "r");
		        while ( ($getData = fgetcsv($file, 10000, $delimiter = ',', $enclosure = "'",  $escape_char="\\")) !== FALSE )
		         {
		         	//Get args dynamocally from table if exists, settings, or file 
		         	/*$args['id'] = $getData[0];
		         	$args['time'] = $getData[1];
		         	$args['first_name'] = $getData[2];
		         	$args['middle_names'] = $getData[3];
		         	$args['last_name'] = $getData[4];
		         	$args['born'] = $getData[5];
		         	$args['died'] = $getData[6];
		         	$args['latitude'] = $getData[7];
		         	$args['longitude'] = $getData[8];
		         	$args['description'] = $getData[9];
		         	$args['action'] = '';
		         	$args['param'] = '';*/


		         	//echo json_encode($args);

		         	//Better was to check for column headers
		         	if ($x>0) { 
	 					for ($i=0; $i < sizeof($file_cols); $i++) {
		         			$args[$file_cols[$i]] = $getData[$i];
		         		}
		         		$response = $this->update_map($args);

	 				}
	 				else {
	 					$more = true;
	 					$y=0;
	 					while($more) {
	 						if(isset($getData[$y])) {
	 							$file_cols[] = $getData[$y];
	 							$y++;
	 						}
	 						else {
	 							$more = false;
	 						}
	 					}

	 				}
	 				$x++;

		           /*
		           $sql = "INSERT into $table_name (id,time,first_name,middle_names,last_name,born,died,latitude,longitude,description) 
	                   values ('".$getData[0]."','".$getData[1]."','".$getData[2]."','".$getData[3]."','".$getData[4]."','".$getData[5]."','".$getData[6]."','".$getData[7]."','".$getData[8]."','".$getData[9]."')";
	                   $result = mysqli_query($con, $sql);
					if(!isset($result))
					{
						echo "<script type=\"text/javascript\">
								alert(\"Invalid File:Please Upload CSV File.\");
								window.location = \"index.php\"
							  </script>";		
					}
					else {
						  echo "<script type=\"text/javascript\">
							alert(\"CSV File has been successfully Imported.\");
							window.location = \"index.php\"
						</script>";
					}
					*/
		         }
				
		         fclose($file);	
			 }
        }
	}//End import_maps()

}// End class Cwd_Dynamic_Maps_Map_Table



/*
// THIS IS THE STATIC VERSION
class Cwd_Dynamic_Maps_Marker_Table {
	
	public static function get_table_name($args) {
		global $wpdb;

		$table_name_main = 'cwd_dynamic_maps_marker_data';
		return $wpdb->prefix.$table_name_main;
	}//End get_table_name()

	public static function get_table_header() {
		global $wpdb;

		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		$cols = $wpdb->get_col("DESC {$table_name}", 0);
		return $cols;
	}//End get_table_header()

	public static function get_table_header_clean() {
		$cols = Cwd_Dynamic_Maps_Marker_Table::get_table_header();
		$cols = array_values(array_diff($cols, ['id', 'time']));
		return $cols;
	}//End get_table_header_clean()

	public static function get_table_cols_clean_2() {
		$cols = Cwd_Dynamic_Maps_Marker_Table::get_table_header();
		$cols = array_diff($cols, ['id', 'time', 'latitude', 'longitude']);
		return $cols;
	}//End get_table_cols_clean_2()	

	public static function get_table_cols_clean_3() {
		$cols = Cwd_Dynamic_Maps_Marker_Table::get_table_header();
		$cols = array_diff($cols, ['time']);
		return $cols;
	}//End get_table_cols_clean_3()

	public static function get_table_data_by_cols($cols) {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		$tmp;
		$table;

		$cols = implode(',', $cols);
		$table = (
			$wpdb->get_results( "SELECT $cols from $table_name Order by id desc")
		);

		return $table;
	}//End get_table_data_by_cols()

	public static function get_data_types() {
		global $wpdb;

		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		$sql = "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$table_name'";
		$res = $wpdb->get_results($sql);
		
		return $res;
	}//End get_information_schema()

	public static function get_table_data() {
		$cols = array ('*');
		return Cwd_Dynamic_Maps_Marker_Table::get_table_data_by_cols($cols);
	}//End get_table_data()

	public static function create_table() {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		if ( count($wpdb->get_var("Show tables like'".$table_name."'")) == 0) {
			$sql = "CREATE TABLE $table_name (
				id mediumint(9) NOT NULL AUTO_INCREMENT,
				time datetime DEFAULT '1000-01-01 00:00:00',
				latitude float(10,6),
				longitude float(10,6),
				UNIQUE KEY id (id)
			)";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
		}
	}//End create_table()

	// NOTE: functions defined elsewhere in the plugin cannot be called on uninstall 
	// therefore a modified version of delete_table() has been included in uninstall.php
	//
	public static function delete_table() {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		$wpdb->query("DROP table IF EXISTS $table_name");

	}//End delete_table()

	public static function delete_table_row($id) {
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
		$wpdb->delete( $table_name, array('id' => $id) );
	}//End delete_table_row() 

	public static function import_markers() {

		 if(isset($_POST['upload_csv'])) {
            $filename = $_FILES['file']['tmp_name'];

            if($_FILES["file"]["size"] > 0)
			 {


			 	//$table_cols = json_decode(get_option('cwd_dynamic_maps_option_marker_attributes'), true);
			 	//$table_cols = array_values($table_cols);
			 	

				$x = 0;
				$file_cols = array();

			  	$file = fopen($filename, "r");
		        while (($getData = fgetcsv($file, 10000, ",")) !== FALSE)
		         {
		         	//Get args dynamocally from table if exists, settings, or file 

		         	//echo json_encode($args);

		         	//Better was to check for column headers
		         	if ($x>0) { 
	 					for ($i=0; $i < sizeof($file_cols); $i++) {
		         			$args[$file_cols[$i]] = $getData[$i];
		         		}
		         		$response = Cwd_Dynamic_Maps_Marker_Table::update_marker($args);

	 				}
	 				else {
	 					$more = true;
	 					$y=0;
	 					while($more) {
	 						if(isset($getData[$y])) {
	 							$file_cols[] = $getData[$y];
	 							$y++;
	 						}
	 						else {
	 							$more = false;
	 						}
	 					}

	 				}
	 				$x++;

		         }
				
		         fclose($file);	
			 }
 
 
        }

	}//End import_markers

	//Registered on admin_init  
	public static function export_markers() {
		if (isset($_POST['download_csv'])) {
			global $wpdb;
			$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();
	    	$sql = "SELECT * FROM $table_name";
	    	$rows = $wpdb->get_results($sql, 'ARRAY_A');

	    	if ($rows) {
		        $output_filename = 'cwd_dynamic_maps_marker_data_' .date('m-d-Y'). '.csv';
		        $output_handle = @fopen('php://output', 'w');

		        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		        header('Content-Description: File Transfer');
		        header('Content-type: text/csv');
		        header('Content-Disposition: attachment; filename=' . 
		        $output_filename);
		        header('Expires: 0');
		        header('Pragma: public');

		        $first = true;
		       // Parse results to csv format
		        foreach ($rows as $row) {

		       // Add table headers
		            if ($first) {
		               $titles = array();
		                foreach ($row as $key => $val) {
		                    $titles[] = $key;
		                }
		                fputcsv($output_handle, $titles);
		                $first = false;
		            }
		            $leadArray = (array) $row; // Cast the Object to an array
		            // Add row to file
		            fputcsv($output_handle, $leadArray);
		        }
		        // Close output file stream
		        fclose($output_handle);
		        //wp_die();
		        exit();
			}
		}
	}//End export_markers()

	public static function update_marker($args) {
		global $wpdb;

		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();

		unset($args['action']);
		unset($args['param']);
		$data_row = $args;
		$data_row['time'] = current_time('mysql'); 

		$id = $args['id']; 
		if ($id == '') {
			$result = $wpdb->insert( 
				$table_name,
				$data_row
			);
		}
		else {
			$result = $wpdb->update( 
				$table_name, 
				$data_row,
				array(
					'id' => $id,
				) 
			);

		}
		return $result;
	}//End update_markers()


	public static function add_table_cols($arr) {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();

		foreach ($arr as $col) {
			$sql = "ALTER table $table_name ADD $col varchar(255) DEFAULT ''";
			$wpdb->query($sql);
		}
	}

	public static function rename_table_cols($arr) {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();

		foreach ($arr as $key => $val) {
			if ($key != $val ) {
				$sql = "ALTER table $table_name Change COLUMN $key $val varchar(255) DEFAULT ''"; 
				$wpdb->query($sql);
			}
		}
	}//End rename_table_cols()

	public static function delete_table_cols($arr) {
		global $wpdb;
		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name();

		foreach ($arr as $key => $val) {
				$sql="ALTER Table $table_name DROP COLUMN $val";
				$wpdb->query($sql);
		}
	}//End delete_table_cols()



	public static function update_marker_cols($args) {
	    	$add_arr = array();
	    	$add_cols_match = false;
	    	$del_arr = array();
	    	$del_cols_match = false;
	    	$rn_arr = array();
	    	$rn_cols_match = false;
	    
	    	foreach( $args as $key => $value ) {
	    		if(preg_match('/^cwd_form_data_add_cols_[0-9]+$/', $key)) {
	    			$add_arr[$key] = str_replace(' ', '_', $value);
	    			$add_cols_match = true;	
	    		}

	    		else if(preg_match('/^cwd_form_data_delete_cols_[a-zA-Z0-9_]+$/', $key)) {
	    			$del_arr[$key] = str_replace(' ', '_', $value);
	    			$del_cols_match = true;	
	    		}

	    		else if(preg_match('/^cwd_form_data_curr_cols_[a-zA-Z0-9_]+$/', $key)) {
	    			$key = substr($key, 24); // remove 24 characters to get the name
	    			$rn_arr[$key] = str_replace(' ', '_', $value);
	    			$rn_cols_match = true;	
	    		}

	    		else {}
	    		
	    	}

	    	//print_r(json_encode($map_settings));


	    	if ($add_cols_match === true) { 
	    		Cwd_Dynamic_Maps_Marker_Table::add_table_cols($add_arr);
	    	}

	    	if ($del_cols_match === true) { 
	    		Cwd_Dynamic_Maps_Marker_Table::delete_table_cols($del_arr);
	    	}

	    	if ($rn_cols_match == true) {
	    		Cwd_Dynamic_Maps_Marker_Table::rename_table_cols($rn_arr);
	    	}
		return $result;
	}//End update_marker_cols()

}//End class Cwd_Dynamic_Maps_Marker_Table STATIC VERSION
*/

class Cwd_Dynamic_Maps_Marker_Table {
	/**
	 * The type of this table.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      int    $marker_group;   Which marker group to use.
	 */
	private $marker_group;

	public function __construct($marker_group = 'none') {
        $this->marker_group = $marker_group;
    }

	public function get_table_name() {
		global $wpdb;
		$table_name = $wpdb->prefix.'cwd_dynamic_maps_marker_data_'.$this->marker_group;

		return ( (count($wpdb->get_var("Show tables like'".$table_name."_%'")) === 1) ? $wpdb->get_var("Show tables like'".$table_name."_%'"): null );
	}//End get_table_name()

	public function get_table_header() {
		global $wpdb;

		$table_name = $this->get_table_name();
		return ( ($table_name === null) ? array() : ($wpdb->get_col("DESC {$table_name}", 0)) );
	}//End get_table_header()

	public function get_table_header_clean() {
		$cols = $this->get_table_header();
		$cols = array_values(array_diff($cols, ['id', 'time']));
		return $cols;
	}//End get_table_header_clean()

	public function get_table_cols_clean_2() {
		$cols = $this->get_table_header();
		$cols = array_diff($cols, ['id', 'time', 'latitude', 'longitude']);
		return $cols;
	}//End get_table_cols_clean_2()	

	public function get_table_cols_clean_3() {
		$cols = $this->get_table_header();
		$cols = array_diff($cols, ['time']);
		return $cols;
	}//End get_table_cols_clean_3()

	public function get_table_header_sans($cols) {
		return array_diff($this->get_table_header(), $cols);
	}

	public function get_table_data_by_cols($cols) {
		global $wpdb;
		$table_name = $this->get_table_name();
		$tmp;
		$table;

		$cols = implode(',', $cols);
		$table = (
			$wpdb->get_results( "SELECT $cols from $table_name Order by id desc")
		);

		return $table;
	}//End get_table_data_by_cols()

	public function get_data_types() {
		global $wpdb;

		$table_name = $this->get_table_name();
		$sql = "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '$table_name'";

		return $wpdb->get_results($sql);
	}//End get_information_schema()

	public function get_table_data() {
		$cols = array ('*');
		return $this->get_table_data_by_cols($cols);
	}//End get_table_data()

	public function create_table() {
		global $wpdb;
		$table_name = $this->get_table_name();
		if ( count($wpdb->get_var("Show tables like'".$table_name."'")) === 0) {
			$sql = "CREATE TABLE $table_name (
				id mediumint(9) NOT NULL AUTO_INCREMENT,
				time datetime DEFAULT '1000-01-01 00:00:00',
				latitude float(10,6),
				longitude float(10,6),
				UNIQUE KEY id (id)
			)";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
		}
	}//End create_table()

	/* NOTE: functions defined elsewhere in the plugin cannot be called on uninstall 
	 * therefore a modified version of delete_table() has been included in uninstall.php
	 */
	public function delete_table() {
		global $wpdb;
		$table_name = $this->get_table_name();
		$wpdb->query("DROP table IF EXISTS $table_name");

	}//End delete_table()

	public function delete_table_row($id) {
		$table_name = $this->get_table_name();
		$wpdb->delete( $table_name, array('id' => $id) );
	}//End delete_table_row() 

	public function import_markers() {

		 if(isset($_POST['upload_csv'])) {
            $filename = $_FILES['file']['tmp_name'];

            if($_FILES["file"]["size"] > 0)
			 {

			 	// !!!IMPORTANT: Check the file cols against the database is they exist!!! 
			 	
				$x = 0;
				$file_cols = array();

			  	$file = fopen($filename, "r");
		        while (($getData = fgetcsv($file, 10000, ",")) !== FALSE)
		         {
		         	//Get args dynamocally from table if exists, settings, or file 
		         	/*$args['id'] = $getData[0];
		         	$args['time'] = $getData[1];
		         	$args['first_name'] = $getData[2];
		         	$args['middle_names'] = $getData[3];
		         	$args['last_name'] = $getData[4];
		         	$args['born'] = $getData[5];
		         	$args['died'] = $getData[6];
		         	$args['latitude'] = $getData[7];
		         	$args['longitude'] = $getData[8];
		         	$args['description'] = $getData[9];
		         	$args['action'] = '';
		         	$args['param'] = '';*/


		         	//echo json_encode($args);

		         	//Better was to check for column headers
		         	if ($x>0) { 
	 					for ($i=0; $i < sizeof($file_cols); $i++) {
		         			$args[$file_cols[$i]] = $getData[$i];
		         		}
		         		$response = $this->update_marker($args);
	 				}
	 				else {
	 					$more = true;
	 					$y=0;
	 					while($more) {
	 						if(isset($getData[$y])) {
	 							$file_cols[] = $getData[$y];
	 							$y++;
	 						}
	 						else {
	 							$more = false;
	 						}
	 					}
	 				}
	 				$x++;
		         }
		         fclose($file);	
			 }
        }
	}//End import_markers

	//Registered on admin_init  
	public function export_markers() {
		if (isset($_POST['download_csv'])) {
			global $wpdb;
			$table_name = $this->get_table_name();
	    	$sql = "SELECT * FROM $table_name";
	    	$rows = $wpdb->get_results($sql, 'ARRAY_A');

	    	if ($rows) {
		        $output_filename = 'cwd_dynamic_maps_marker_data_' .date('m-d-Y'). '.csv';
		        $output_handle = @fopen('php://output', 'w');

		        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		        header('Content-Description: File Transfer');
		        header('Content-type: text/csv');
		        header('Content-Disposition: attachment; filename=' . 
		        $output_filename);
		        header('Expires: 0');
		        header('Pragma: public');

		        $first = true;
		       // Parse results to csv format
		        foreach ($rows as $row) {
					// Add table headers
		            if ($first) {
		               $titles = array();
		                foreach ($row as $key => $val) {
		                    $titles[] = $key;
		                }
		                fputcsv($output_handle, $titles);
		                $first = false;
		            }
		            $leadArray = (array) $row; // Cast the Object to an array
		            // Add row to file
		            fputcsv($output_handle, $leadArray);
		        }
		        // Close output file stream
		        fclose($output_handle);
		        //wp_die();
		        exit();
			}
		}
	}//End export_markers()

	public function update_marker($args) {
		global $wpdb;

		$table_name = $this->get_table_name();

		unset($args['action']);
		unset($args['param']);
		$data_row = $args;
		$data_row['time'] = current_time('mysql'); 

		$id = $args['id']; 
		if ($id == '') {
			$result = $wpdb->insert( 
				$table_name,
				$data_row
			);
		}
		else {
			$result = $wpdb->update( 
				$table_name, 
				$data_row,
				array(
					'id' => $id,
				) 
			);

		}
		return $result;
	}//End update_markers()


	public function add_table_cols($cols) {
		global $wpdb;
		$table_name = $this->get_table_name();

		$i = 0;
		foreach ($cols as $col) {
			$sql = "ALTER table $table_name ADD $col varchar(255) DEFAULT ''";
			$wpdb->query($sql);
			$i++;
		}
		return $i;
	}

	public function rename_table_cols($cols) {
		global $wpdb;
		$table_name = $this->get_table_name();

		$i = 0;
		foreach ($cols as $key => $val) {
			if ($key != $val ) {
				$sql = "ALTER table $table_name Change COLUMN $key $val varchar(255) DEFAULT ''"; 
				$wpdb->query($sql);
				$i++;
		
				/*
				$sql = "ALTER Table $table_name ADD $val varchar(255)";
				$wpdb->query($sql);
				$sql = "UPDATE $table_name SET $val = $key";
				$wpdb->query($sql);
				$sql = "ALTER Table $table_name DROP COLUMN $key"; 
				$wpdb->query($sql);
				*/
			}
		}
		return $i;
	}//End rename_table_cols()

	public function delete_table_cols($cols) {
		global $wpdb;
		$table_name = $this->get_table_name();

		$i = 0;
		$res;
		foreach ($cols as $key => $val) {
			$sql="ALTER Table $table_name DROP COLUMN $val";
			$wpdb->query($sql);
			$i++;
		}
		return $i;
	}//End delete_table_cols()



	public function update_marker_cols($cols) {
	    	$add_arr = array();
	    	$del_arr = array();
	    	$rn_arr = array();
	    
	    	foreach( $cols as $key => $value ) {
	    		if(preg_match('/^cwd_form_data_add_cols_[0-9]+$/', $key)) {
	    			$add_arr[$key] = str_replace(' ', '_', $value);
	    		}
	    		else if(preg_match('/^cwd_form_data_delete_cols_[a-zA-Z0-9_]+$/', $key)) {
	    			$del_arr[$key] = str_replace(' ', '_', $value);
	    		}
	    		else if(preg_match('/^cwd_form_data_curr_cols_[a-zA-Z0-9_]+$/', $key)) {
	    			$key = substr($key, 24); // remove 24 characters to get the name
	    			$rn_arr[$key] = str_replace(' ', '_', $value);
	    		}
	    		else {}
	    	}

	    	//print_r(json_encode($map_settings));
	    	//print_r($add_arr);

	    		$add_res = empty($add_arr) ? 0 : $this->add_table_cols($add_arr);
	    	
	    		$del_res =  empty($del_arr) ? 0 : $this->delete_table_cols($del_arr);
	    	
	    		$rn_res =  empty($rn_arr) ? 0 : $this->rename_table_cols($rn_arr);



		return $add_res." column(s) added\n".$del_res." column(s) deleted\n".$rn_res." column(s) renamed";  
	}//End update_marker_cols()

}//End class Cwd_Dynamic_Maps_Marker_Table 




if(!class_exists('WP_List_Table')){
   require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}
/*
// This didn't work, but the prepare function might be better to incorporate into the other list_table extended class because of the query approach
class CWD_Extend_WP_Admin_Table_OLD extends WP_List_Table {


    // Constructor, we override the parent to pass our own arguments
    // We usually focus on three parameters: singular and plural labels, as well as whether the class supports AJAX.

    function __construct() {
		parent::__construct( array(
		'singular'=> 'wp_list_text_datum', //Singular label
		'plural' => 'wp_list_test_data', //plural label, also this well be one of the table css class
		'ajax'   => false //We won't support Ajax for this table
		) );
    }

    function get_columns() {
   		$columns = array(
			'col_id'=>__('id'),
			'col_time'=>__('time'),
			'col_first_name'=>__('first_name'),
			'col_middle_names'=>__('middle_names'),
			'col_last_name'=>__('last_name'),
			'col_born'=>__('born'),
			'col_died'=>__('died'),
			'col_latitude'=>__('latitude'),
			'col_longitude'=>__('longitude'),
			'col_description'=>__('description')
   		);
   		return $columns;
	}

	public function get_hidden_columns() {
        // Setup Hidden columns and return them
        return array();
 
    }

	public function get_sortable_columns() {
		$sortable = array(
			'col_id'=>'id',
			'col_time'=>'time',
			'col_first_name'=>'first_name',
			'col_middle_names'=>'middle_names',
			'col_last_name'=>'last_name',
			'col_born'=>'born',
			'col_died'=>'died',
			'col_latitude'=>'latitude',
			'col_longitude'=>'longitude',
			'col_description'=>'description'
		);
		return $sortable;
	}

	public function column_default( $item, $column_name ) {
 
	    switch( $column_name ) {
	        case 'col_id':
			case 'col_time':
			case 'col_first_name':
			case 'col_middle_names':
			case 'col_last_name':
			case 'col_born:':
			case 'col_died':
			case 'col_latitude':
			case 'col_longitude':
			case 'col_description':
	 
	            return "<strong>".$item[$column_name]."</strong>";
	                 
	 
	        default:
	 
	            return print_r( $item, true ) ;
	 
	    }
 
}

	function prepare_items() {
	   global $wpdb, $_wp_column_headers;
	   $screen = get_current_screen();

	   // -- Preparing your query -- 
	   		$table_name = Cwd_Dynamic_Maps_Marker_Table::get_table_name(); //"wp_main_cwd_dynamic_maps_data";

	        $query = "SELECT * FROM $table_name";

	   // -- Ordering parameters -- 
	       //Parameters that are going to be used to order the result
	       $orderby = (!empty($_REQUEST["orderby"])) ? $_REQUEST['orderby'] : 'id'; //should escape like mysqli_real_escape_string($_GET["$var"])
	       $order = (!empty($_REQUEST["order"])) ? $_REQUEST["order"] : 'ASC'; //should escape like mysqli_real_escape_string($_GET["$var"])
	       if(!empty($orderby) & !empty($order)){ $query.=" ORDER BY ".$orderby." " .$order; }
	


	   // -- Pagination parameters -- 
	        //Number of elements in your table?
	        $totalitems = $wpdb->query($query); //return the total number of affected rows
	        //How many to display per page?
	        $perpage = 5;
	        //Which page is this?
	        $paged = !empty($_GET["paged"]) ? $_GET["paged"] :  ''; //should escape like mysqli_real_escape_string($_GET["$var"])
	        //Page Number
	        if(empty($paged) || !is_numeric($paged) || $paged<=0 ){ $paged=1; } //How many pages do we have in total?
	        $totalpages = ceil($totalitems/$perpage); //adjust the query to take pagination into account 
	        if(!empty($paged) && !empty($perpage)){ $offset=($paged-1)*$perpage; $query.=' LIMIT '.(int)$offset.','.(int)$perpage; } // -- Register 2the pagination -- 
	        $this->set_pagination_args( array(
	         "total_items" => $totalitems,
	         "total_pages" => $totalpages,
	         "per_page" => $perpage,
	      ) );
	      //The pagination links are automatically built according to those parameters

	   // -- Register the Columns -- 
	      $columns = $this->get_columns();
	      $hidden = $this->get_hidden_columns();
	      $sortable = $this->get_sortable_columns();
	      $this->_column_headers = array($columns, $hidden, $sortable);
	      $_wp_column_headers[$screen->id]=$columns;

	   // -- Fetch the items -- 
	      $this->items = $wpdb->get_results($query);


	}

	function display_rows() {

	   //Get the records registered in the prepare_items method
	   $records = $this->items;

	   //Get the columns registered in the get_columns and get_sortable_columns methods
	   list( $columns, $hidden, $sortable ) = $this->get_column_info();


	   // NOTE: AIDAN FIX AREA

	    //$columns = $this->get_columns(); // This should have been set up at the end of prepare_items()
	   // NOTE: END AIDAN FIX AREA

	   //Loop for each record
	   if(!empty($records)){foreach($records as $rec) {

	      
	      //Open the line
	        echo '< tr id="record_'.$rec->id.'">';
	   		//echo '< tr >';


	      foreach ( $columns as $column_name => $column_display_name ) {

	         //Style attributes for each col
	         $class = "class='$column_name column-$column_name'";
	         $style = "";
	         if ( in_array( $column_name, $hidden ) ) { $style = ' style="display:none;"'; }
	         $attributes = $class . $style;

	         //edit link
	         $editlink  = '/wp-admin/link.php?action=edit&id='.(int)$rec->id; // NOTE:Edit the link in this line

	         //Display the cell
	         switch ( $column_name ) {
	            case "col_id":  echo '< td '.$attributes.'>'.stripslashes($rec->id).'< /td>';   break;
	            case "col_time":  echo '< td '.$attributes.'>'.stripslashes($rec->time).'< /td>';   break;
	            case "col_first_name": echo '< td '.$attributes.'>'.stripslashes($rec->first_name).'< /td>'; break;
	            case "col_middle_names": echo '< td '.$attributes.'>'.stripslashes($rec->middle_names).'< /td>'; break;
	            case "col_last_name": echo '< td '.$attributes.'>'.stripslashes($rec->last_name).'< /td>'; break;
	            case "col_description": echo '< td '.$attributes.'>'.$rec->description.'< /td>'; break;
	            case "col_born": echo '< td '.$attributes.'>'.$rec->born.'< /td>'; break;
	            case "col_died": echo '< td '.$attributes.'>'.$rec->died.'< /td>'; break;
	            case "col_latitude": echo '< td '.$attributes.'>'.stripslashes($rec->latitude).'< /td>'; break;
	            case "col_longitude": echo '< td '.$attributes.'>'.stripslashes($rec->longitude).'< /td>'; break;
	            case "col_description": echo '< td '.$attributes.'>'.stripslashes($rec->description).'< /td>'; break;
	        } //switch
	      } //foreach

	      //Close the line
	      echo'< /tr>';
	   }} //if-foreach
	} //display?
}//class?
*/


class Cwd_Extend_WP_Admin_Table_Maps extends WP_List_Table {

	/**
	 * The type of this table.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $cwd_table_type   The type of this table.
	 */
	private $cwd_table_type;

	/**
	 * The instantiated object of $cwd_table_type.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      obj    $cwd_table_obj   The instantiated object of $cwd_table_type.
	 */
	private $cwd_table_obj;

	public function __construct($cwd_table_type) {
        parent::__construct($cwd_table_type);

        $this->cwd_table_type = $cwd_table_type;
        if ($cwd_table_type == 'map') {
			$this->cwd_table_obj = new Cwd_Dynamic_Maps_Map_Table();
        }
        else if ($cwd_table_type == 'group') {
        	$this->cwd_table_obj = 'group';
        }
        else if ($cwd_table_type == 'marker') {
        	$this->cwd_table_obj = new Cwd_Dynamic_Maps_Marker_Table(1);
        }
        else {
        	$this->cwd_table_obj = null;
        	$this->cwd_table_type = null;
        }

    }

    public function prepare_items()
    {
        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();
        $data = $this->table_data();
        $perPage = 5;

        // Filter Data by Search
        $filter = isset ($_REQUEST['s']) ? wp_unslash( trim( $_REQUEST['s'] ) ) : '';
        if ($filter) {
        	$data = array_values( array_filter( $data, function( $row ) use( $filter ) {
				foreach( $row as $row_val ) {
					if( stripos( $row_val, $filter ) !== false ) {
						return true;
					}				
				}
			}));			
        }

        usort( $data, array( &$this, 'sort_data' ) );
        $currentPage = $this->get_pagenum();
        $totalItems = count($data);
        $this->set_pagination_args( array(
            'total_items' => $totalItems,
            'per_page'    => $perPage
        ) );
        $data = array_slice($data,(($currentPage-1)*$perPage),$perPage);
        $this->_column_headers = array($columns, $hidden, $sortable);
        $this->items = $data;
    }

    // Returns an associative array containing the bulk action.
	public function get_bulk_actions() {
		
		 // on hitting apply in bulk actions the url paramas are set as
		 // ?action=bulk-download&paged=1&action2=-1 
		 // action and action2 are set based on the triggers above and below the table		 		    
		 
		$actions = array(
			'cwd-download' => 'Download',
			'cwd-edit' => 'Edit',
			'cwd-delete' => 'Delete'
		);
		return $actions;
	}



	protected function column_mapName( $item ) {		
	//	$admin_page_url =  admin_url( 'users.php' );
		// row action to view usermeta.
	/*	$query_args_view_usermeta = array(
			'page'		=>  wp_unslash( $_REQUEST['page'] ),
			'action'	=> 'view_usermeta',
			'user_id'	=> absint( $item['id']),
			'_wpnonce'	=> wp_create_nonce( 'view_usermeta_nonce' ),
		);*/
		//$view_usermeta_link = esc_url( add_query_arg( $query_args_view_usermeta, $admin_page_url ) );		

		$actions['map_edit'] = '<a data-map_id="'.$item["id"].'" class="cwd-edit-action-map-settings-form" >' . __( 'Edit' ) . '</a>';		
		//$actions['map_delete'] = '<a class="cwd-delete-action-map-settings-form" >' . __( 'Delete' ) . '</a>';	

		return '<div><a class="cwd-edit-action-map-settings-form" data-map_id="'.$item["id"].'"/>' . str_replace('_', ' ', $item['mapName']) .'</div>' . $this->row_actions( $actions ); 

		//return $item['mapName'] . $this->row_actions( $actions ); 
	}

	protected function column_group_name( $item ) {		
		if ($this->cwd_table_obj == 'group') {
			$actions['group_edit'] = '<a data-group_number="'.$item["group_number"].'" class="cwd-edit-action-group-settings-form" >' . __( 'Edit' ) . '</a>';		

			return '<div><a class="cwd-edit-action-group-settings-form" data-group_number="'.$item["group_number"].'"/>' . str_replace('_', ' ', $item['group_name']) .'</div>' . $this->row_actions( $actions ); 
		}
		else {
			return $item['group_name'];
		}
	}


	

    /**
     * Override the parent columns method. Defines the columns to use in your listing table
     *
     * @return Array
     */
    public function get_columns()
    {
    	if ($this->cwd_table_type == 'group') {
    		$columns = array(
    			'cb' => 'cb',
    			'group_name' => 'Group Name',
    			'group_number' => 'Group Number'
    		); 
    	}
    	else {
    		$no_show_cols = ['id', 'time', 'polyline'];
    		$columns['cb'] = 'cb'; //add check box
    		$headers = array_diff($this->cwd_table_obj->get_table_header(), $no_show_cols);

    		foreach ($headers as $header) {
    		if ($header === 'id') {
    			$columns[$header] = 'ID';
    		}
			else {
    			$columns[$header] = $header;
    		}
    	}
    	}

        return $columns;
    }
    /**
     * Define which columns are hidden
     *
     * @return Array
     */
    public function get_hidden_columns()
    {
        return array();
    }
    /**
     * Define the sortable columns
     *
     * @return Array
     */
    public function get_sortable_columns()
    {
    	// dynamically get from table all columns except time 
        /*return array(
        	'id' => array('id', false), 
        	'first_name' => array('first_name', false), 
        	'middle_names' => array('middle_names', false), 
        	'last_name' => array('last_name', false), 
        	'born' => array('born', false),
        	'died' => array('died', false),
        	'latitude' => array('latitude', false), 
        	'longitude' => array('longitude', false), 
        	'description' => array('description', false)
        );*/

        $headers = ( ($this->cwd_table_obj == 'group') ? array('group_name', 'group_number') : $this->cwd_table_obj->get_table_header() );
    	$columns = array();
    	foreach ($headers as $header) {
    		$columns[$header] = array($header, false);
    	}

        return $columns;
    }
    /**
     * Get the table data
     *
     * @return Array
     */
    private function table_data()
    {
        global $wpdb;
        $sql;

  		if ($this->cwd_table_type == 'group') {
  			$table_name = $wpdb->prefix.'cwd_dynamic_maps_marker_data_';
  			$query = "Show tables like '".$table_name."%'";
  			$arr = $wpdb->get_results($query, ARRAY_N);
  			$sql = array();
  			for ( $i = 0; $i < sizeof($arr); $i++ ) {
  				//remove the common beginning of the table name
  				$tmp = str_replace( $table_name, '', $arr[$i][0] );
  				$matches;
  				preg_match('/^([0-9]+)_([a-zA-Z0-9_]+)$/', $tmp, $matches);

			    $sql[$i] = (object) array('group_name' => str_replace('_',' ',$matches[2]), 'group_number' => $matches[1] );
			}
		}
		else {
			$table_name = $this->cwd_table_obj->get_table_name(); //"wp_main_cwd_dynamic_maps_data";
		    $query = "SELECT * FROM $table_name";
		    $sql = $wpdb->get_results($query);
		}

	    $data = json_decode(json_encode($sql), true);
 
        return $data;
    }
    /**
     * Define what data to show on each column of the table
     *
     * @param  Array $item        Data
     * @param  String $column_name - Current column name
     *
     * @return Mixed
     */
    public function column_default( $item, $column_name )
    {
        switch( $column_name ) {
            /*case 'id':
            	return '<div><a class="cwd-link-map"/>'. $item[ $column_name ] .'</div>';
            case 'mapName':
            	return '<div><a class="cwd-link-map"/>'. $item[ $column_name ] .'</div>';
            */
            default:
            	return $item[ $column_name ];
        }
    }

    /**
	 * Get value for checkbox column.
	 *
	 * @param object $item  A row's data.
	 * @return string Text to be placed inside the column <td>.
	 */
	protected function column_cb( $item ) {
		$cb_id = ( ($this->cwd_table_type == 'group') ? 'group_number' : 'id');

		return sprintf(		
		'<label class="screen-reader-text" for="cwd_'.$this->cwd_table_type.'_select_' . $item[$cb_id] . '">' . sprintf( __( 'Select %s' ), $item[$cb_id] ) . '</label>'
		. "<input type='checkbox' name='cwd_".$this->cwd_table_type."_selection[]' id='cwd_".$this->cwd_table_type."_select_{$item[$cb_id]}' value='{$item[$cb_id]}' />"					
		);
	}
    /**
     * Allows you to sort the data by the variables set in the $_GET
     *
     * @return Mixed
     */
    private function sort_data( $a, $b )
    {
        // Set defaults
        $orderby = ( ($this->cwd_table_type == 'group') ? 'group_number' : 'id');
        $order = 'asc';
        // If orderby is set, use this as the sort column
        if(!empty($_GET['orderby']))
        {
            $orderby = $_GET['orderby'];
        }
        // If order is set use this as the order
        if(!empty($_GET['order']))
        {
            $order = $_GET['order'];
        }

		// Clean strings to be all lowercase
		if ( is_string($a) && is_string ($b) ) {
			$a = strtolower($a);
			$b = strtolower($b);
		}

		// Compare results
        if ($a[$orderby] == $b[$orderby]) {
		    $result = 0;
		}
		else if ($a[$orderby] < $b[$orderby]) {
			$result = -1;
		}
		else {
			$result = 1;
		}

		// Order comparison list by asc or desc
        if($order === 'asc')
        {
            return $result;
        }
        return -$result;
    }

}

