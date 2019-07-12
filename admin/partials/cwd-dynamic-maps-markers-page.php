<?php 
/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       aidan-campbell.com
 * @since      1.0.0
 *
 * @package    Cwd_Dynamic_Maps
 * @subpackage Cwd_Dynamic_Maps/admin/partials
 */

?>

<div class="wrap"> 
	<h1>Edit Markers</h1>
	<div id="cwd_file_wrap" ></div>
	<?php 

		if (!empty(session_id())) {
			echo session_id();
			//unset($_SESSION['cwd-dynamic-maps-map-selection']);
			//unset($_SESSION['cwd-dynamic-maps-group-selection']);
			echo '<p>Map: '.((isset($_SESSION['cwd-dynamic-maps-map-selection'])) ? $_SESSION['cwd-dynamic-maps-map-selection']:'none').'</p>';
			echo '<p>Group: '.((isset($_SESSION['cwd-dynamic-maps-group-selection'])) ? $_SESSION['cwd-dynamic-maps-group-selection']:'none').'</p>';
		}
	?>

	<form id="cwd-map-selection-form" method="get" class="cwd-admin-block">
		<h1>Select Map</h1>
		</br>
		<input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>" /> 
			<?php 
				$wp_list_table = new Cwd_Extend_WP_Admin_Table_Maps('map');
				$wp_list_table->prepare_items();
				$wp_list_table->search_box('Search', 'search');
				$wp_list_table->display(); 
			?>					
	</form>

	<form id="cwd-group-selection-form" method="get" class="cwd-admin-block">
		<h1>Select Marker Group</h1>
		</br>
		<input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>" /> 
			<?php 
				$wp_list_table = new Cwd_Extend_WP_Admin_Table_Maps('group');
				$wp_list_table->prepare_items();
				$wp_list_table->search_box('Search', 'search');
				$wp_list_table->display(); 
			?>					
	</form>

	<?php 
			//$grp_num = (isset($_SESSION['cwd-dynamic-maps-group-selection']) ? $_SESSION['cwd-dynamic-maps-group-selection'] : '');
			
			$grp_num = '';
			$grp_full_name = '';

			if (isset($_SESSION['cwd-dynamic-maps-group-selection'])) {

				$grp_num = $_SESSION['cwd-dynamic-maps-group-selection'];

				$markers = new Cwd_Dynamic_Maps_Marker_Table($grp_num);
				$grp_full_name = $markers->get_table_name();

				$table_headers = $markers->get_table_header_clean();
				$num_cols = count($table_headers);
				$table_data = $markers->get_table_data();
			}
	?>

	<div id="cwd-import-export" class="cwd-import-export-section cwd-admin-block">
		<h1>Import Markers - Group: <?php echo $grp_num ?></h1>
		</br>
		
		
		<!-- AJAX Interupts Submit and make new FormData() post to cwd_ajax_url -->
		<form id="cwd-import-markers-form" method="post" enctype="multipart/form-data">
			<input type="file" name="file" id="file">
			<input type="hidden" name="marker_export_group" value=<?php echo $grp_num; ?> />
			<input type="hidden" name="marker_export_full_name" value=<?php echo $grp_full_name; ?> />
			<input type="submit" name="upload_csv" class="button button-primary" value="Upload File" />
		</form>
		
	

		</br>


	<!--
		<h1>Export Markers - Group: <?php //echo $grp_num?></h1>
		</br>
		<form id="cwd-export-form" method="post">
			<input type="submit" name="download_csv" class="button button-primary" value="Download File" />
		</form>
	-->

		<h1>Export Markers - Group: <?php echo $grp_num ?></h1>
		</br>
		<form id="cwd-export-markers-form" method="post">
			<input type="hidden" name="marker_export_group" value=<?php echo $grp_num; ?> />
			<input type="hidden" name="marker_export_full_name" value=<?php echo $grp_full_name; ?> />
			<!--<input type="button" data-cwd-group= <?php //echo $grp_num; ?> name="download_markers_csv" class="button button-primary" value="Download File" />-->
			<button id="download_markers_csv" type="button" class="button-primary button">Download File</button>
		</form>
	</div>

	<div id='cwd-markers-div' >
		<?php 
			/*
			if (isset($_SESSION['cwd-dynamic-maps-group-selection'])) {
				$markers = new Cwd_Dynamic_Maps_Marker_Table($_SESSION['cwd-dynamic-maps-group-selection']);
			
				$table_headers = $markers->get_table_header_clean();
				$num_cols = count($table_headers);
				$table_data = $markers->get_table_data();
			}
			*/
		?>
		<div id='cwd-add-edit-marker-description'>
			<p>
				<strong>Add a New Marker: </strong>
				by filling out the form below. Click on the map to add/change the location of the marker or fill in the latitude and longitude on the form.
			</p> 
			<p>
				<strong>Edit an Existing Marker: </strong>
				by first selecting the marker you want to edit and then changing the data in the form. To select a marker for editing either click the marker on the map or locate it in the table and click on it's <i>id</i>. 
			</p>
		</div>
		<div id='new-marker-div'>
			<form method="post" id="cwd-form-id" class="cwd-admin-block" > 
				<h1 id="update-marker-form-label">Add Marker</h1>
				<table id="new-marker-table" class="">
					<tr valign="top">
						<?php 
						/*
							$input_fields_type = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea'];

							// Which Cols start a new row
							$section_breaks = [2,4,6,7];
							$num_sections = count($section_breaks);
							$section_start = 0;
							$section_end = 0;
							for ( $i=0; $i<$num_cols; $i++ ) {
								echo '<th scope="row">'.ucwords( str_replace( '_', ' ', $table_headers[$i] ) ).'</th>';
								// When we reach the start of a new section
								if ( in_array( $i, $section_breaks ) ) {
									echo '</tr>';
									// Make the Input Fields
									echo '<tr>';
									$section_end = $i;
									for ( $j=$section_start; $j<=$section_end; $j++) {
										echo '<td><'.$input_fields_type[$j].' style="resize:both;" type="text" name="'.$table_headers[$j].'" value=""></'.$input_fields_type[$j].'></td>';
									}
									echo '</tr>';
									$section_start = $i + 1; 
								}
							}
						*/

						?>
					</tr>
				</table>
					<?php

					if (isset($_SESSION['cwd-dynamic-maps-group-selection'])) {
						$data_types = $markers->get_data_types();

						wp_enqueue_media(); // load wp.media to include images (maybe move to admin scripts enqueue)???

						$string = '<div class="cwd-hidden">'; 
						$string .='<input name="id" type="hidden" value=""></input>';
						for ($i=0; $i<$num_cols; $i++) {
							$name = $table_headers[$i];
							$type = 'input';
							foreach ($data_types as $data_type) {
								if ($data_type->COLUMN_NAME == $name) {
									if ($data_type->CHARACTER_MAXIMUM_LENGTH > 255) {
										$type = 'textarea';
									}
									else if ($data_type->COLUMN_COMMENT == 'img') {
										$type = 'img';
									}
									//break;
								}
							}

							$string .= '<span class="cwd-marker-data-span">';
							$string .= '<h4 class="cwd-form-titles">';
							$string .= ucwords( str_replace('_', ' ', $name) );
							$string .= '</h4>';
							$string .= ( ($type==='img') ? '<img id="cwd-img-upload" src="' .plugins_url() . "/cwd-dynamic-maps/public/img/camera-icon.svg".'" height="28px" /> <input type="hidden" value="" class="marker-form-input-field process_custom_images" id="process_custom_images" name="'.$name.'" max="" min="1" step="1" />
    	<button type="button" class="set_custom_images button">+</button><button type="button" class="remove_custom_images button">-</button>' : '<'.$type.' class="marker-form-input-field" type="text" name="'.$name.'" value=""></'.$type.'>' );
							$string .= '</span>';
						}
						
						$string .= '</div>'; 
						echo $string;
					}
					?>
					
		        	<div class="cwd-button-wrap">
		        		<button id="cwd-form-button" type="button" class="button button-primary cwd-right">Save Marker</button>
		        		<div id="cwd-delete-marker-wrap"></div>
		        	</div>
			</form>
		</div>
		<div id="map-wrap"></div>
		<div class='cwd-table-wrap'></div>
		<br>
		
	</div>