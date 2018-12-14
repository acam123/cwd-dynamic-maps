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
	<h1>CWD Settings</h1>

<?php 
/*
 * The following form adds wordpress registered options to the options table
 * registration is hooked in Cwd_Dynamic_Maps & defined in Cwd_Dynamic_Maps_Admin
 */
	

?>

	<form method="post" action="options.php">
            <?php 
                settings_fields( 'cwd_dynamic_maps_options' );
                do_settings_sections( 'cwd_dynamic_maps_options' );                
			?>
				<table id="table-plugin-settings-form" class="form-table">
					<thead>
						<th><h1>Plugin Settings</h1></th>
					</thead>
					<tbody>
				        <tr valign="top">
				        	<th scope="row">Google Maps API Key:</th>
				        	<td>
				        		<input type="text" class="regular-text" name="cwd_dynamic_maps_option_api_key" value="<?php echo esc_attr( get_option('cwd_dynamic_maps_option_api_key') ); ?>" />
			        		</td>
				        </tr>
			       
			    	</tbody>
			    	<tfoot></tfoot>

				</table>


			<?php
                submit_button(); 
            ?>
    </form>


