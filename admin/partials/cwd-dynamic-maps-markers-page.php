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

	<div id="cwd-import-export" class="cwd-import-export-section cwd-admin-block">
		<h1>Import Markers</h1>
		</br>
		<form id="cwd-import-form" method="post" enctype="multipart/form-data">
			<input type="file" name="file" id="file">
			<input type="submit" name="upload_csv" class="button button-primary" value="Upload File" />
			<!--<button id="cwd-import-button" type="submit" class="button button-primary" >Import Markers</button>-->
		</form>
		</br>
		<h1>Export Markers</h1>
		</br>
		<form id="cwd-export-form" method="post">
			<!--<button id="cwd-export-button" type="button" class="button button-primary" style="margin-right:10px;">Export Markers</button>-->

			<input type="submit" name="download_csv" class="button button-primary" value="Download File" />	
		</form>
	</div>

	<div id='cwd-markers-div' >
		<?php 
			$markers = new Cwd_Dynamic_Maps_Marker_Table(1);
			$table_headers = $markers->get_table_header_clean();
			$num_cols = count($table_headers);
			$table_data = $markers->get_table_data();
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
						$data_types = $markers->get_data_types();

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
									break;
								}
							}

							$string .= '<span class="cwd-marker-data-span">';
							$string .= '<h4 class="cwd-form-titles">';
							$string .= ucwords( str_replace('_', ' ', $name) );
							$string .= '</h4>';
							$string .= '<'.$type.' class="marker-form-input-field" type="text" name="'.$name.'" value=""></'.$type.'>';
							$string .= '</span>';
						}
						
						$string .= '</div>'; 
						echo $string;
					?>
					
		        	<div class="cwd-button-wrap">
		        		<button id="cwd-form-button" type="button" class="button button-primary cwd-right">Save Marker</button>
		        	</div>
			</form>
		</div>
		<div id="map-wrap"></div>
		<div class='cwd-table-wrap'></div>
		<br>
		
	</div>

	

	