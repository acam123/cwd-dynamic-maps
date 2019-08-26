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

	<div class="cwd-admin-block" style="padding-bottom:40px;"> 
	<form id="cwd-groups-update-form">
		<table id="cwd-table-groups-form" class="form-table">
			<thead>
				<th id="title"><h1>Create NEW Marker Group</h1></th>
			</thead>
			<tbody id="cwd-tbody-groups-form">
				<tr id="form_group_number_row" >
					<th>Number:</th>
					<td>
						<span></span> 	
						<input type="hidden" class="" name="group_number" value=""/>
					</td>
				</tr>
				<tr id="form_group_name_row" >
					<th>Name:</th>
					<td>
						<input type="text" class="regular-text" name="group_name" value=""/>
					</td>
				</tr>
				<tr>
					<td>
						<h2>Edit Data Columns</h2>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<h4 style="display:inline; margin-left:-15px;" >Visible?</h4>
						<h4 style="display:inline; margin-left:145px;" >Name</h4> 
					</td>

				</tr>

				<tr>
					<td></td>
					<td style="">
						<input type="checkbox" name="cwd_options_static_id" style="vertical-align: text-top; margin: 0px 20px 0px auto;">
						<div style="line-height:25px;display:inline-block;box-sizing:border-box;padding-left:5px;width:350px;height:25px;border:1px solid lightgray;"><i>id</i></div>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input type="checkbox" name="cwd_options_static_latitude" style="vertical-align: text-top; margin: 0px 20px 0px auto;">
						<div style="line-height:25px;display:inline-block;box-sizing:border-box;padding-left:5px;width:350px;height:25px;border:1px solid lightgray;"><i>latitude</i></div>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input type="checkbox" name="cwd_options_static_longitude" style="vertical-align: text-top; margin: 0px 20px 0px auto;">
						<div style="line-height:25px;display:inline-block;box-sizing:border-box;padding-left:5px;width:350px;height:25px;border:1px solid lightgray;"><i>longitude</i></div>
					</td>
				</tr>

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
		<button id="cwd-group-form-button" type="button" class="button button-primary cwd-right">Save Group</button>
	</form>
		<button id="cwd-group-delete-btn" type="button" class="button button-secondary cwd-right cwd-invisible">Delete Group</button>
	</div>




	<!--
	<form id="cwd-group-data-visible-form" class="cwd-admin-block" method="post" action="options.php" >
		<h1>Data Cols Visible to the Public </h1>
		<table>
			<tbody>
			</tbody>
		</table>
		<div class="cwd-button-wrap"> 
			<button id="cwd-group-form-visible-button" type="button" class="button button-primary cwd-right">Save Settings</button>
		</div>
	</form>
-->




	<form id="cwd-group-infowindow-form" class="cwd-admin-block" method="post" action="options.php">
		<?php 
           // settings_fields( 'cwd_dynamic_maps_displays' );
           // do_settings_sections( 'cwd_dynamic_maps_displays' );       
                   
		?>

		<h1>HTML for Infowindow Display</h1>
		<p><i>Leave Blank for Default Display</i></p>
		<p>Include Data Dynamically as $cwd-infowindow-<i><b>[NAME_OF_DATA_COLUMN]</b></i></p>
		<p><i>(e.g. &lt;p&gt;Name: $cwd-infowindow-name &lt;/p&gt; -> Name: John Smith )</i></p>
	
		<!--<input type="text" class="regular-text" name="cwd_dynamic_maps_display_infowindow" value="<?php //echo esc_attr( get_option('cwd_dynamic_maps_display_infowindow') ); ?>" />-->
		<?php 
			$old_displays = get_option('cwd_dynamic_maps_display_infowindow');
			$displays = $old_displays;


			//echo gettype($old_displays);
			//echo var_dump($old_displays);
	//		print_r($displays);
	//		var_dump($displays) ;
	
		?>
		<!-- <textarea style="width:100%;" name="cwd_dynamic_maps_tmp" ><?php// echo $displays[$tmp] ?></textarea> -->

		<?php 
		//$displays[$tmp] = 'ccc'; 
		//echo $displays[$tmp];
	//	var_dump($displays);
		//update_option('cwd_dynamic_maps_display_infowindow', $displays);
		?>
		
	<!--	<input type="text" name=<?php //echo 'cwd_dynamic_maps_display_infowindow['.$tmp.']';?> > <?php //echo  esc_textarea($displays[$tmp]) ; ?> </input>-->

		<div class="cwd-button-wrap"> 
			<button id="cwd-group-form-display-button" type="button" class="button button-primary cwd-right">Save Infowindow Display</button>
		</div>

		<?php
           // submit_button(); 
        ?>
	</form>

	<form id="cwd-group-cluster-form" class="cwd-admin-block" method="post" action="options.php">
		<h1>HTML for Infowindow <b>Cluster</b> Display</h1>
		<p><i>Leave Blank for Default Display</i></p>
		<p>Include Data Dynamically as $cwd-infowindow-<i><b>[NAME_OF_DATA_COLUMN]</b></i></p>
		<p><b></b></p>
		<p><i>(e.g. &lt;span&gt;Name: $cwd-infowindow-name &lt;/span&gt; -> <br>Name: John Smith<br>Name: John Ralph<br>Name: John Doe<br>... )</i></p>

		
		<?php 
			$old_displays = get_option('cwd_dynamic_maps_display_cluster');
			//echo $old_displays;
			//echo gettype($old_displays);
			$displays = $old_displays;
	//		print_r($displays);
	//		var_dump($displays) ;
	
		?>

		<div class="cwd-button-wrap"> 
			<button id="cwd-group-form-cluster-button" type="button" class="button button-primary cwd-right">Save Cluster Display</button>
		</div>



	</form>
	<!-- 
<div style="align-items:center; display:flex; box-sizing:content-box; padding:10px 0 10px 0; background-color:#333333; border-bottom:1px solid black; ">
     <span class="cwd-infowindow-img-wrap" style=" padding-left:10px; padding-right:10px; "><img src="$cwd-infowindow-img" width="50px;" height="auto"; /></span>
     <span style=" padding-right:10px;"><h2 style="color:white; text-align:center; margin-bottom:0px;"><strong> <span class="cwd-infowindow-name">$cwd-infowindow-Name</span></strong></h2> 
     </span>
</div>
<div style="display:flex; box-sizing:content-box;">
	<span style="height:auto; width:40%; float:left; padding:10px; background-color:#A9A9A9;">
		<p>No. <span class="cwd-infowindow-burial-site-number">$cwd-infowindow-Burial_Site_Number</span></p>
		<p>Date: <span class="cwd-infowindow-death">$cwd-infowindow-Death</span></p>
	</span>
	<span style="height:auto; width:60%; float:right; padding:10px; border-left:1px solid grey; background-color:#FDFD96;">
                 <span>$cwd-infowindow-Name</span>
		<p>Some Content</p>
	</span>
</div>
	-->