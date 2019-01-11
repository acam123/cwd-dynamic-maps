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
	<h1>Edit CWD Maps</h1>

	<div id="php-table-data"></div>

	<form id="map-settings-form" method="post">
	<!--
		<table>
			<tr>
				<th>Latitude</th>
				<th>Longitude</th>
				<th></th>
			</tr>
			<tr>
				<td>
					<input type="text" name="latitude" value=""/>
				</td>
				<td>
					<input type="text" name="longitude" value=""/>
				</td>
			</tr>
		</table>
	-->
		<table id="table-map-settings-form" class="form-table" style="background-color:white; overflow:hidden; padding:10px; margin-bottom:10px; border: 1px solid #e5e5e5; box-shadow: 0 1px 1px rgba(0,0,0,.04); display:block;">
			<thead>
				<th><h1>Map Settings</h1></th>
			</thead>
			<tbody>
				<tr>
					<th>Name:</th>
					<td>
						<input type="text" class="regular-text" name="map-name" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Center Latitude:</th>
					<td>
						<input type="text" class="regular-text" name="center-latitude" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Center Longitude:</th>
					<td>
						<input type="text" class="regular-text" name="center-longitude" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Zoom:</th>
					<td>
						<input type="text" class="regular-text" name="zoom" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Bounds:</th>
					<td>
						<input type="text" class="regular-text" name="map-bounds" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Overlay:</th>
					<td>
						<input type="text" class="regular-text" name="overlay" value=""/>	
					</td>
				</tr>
				<tr>
					<th>Overlay Bounds:</th>
					<td>
						<input type="text" class="regular-text" name="overlay-bounds" value=""/>	
					</td>
				</tr>


			</tbody>
			<tfoot></tfoot> 
		</table>

		<table id="table-col-name-form" class="form-table">
			<thead>
				<th><h1>Data Columns for Map Markers</h1></th>
			</thead>
			<tbody id="cwd-tbody-col-name-form">
				<?php 
					$col_options = Cwd_Dynamic_Maps_Marker_Table::get_table_cols_clean_2();

					foreach ($col_options as $key => $val) {
						echo '<tr>
								<td>
									<input type="text" class="regular-text" name="cwd_form_data_curr_cols_'.esc_attr($val).'" value="'. str_replace('_', ' ', esc_attr($val)).'" />
								</td>
								<td>
									<input type="button" class="cwd_options_remove_table_col_button button button-secondary" value="Delete" style="float:left;"/> 
								</td>
							</tr>';
					}
				?>
	        </tbody>
	        <tfoot>
				 <tr>
				 	<td>
			        	<input id="cwd_options_add_input_button" type="button" class="button button-secondary" value="+" style="float:right;"/> 
			    		<input id="cwd_options_remove_input_button" type="button" class="button button-secondary" value="-" style="float:right;"/> 
			    	<td>
			    </tr>
		    </tfoot>

		</table>

		<input type="submit" name="update_table_cols" class="button button-primary" value="Save" />
		
	</form>


	<div id="map-wrap"></div>
<?php

//Prepare Table of elements
	/*
	$wp_list_table = new Cwd_Extend_WP_Admin_Table();
	$wp_list_table->prepare_items();
	*/

//Table of elements
	/*
	echo '<form>';
	$wp_list_table->display();
	echo '</form>';
	*/
