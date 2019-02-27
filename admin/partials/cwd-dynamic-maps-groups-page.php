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
	<h1>Edit Groups</h1>

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

	<form id="cwd-marker-cols-update-form" class="cwd-admin-block"> 
		<input type="hidden" name="marker_group" value="" >

		<table id="table-col-name-form" class="form-table">
			<thead>
				<th><h1>Data Columns for Marker Group</h1></th>
			</thead>
			<tbody id="cwd-tbody-col-name-form">
				<tr class="no-map-selected" >
					<td class="no-selection-td" ><i>Please SELECT a Marker Group from the table above to edit the available input fields for it's markers</i></td>
				</tr>
				<?php 
					//$col_options = Cwd_Dynamic_Maps_Marker_Table::get_table_cols_clean_2('r');

					/*
					$markers = new Cwd_Dynamic_Maps_Marker_Table();
					$col_options = $markers->get_table_cols_clean_2();
					*/

					/*foreach ($col_options as $key => $val) {
						echo '<tr>
								<td>
									<input type="text" class="regular-text" name="cwd_form_data_curr_cols_'.esc_attr($val).'" value="'. str_replace('_', ' ', esc_attr($val)).'" />
								</td>
								<td>
									<input type="button" class="cwd_options_remove_table_col_button cwd-left button button-secondary" value="Delete"/> 
								</td>
							</tr>';
					}*/
				?>
	        </tbody>
	        <tfoot>
				 <tr>
				 	<td id="col-name-plus-minus">
			        	<input id="cwd_options_add_input_button" type="button" class="button button-secondary cwd-left" value="+"/> 
			    		<input id="cwd_options_remove_input_button" type="button" class="button button-secondary cwd-left" value="-"/> 
			    	<td>
			    </tr>
		    </tfoot>

		</table>
		<div class="cwd-button-wrap"> 
			<button id="cwd-cols-form-button" type="button" class="button button-primary cwd-right">Update Columns</button>
		</div>
	</form>