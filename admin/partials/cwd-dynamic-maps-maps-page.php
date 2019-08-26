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

	<div id="cwd-import-export" class="cwd-import-export-section cwd-admin-block" >
		<h1>Import Maps</h1>
		</br>
		<form id="cwd-import-form" method="post" enctype="multipart/form-data">
			<input type="file" name="file" id="file">
			<input type="submit" name="upload_maps_csv" class="button button-primary" value="Upload File" />
			<!--<button id="cwd-import-button" type="submit" class="button button-primary" >Import Markers</button>-->
		</form>
		</br>
		<h1>Export Maps</h1>
		</br>
		<form id="cwd-export-form" method="post">
			<!--<button id="cwd-export-button" type="button" class="button button-primary" style="margin-right:10px;">Export Markers</button>-->

			<input type="submit" name="cwd_download_maps_csv" class="button button-primary" value="Download File" />	
		</form>
	</div>


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


	<?php

		//$map_options = Cwd_Dynamic_Maps_Map_Table::get_table_data();
		
	?>

	<div id="php-table-data"></div>

	<form id="map-settings-form" class="cwd-admin-block" method="post">

		<table id="table-map-settings-form" class="form-table" >
			<thead>
				<th id="title"><h1>Create NEW Map Settings</h1></th>				
			</thead>
			<tbody>
				
				<tr id="map_id">
					<th>Map ID:</th>
					<td>
						<span><?php //echo $res->id; ?></span> 	
						<input type="hidden" class="" name="id" value="<?php //echo $res->id; ?>"/>		

					</td>
				</tr>
				<tr>
					<th>Name:</th>
					<td id="map_name">
						<input type="text" class="regular-text" name="mapName" value="<?php //echo str_replace('_', ' ',esc_attr($res->mapName)); ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Center Latitude:</th>
					<td id="center_lat">
						<input type="text" class="regular-text" name="centerLat" value="<?php //echo $res->centerLat; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Center Longitude:</th>
					<td id="center_lng">
						<input type="text" class="regular-text" name="centerLng" value="<?php //echo $res->centerLng; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Zoom:</th>
					<td id="zoom">
						<input type="text" class="regular-text" name="zoom" value="<?php //echo $res->zoom; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Minimum Zoom:</th>
					<td id="min_zoom">
						<input type="text" class="regular-text" name="minZoom" value="<?php //echo $res->minZoom; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Maximum Zoom:</th>
					<td id="max_zoom">
						<input type="text" class="regular-text" name="maxZoom" value="<?php //echo $res->maxZoom; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Map Type:</th>
					<td id="map_type_id">
						<!--<input type="text" class="regular-text" name="mapTypeId" value="<?php //echo $map_options[0]->mapTypeId; ?>"/> -->

						<?php //$mapTypeId = $res->mapTypeId;?>
						<div>
							<input type="radio" class="" name="mapTypeId" value="roadmap" <?php //if ($mapTypeId == 'roadmap') {echo 'checked';} ?> />
							<label>Roadmap</label>
						</div>
						<div>
							<input type="radio" class="" name="mapTypeId" value="satellite" <?php //if ($mapTypeId == 'satellite') {echo 'checked';} ?> />
							<label>Satellite</label>
						</div>
						<div>
							<input type="radio" class="" name="mapTypeId" value="hybrid" <?php //if ($mapTypeId == 'hybrid') {echo 'checked';} ?> />
							<label>Hybrid</label>
						</div>
						<div>
							<input type="radio" class="" name="mapTypeId" value="terrain" <?php //if ($mapTypeId == 'terrain') {echo 'checked';} ?> />
							<label>Terrain</label>
						</div>

					</td>
				</tr>
				<tr>
					<th>45&#176; Imagery (Tilt):</th>
					<td id="tilt">
						<!--<input type="text" class="regular-text" name="tilt" value="<?php //echo $map_options[0]->tilt; ?>"/>	-->

						<?php //$tilt = $res->tilt;?>
						<div>
							<input type="radio" class="" name="tilt" value=45 <?php //if ($tilt == 45) {echo 'checked';} ?> />
							<label>Allow</label>
						</div>
						<div>
							<input type="radio" class="" name="tilt" value=0 <?php //if ($tilt == 0) {echo 'checked';} ?> />
							<label>Don't Allow</label>
						</div>

					</td>
				</tr>
				<tr>
					<th>Initial Orientation (Heading):</th>
					<td id="heading">
						<!--<input type="text" class="regular-text" name="heading" value="<?php //echo $map_options[0]->heading; ?>"/>	-->

						<?php //$heading = $res->heading;?>
						<div>
							<input type="radio" class="" name="heading" value=0 <?php //if ($heading == 0) {echo 'checked';} ?> />
							<label>North</label>
						</div>
						<div>
							<input type="radio" class="" name="heading" value=90 <?php //if ($heading == 90) {echo 'checked';} ?> />
							<label>East</label>
						</div>
						<div>
							<input type="radio" class="" name="heading" value=180 <?php //if ($heading == 180) {echo 'checked';} ?> />
							<label>South</label>
						</div>
						<div>
							<input type="radio" class="" name="heading" value=-90 <?php //if ($heading == -90) {echo 'checked';} ?> />
							<label>West</label>
						</div>
					</td>
				</tr>
				<tr>
					<th>Restrict Map (Bounds):</th>
					<td id="map_bounded">
						<div>
							<input type="radio" class="" name="mapBounded" value=1 <?php //if ($tilt == 45) {echo 'checked';} ?> />
							<label>Yes</label>
						</div>
						<div>
							<input type="radio" class="" name="mapBounded" value=0 <?php //if ($tilt == 0) {echo 'checked';} ?> />
							<label>No</label>
						</div> 					
					</td>
				</tr>
				<tr>
					<th>Map Bound (North):</th>
					<td id="north_bound">
						<input type="text" class="regular-text" name="northBound" value="<?php //echo $res->northBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Map Bound (East):</th>
					<td id="east_bound">
						<input type="text" class="regular-text" name="eastBound" value="<?php //echo $res->eastBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Map Bound (South):</th>
					<td id="south_bound">
						<input type="text" class="regular-text" name="southBound" value="<?php //echo $res->southBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Map Bound (West):</th>
					<td id="west_bound">
						<input type="text" class="regular-text" name="westBound" value="<?php //echo $res->westBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Allow Polyline (Public):</th>
					<td id="polyline_allow">
						<div>
							<input type="radio" class="" name="polylineAllow" value=1 <?php //if ($tilt == 45) {echo 'checked';} ?> />
							<label>Allow</label>
						</div>
						<div>
							<input type="radio" class="" name="polylineAllow" value=0 <?php //if ($tilt == 0) {echo 'checked';} ?> />
							<label>Don't Allow</label>
						</div> 
					</td>
				</tr>
				<tr>
					<th>Polyline (Outline):</br><p style="font-size:6;font-weight:normal;"><i>[{"lat": 42.30; "lng": -71.53}; {"lat": 42.31; "lng": -71.54}; {"lat": 42.30; "lng": -71.54}; {"lat": 42.30; "lng": -71.53}] </i></p></th>
					<td id="polyline">
						<textarea type="text" class="regular-text" name="polyline"> </textarea> <!--value="<?php //echo str_replace('\\', '',esc_attr($res->polyline)); ?>"/>	-->
					</td>
				</tr>
				<tr>
					<th>Allow Overlay (Public):</th>
					<td id="overlay_allow">
						<div>
							<input type="radio" class="" name="overlayAllow" value=1 <?php //if ($tilt == 45) {echo 'checked';} ?> />
							<label>Allow</label>
						</div>
						<div>
							<input type="radio" class="" name="overlayAllow" value=0 <?php //if ($tilt == 0) {echo 'checked';} ?> />
							<label>Don't Allow</label>
						</div> 
					</td>
				</tr>
				<tr>
					<th>Overlay (Image):</th>
					<td id="overlay">
						<?php wp_enqueue_media();?>
						<img id="cwd-img-upload" src="<?php echo plugins_url() . '/cwd-dynamic-maps/public/img/camera-icon.svg'; ?>" height="28px" /> 
						<input type="hidden" class="process_custom_images" id="process_custom_images" name="overlay" value=""/>
						<button type="button" class="set_custom_images button">+</button>
						<button type="button" class="remove_custom_images button">-</button>
					</td>
				</tr>
				<tr>
					<th>Overlay Bound (North):</th>
					<td id="north_overlay_bound">
						<input type="text" class="regular-text" name="northOverlayBound" value="<?php //echo $res->northBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Overlay Bound (East):</th>
					<td id="east_overlay_bound">
						<input type="text" class="regular-text" name="eastOverlayBound" value="<?php //echo $res->eastBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Overlay Bound (South):</th>
					<td id="south_overlay_bound">
						<input type="text" class="regular-text" name="southOverlayBound" value="<?php //echo $res->southBound; ?>"/>	
					</td>
				</tr>
				<tr>
					<th>Overlay Bound (West):</th>
					<td id="west_overlay_bound">
						<input type="text" class="regular-text" name="westOverlayBound" value="<?php //echo $res->westBound; ?>"/>	
					</td>
				</tr>

			</tbody>
			<tfoot></tfoot> 
		</table>

		<!--<input type="submit" name="update_map" class="button button-primary" value="Save" />-->
		<div class="cwd-button-wrap"> 
			<button id="cwd-map-form-button" type="button" class="button button-primary cwd-right">Save Map</button>
			<button id="cwd-delete-map-btn" type="button" class="button button-secondary cwd-right cwd-invisible">Delete</button>
		</div>

	</form>

	<!--<div id="map-wrap"></div>-->



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
