(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	/*
	 * Save Infowindow Display for marker group
	 */
	/*
	$(function() {
 		$("#cwd-group-form-display-button").click(function(){
		 	var post_data = $("#cwd-group-infowindow-form").serialize()+"&action=cwd_request&param=update_infowindow";
		 	$.post(cwd_ajax_url, post_data, function(response){
		 		alert(response);
		 		//window.location.reload(true);
		 		//$(this).scrollTop(0);

		 	})
		})// End #cwd-group-form-display-button click action
 	})
 	*/

 	/*
	 * Save Cluster Display for marker group 
	 */
	/*
	$(function() {
 		$("#cwd-group-form-cluster-button").click(function(){
		 	var post_data = $("#cwd-group-cluster-form").serialize()+"&action=cwd_request&param=update_cluster_display";
		 	//alert(post_data);
		 	$.post(cwd_ajax_url, post_data, function(response){
		 		alert(response);
		 		//window.location.reload(true);
		 		//$(this).scrollTop(0);

		 	})
		})// End #cwd-group-form-cluster-button click action
 	});
 	*/


	//alert(location.toString().split('?page=')[1]);

	 /*
	  * Add Image Button for marker form
	  */
	$(function() {
		 if ( $('.set_custom_images').length > 0 ) {
		 	
	        if ( typeof wp !== 'undefined' && wp.media /*&& wp.media.editor*/) {
	            
	        	$(".remove_custom_images").click( function(e) {
	        		e.preventDefault();
	        		var button = $(this);
	        		var id = button.parent().find('input[id="process_custom_images"]');
	        		var img = button.parent().find('img[id="cwd-img-upload"]');
	        		id.val('');
	        		img.attr('src', cwd_plugins_url + "/cwd-dynamic-maps/public/img/camera-icon.svg" );

	        	});

	            $(".set_custom_images").click( function(e) {
	                e.preventDefault();
	                var button = $(this);
	                //var id = button.prev();
	                var id = button.parent().find('input[id="process_custom_images"]');

	                var file_frame;
	                var img = button.parent().find('img[id="cwd-img-upload"]');

	                if ( file_frame ) {
				        file_frame.open();
				        return;
				    }

				    file_frame = wp.media.frames.file_frame = wp.media(
				    	{
			            	title: 'Select or Upload Media Of Your Chosen Persuasion',
			            	button: {
			                	text: 'Use this media'
			            	},
			            	multiple: false  // Set to true to allow multiple files to be selected
			        	}
			        );

			        file_frame.on('select', function() { 
			        	var attachment = file_frame.state().get('selection').first().toJSON();
			            var newwurl = attachment.url.split('/wp-content');
			            //id.val(attachment.id);

			            //id.val(attachment.url); //!!!
			            id.val( '/wp-content'+newwurl[1] );

			            //img.attr('src', '/wp-content'+newwurl[1] );
			            img.attr('src', attachment.url );

			            console.log(img);
			            //console.log('/wp-content'+newwurl[1]);
			            console.log(newwurl);
			            file_frame.close();
			        });

			        file_frame.open();

        
	               /*
	                wp.media.editor.send.attachment = function(props, attachment) {
	                    id.val(attachment.id);
	                    console.log(attachment);
	                    console.log(props);
	                    console.log(wp.media);
	                    var img = button.parent().find('img[id="cwd-img-upload"]');
	                    img.attr('src', attachment.url);
	                };
	                wp.media.editor.open(button);
	                */
	                
	                return false;
	            });
	        }
	    }
	});

	/*
	 * For Maps Page
	 */
	$(function() {

		// load based on specific cwd admin page - map
		var currPage = location.toString().split('?page=')[1];
		var expr = /(cwd_maps_maps_edit)(.*)/;
		var matches = currPage.match(expr);

		var base = matches;


		if (matches !== null && typeof(matches[1]) !== 'undefined' && matches[1] === 'cwd_maps_maps_edit') {

			cwd_match('map', base);

			/* 
			 * Update Map button - calls on button click by including cwd-map-form-button in button tag 
			 * NOTE: avoids page refresh of wordpress defined submit_button();
			 */
	 		$("#cwd-map-form-button").click(function(){
			 	var post_data = $("#map-settings-form").serialize()+"&action=cwd_request&param=update_map";
			 	$.post(cwd_ajax_url, post_data, function(response){
			 		alert(response);
			 		window.location.reload(true);
			 		$(this).scrollTop(0);

			 	})
			})// End #cwd-map-form-button click action

			
	 		// Delete Map Action
	 		$("#cwd-delete-map-btn").click(function(){
					//alert(map_id);
				var map_num = $('#map-settings-form tr#map_id td span').text();
				var post_data = "map_id="+map_num+"&action=cwd_request&param=delete_map";
				//alert(post_data);
				$.post(cwd_ajax_url, post_data, function(response) {
					alert(response);
					window.location.reload(true);
				})
			})

			/*
			 * Select Map for Map Settings Form
			 */
			$(".cwd-edit-action-map-settings-form").click( function(event) {
				var thisLink = $(this);
				var map_id = thisLink.attr('data-map_id');

				//alert(typeof(map_id) + map_id.length + map_id);
				//console.log(map_id);//alert(map_id);

				var map_data = JSON.parse(cwd_map_data);
				var selectedMap = map_data.find(function (obj) { return obj.id == map_id; } );

				var delete_map_btn = $("#cwd-delete-map-btn");
				delete_map_btn.css('visibility', 'visible');

				// Fill Map Form
				var map_settings_form = $("#map-settings-form");
				var map_settings_table = map_settings_form.find('table');	

				map_settings_form.trigger('reset');
				var radios = map_settings_table.find('[type="radio"]');
				$(radios).prop('checked', false);

				var td_map_title = map_settings_table.find('th[id="title"] h1');
				td_map_title.text('Edit Map Settings');

				var tr_map_id = map_settings_table.find('tr[id="map_id"]').show();
				var td_map_id_text = tr_map_id.find('td span').text(map_id);
				var td_map_id_input = tr_map_id.find('td input').val(map_id);

				var td_map_name = map_settings_table.find('td[id="map_name"] input').val( selectedMap['mapName'].replace(/_/g, ' ') );
				var td_map_center_lat = map_settings_table.find('td[id="center_lat"] input').val( selectedMap['centerLat'] );
				var td_map_center_lng = map_settings_table.find('td[id="center_lng"] input').val( selectedMap['centerLng'] );
				var td_map_zoom = map_settings_table.find('td[id="zoom"] input').val( selectedMap['zoom'] );
				var td_map_min_zoom = map_settings_table.find('td[id="min_zoom"] input').val( selectedMap['minZoom'] );
				var td_map_max_zoom = map_settings_table.find('td[id="max_zoom"] input').val( selectedMap['maxZoom'] );
				var td_map_type_id = map_settings_table.find('td[id="map_type_id"] div input').filter('[value="'+selectedMap["mapTypeId"]+'"]').attr('checked', true);	
				var td_map_tilt = map_settings_table.find('td[id="tilt"] input').filter('[value="'+selectedMap["tilt"]+'"]').attr('checked', true);
				var td_map_heading = map_settings_table.find('td[id="heading"] input').filter('[value="'+selectedMap["heading"]+'"]').attr('checked', true);
				var td_map_bounded = map_settings_table.find('td[id="map_bounded"] input').filter('[value="'+selectedMap["mapBounded"]+'"]').attr('checked', true);
				var td_map_north_bound = map_settings_table.find('td[id="north_bound"] input').val( selectedMap['northBound'] );
				var td_map_east_bound = map_settings_table.find('td[id="east_bound"] input').val( selectedMap['eastBound'] );
				var td_map_south_bound = map_settings_table.find('td[id="south_bound"] input').val( selectedMap['southBound'] );
				var td_map_west_bound = map_settings_table.find('td[id="west_bound"] input').val( selectedMap['westBound'] );
				var td_map_polyline_allow = map_settings_table.find('td[id="polyline_allow"] input').filter('[value="'+selectedMap["polylineAllow"]+'"]').attr('checked', true);
				var td_map_polyline = map_settings_table.find('td[id="polyline"] textarea').val( selectedMap['polyline']);//.replace(/\\/g, '') );
				var td_map_overlay_allow = map_settings_table.find('td[id="overlay_allow"] input').filter('[value="'+selectedMap["overlayAllow"]+'"]').attr('checked', true);
				var td_map_overlay_hidden = map_settings_table.find('td[id="overlay"] input').val( selectedMap['overlay'] );

				var td_map_overlay_img = map_settings_table.find('img[id="cwd-img-upload"]')
				if (selectedMap['overlay'] !== '' && selectedMap['overlay'] !== null) {
					td_map_overlay_img.attr('src', cwd_base_url + selectedMap['overlay']);
				}
				else {
					td_map_overlay_img.attr('src', cwd_plugins_url + '/cwd-dynamic-maps/public/img/camera-icon.svg');
				}

				var td_overlay_north_bound = map_settings_table.find('td[id="north_overlay_bound"] input').val( selectedMap['northOverlayBound'] );
				var td_overlay_east_bound = map_settings_table.find('td[id="east_overlay_bound"] input').val( selectedMap['eastOverlayBound'] );
				var td_overlay_south_bound = map_settings_table.find('td[id="south_overlay_bound"] input').val( selectedMap['southOverlayBound'] );
				var td_overlay_west_bound = map_settings_table.find('td[id="west_overlay_bound"] input').val( selectedMap['westOverlayBound'] );

			})
		}// End if page is map
	});

	/*
	 * For Groups Page 
	 */
	 $(function() {	
	 	// load based on specific cwd admin page
	 	var currPage = location.toString().split('?page=')[1];
		var expr = /(cwd_maps_groups_edit)(.*)/;
		var matches = currPage.match(expr);

		var base = matches;

		if (matches !== null && typeof(matches[1]) !== 'undefined' && matches[1] === 'cwd_maps_groups_edit') {

			cwd_match('group', base);

			/* 
			 * Update Group form button - calls on button click by including cwd-group-form-button in button tag 
			 * NOTE: avoids page refresh of wordpress defined submit_button();
			 */
			$("#cwd-group-form-button").click(function(){
			 	var post_data = $("#cwd-groups-update-form").serialize()+"&action=cwd_request&param=update_marker_cols";
			 	$.post(cwd_ajax_url, post_data, function(response){
			 		alert(response);
			 		window.location.reload(true);
			 		window.scrollTo(0,0);
			 	})
			 });

			/*
			 * Save Infowindow Display for marker group
			 */
	 		$("#cwd-group-form-display-button").click(function(){
			 	var post_data = $("#cwd-group-infowindow-form").serialize()+"&action=cwd_request&param=update_infowindow";
			 	$.post(cwd_ajax_url, post_data, function(response){
			 		alert(response);
			 		//window.location.reload(true);
			 		//$(this).scrollTop(0);

			 	})
			}); // End #cwd-group-form-display-button click action


		 	/*
			 * Save Cluster Display for marker group 
			 */
	 		$("#cwd-group-form-cluster-button").click(function(){
			 	var post_data = $("#cwd-group-cluster-form").serialize()+"&action=cwd_request&param=update_cluster_display";
			 	//alert(post_data);
			 	$.post(cwd_ajax_url, post_data, function(response){
			 		alert(response);
			 		//window.location.reload(true);
			 		//$(this).scrollTop(0);

			 	})
			}); // End #cwd-group-form-cluster-button click action




			/*
			 * Add Input Fields Dynamically to form to set up Table Cols
			 */
			$("#cwd_options_add_input_button").click(function() {
		 		var tbody = $('#cwd-tbody-groups-form');
		 		var count = $('#cwd-tbody-groups-form tr[class="cwd_form_group_marker_cols_row"]').length;
		 		var tr = $('<tr>').attr('class', 'cwd_form_group_marker_cols_row');
		 		var td = $('<td>');
		 		var space_td = $('<td>');
		 		//Make the name attribute iterated off of the last number
		 		var input = $('<input>').attr('class','regular-text').attr('type', 'text').attr('name', 'cwd_group_form_data_add_cols_'+(count)); 

		 		var type_td = $('<td>');
		 		//var type = $('<select>').attr('name', 'cwd_group_form_data_type_add_cols_'+(count++));
		 		var type = $('<select>').attr('name', 'cwd_group_form_data_type_add_cols_'+(count));
		 		var opt = $('<option>').text('Text').val('text');

		 		var check = $('<input>').attr('type', 'checkbox').attr('name', 'cwd_group_form_data_visible_add_cols_'+(count));
		 		check.prop('checked', 'checked').css('vertical-align', 'text-top').css('margin', '0px 20px 0px auto');

		 		type.append(opt);
		 		opt = $('<option>').text('Long Text').val('textarea');
		 		type.append(opt);
		 		opt = $('<option>').text('Img').val('img');
		 		type.append(opt);

		 		
		 		//type_td.append(type);

		 		td.append(check);

		 		td.append(input);

		 		td.append(type);

		 		tr.append(space_td);
		 		//tr.append(type_td);
		 		tr.append(td);
		 		//tr.append (type_td);
		 		tbody.append(tr);	
		 	})

			/*
			 * Remove Input Fields Dynamically to form to set up Table Cols
			 */
		 	$("#cwd_options_remove_input_button").click(function() {
		 		var tbody = $('#cwd-tbody-groups-form');
		 		var last = $('#cwd-tbody-groups-form tr:last');
		 		var lastClass = last.find('td input[name^="cwd_group_form_data_add_cols_"]');

		 		//check if a new row
		 		if (lastClass.length >= 1) {
		 			last.remove();
		 		}
		 	})

			

		 	// Delete Group Action
		 	$('#cwd-group-delete-btn').click(function() { 
		 		var groupNum = $("#cwd-groups-update-form tr#form_group_number_row td span").text();
		 		var groupName = $("#cwd-groups-update-form tr#form_group_name_row td input").val();

		 		//alert(groupNum + groupName);
		 		//var groupNum = thisLink.attr('data-group_number');
				//var groupName = thisLink.attr('data-group_name');

		 		var check = confirm("Are you sure you want to delete all markers and data for the group: "+groupName+"?");
		 		if(check) {
			 		var post_data = "group_number="+groupNum+"&action=cwd_request&param=delete_group";
			 		$.post(cwd_ajax_url, post_data, function(response){
			 			alert(response);
			 			window.location.reload(true);
			 			$(this).scrollTop(0);
			 		})
		 		}

		 	});

			/*
			 * Select Group for Group Settings, Infowindow, & Cluster Forms
			 */
			$(".cwd-edit-action-group-settings-form").click( function(event) {

				var thisLink = $(this);
				var groupNum = thisLink.attr('data-group_number');
				var groupName = thisLink.attr('data-group_name');

				// Add Delete Marker Group Button
			 	var delete_btn = $("#cwd-group-delete-btn");
			 	delete_btn.css('visibility', 'visible');
			 	
			 	//var delete_btn = $('<button>').attr('id', 'cwd-group-delete-btn').attr('class', 'secondary-button button cwd-right').attr('type', 'button').text('Delete');
			 	//delete_wrap.append(delete_btn);
			 	//delete_wrap.html('<button id="cwd-group-delete-btn" class="secondary-button button cwd-right" type="button">Delete</button>');

				// Infowindow Display Form
				var infoForm = $("#cwd-group-infowindow-form");
				var oldText = infoForm.find('textarea');
				oldText.remove();
				var displayCode = '';
				if (cwd_infowindow_display !== null) { displayCode = cwd_infowindow_display[groupNum]; }
				if ( typeof(displayCode) === 'undefined' ) { displayCode = ''; }
				var textArea = '<textarea style="width:100%;" name="cwd_dynamic_maps_display_infowindow['+groupNum+']" >'+displayCode+'</textarea>';
				infoForm.append(textArea);

				// Cluster Display Form
				var clusterForm = $("#cwd-group-cluster-form");
				var oldText = clusterForm.find('textarea');
				oldText.remove();
				var displayCode = '';
				if ( cwd_cluster_display !== null ) { displayCode = cwd_cluster_display[groupNum]; }
				if (typeof(displayCode) === 'undefined') { displayCode = ''; }
				var textArea = '<textarea style="width:100%;" name="cwd_dynamic_maps_display_cluster['+groupNum+']" >'+displayCode+'</textarea>';
				clusterForm.append(textArea);



				var visibleCols = '';
				if ( cwd_visible_cols !== null ) { visibleCols = cwd_visible_cols[groupNum]; }
				if ( typeof(visibleCols) === 'undefined' ) { visibleCols = ''; }


				/*console.log('VISIBLE');
				console.log(visibleCols);*/



				// Group Settings Form 
				var post_data = "group_number="+groupNum+"&action=cwd_request&param=select_group";
				$.post(cwd_ajax_url, post_data, function(response){
			 		//Fill/Replace form
					var group_form_table = $("#cwd-groups-update-form table");
					var group_form_title = group_form_table.find('th[id="title"] h1').text('Edit Marker Group');

					var groups_form_tbody = $("#cwd-tbody-groups-form");

					var gf_id = $('input[name="cwd_options_static_id"]');
					if (visibleCols['id'] === 'on') { gf_id.attr('checked', true);}
					var gf_lat = $('input[name="cwd_options_static_latitude"]');
					if (visibleCols['latitude'] === 'on') { gf_lat.attr('checked', true);}
					var gf_lng = $('input[name="cwd_options_static_longitude"]');
					if (visibleCols['longitude'] === 'on') { gf_lng.attr('checked', true);}

					var old_rows = groups_form_tbody.children('tr[class="cwd_form_group_marker_cols_row"]');
					var group_num_row = groups_form_tbody.children('tr[id="form_group_number_row"]');
					var group_num_input = group_num_row.find('input');
					var num_span = group_num_row.find('span');
					var group_name_row = groups_form_tbody.children('tr[id="form_group_name_row"]');
					var group_name_input = group_name_row.find('input[name="group_name"]');

					old_rows.remove();
					num_span.text(groupNum);
					group_num_input.val(groupNum);
					group_name_input.val(groupName);
					group_num_row.show();
			 		groups_form_tbody.append(response);

			 		/*$("#cwd-group-delete-btn").click(function(event) {
			 			alert(groupNum);
			 		});*/

			 		// Add Delete Functionality to Marker Cols (NOTE: must add after delivering the html for the buttons)
				 	$(".cwd_options_remove_table_col_button").click(function(event) {
				 		var input = $(this).parent().find('input[type="text"]');
				 		var checkbox = $(this).parent().find('input[type="checkbox"]');

				 		//console.log(input);
				 		var name = input.attr('name');

				 		if ($(this).val() == 'Delete') {
					 		name = name.split("cwd_group_form_data_curr_cols_")[1];
					 		var verify = confirm("Are you sure you want to delete "+name);

							if (verify) {
								alert('This column will be permanently deleted from the database when you click save');
								//$(this).parent().parent().css('background-color', 'red');
								$(this).parents('tr[class="cwd_form_group_marker_cols_row"]').css('background-color', 'red');


								$(this).val('Undo');
					 			var newName = "cwd_group_form_data_delete_cols_";
					 			newName += name;
					 			input.attr('name', newName);

					 			newName = "cwd_group_form_data_visible_delete_cols_";
						 		newName += name;
						 		checkbox.attr('name', newName);

					 		}
					 	}
					 	else {
					 		name = name.split("cwd_group_form_data_delete_cols_")[1];
					 		//$(this).parent().parent().css('background-color', '');
					 		$(this).parents('tr[class="cwd_form_group_marker_cols_row"]').css('background-color', '');
					 		$(this).val('Delete');
					 		var newName = "cwd_group_form_data_curr_cols_";
					 		newName += name;
					 		input.attr('name', newName);

					 		newName = "cwd_group_form_data_visible_curr_cols_";
					 		newName += name;
					 		checkbox.attr('name', newName);
					 	}
			 		})// End of action on .cwd_options_remove_table_col_button

			 	})// End of $.post(...
			})// End of form action on .cwd-edit-action-group-settings-form
		} // End if page is group
	});//End jQuery fuction 

	/*
	 * Alter CWD Extension of WP Tables to Have Type (map, group) Specific Pagination 
	 * This allows both a map and group table to work on the same page
	 */
	function cwd_match(type, base) {

		//alert('MATCH!!!');

		var expr = new RegExp('(.*)(&cwd_paged_'+type+'=)([0-9]+)(.*)');

		var form = $('form[id="cwd-'+type+'-selection-form"]');
		var searchInput = form.find('input[id="search-search-input"]');

		if (searchInput.length === 0) { return false;}
		
		searchInput[0].name =  'cwd_s_'+type;

		var pageNavs = form.find('span[class="pagination-links"]');
		var navBtns = pageNavs.children('span[class="tablenav-pages-navspan"]');

		$.each(navBtns, function(key,val) { 
			var inner = navBtns[key].innerHTML;
			var label;
			switch(inner) {
			  case '«': //'&laquo'
			    label = 'first-page';
			    break;
			  case '‹': //'&lsaquo'
			    label = 'prev-page';
			    break;
			  case '›': //'&rsaquo'
			    label = 'next-page';
			    break;
			  case  '»': //'&raquo'
			    label = 'last-page';
			    break;
			  default:
			  	label = 'error-err';
			} 

			navBtns[key].outerHTML = '<a class="'+label+'" href="" >'
				+'<span class="screen-reader-text">'+label.charAt(0).toUpperCase()+label.slice(1).replace('-',' ')+'</span>'
				+'<span aria-hidden="true">'+inner+'</span>'
			+'</a>';
		});

		var nexts = form.find('a[class="next-page"]');
	 	var prevs = form.find('a[class="prev-page"]');
	 	var firsts = form.find('a[class="first-page"]');
	 	var lasts = form.find('a[class="last-page"]');

	 	
	 	var select = form.find('input[id="current-page-selector"]');
	 	var textPage = form.find('span[class="tablenav-paging-text"]');
	 	var totalPages = form.find('span[class="total-pages"]')[0].innerHTML;

	 	
	 	//alert('Base: '+base);
	 	var currPage = base[2].match(expr); 
	 	var opts = base[2];
	 	opts = opts.split('&');

	 	$.each(opts, function(key, val) { opts[key] = val.split('='); } );

	 	currPage = ( (currPage === null) ? 1 : parseInt(currPage[3]) );

	 	var nextPage = (currPage + 1);
	 	var prevPage = (currPage - 1);
	 	nextPage = Math.min(totalPages, nextPage);
	 	prevPage = Math.max(1, prevPage);

	 	select.val(currPage);
	 	select.attr('name', 'cwd_paged_'+type);
		textPage[1].innerHTML = currPage + ' of ' +totalPages;

	 	//$.each(nexts, function(key,val) { alert(key+': '+val); nexts[key].href.replace(/\&paged=[0-9]+/, ''); });
	 	$.each( nexts, function(key,val) { 
	 		var str = nexts[key].href;
	 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
	 		var matches = str.match(expr);
	 		nexts[key].href = ( matches !== null ? matches[1]+matches[3] : str);
	 	} );
	 	$.each(nexts, function(key,val) { nexts[key].href += '&cwd_paged_'+type+'='+nextPage; });


	 	$.each(prevs, function(key,val) { 
	 		var str = prevs[key].href;
	 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
	 		var matches = str.match(expr);
	 		prevs[key].href = (matches !== null ? matches[1]+matches[3] : str);
	 	});
	 	$.each(prevs, function(key,val) { prevs[key].href += '&cwd_paged_'+type+'='+prevPage; });


	 	$.each(firsts, function(key,val) { 
	 		var str = firsts[key].href;
	 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
	 		var matches = str.match(expr);
	 		firsts[key].href = (matches !== null ? matches[1]+matches[3] : str);
	 	});
	 	$.each(firsts, function(key,val) { firsts[key].href += '&cwd_paged_'+type+'='+1; });


	 	$.each(lasts, function(key,val) { 
	 		var str = lasts[key].href;
	 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
	 		var matches = str.match(expr);
	 		lasts[key].href = (matches !== null ? matches[1]+matches[3] : str);
	 	});
	 	$.each(lasts, function(key,val) { lasts[key].href += '&cwd_paged_'+type+'='+totalPages; });
		
		var sorts = form.find('th');
		//console.log('Sorts: ');
		//console.log(sorts);
		sorts = sorts.filter('.sortable');
		//console.log(sorts);
		//sorts = sorts.find('a'); // NEED???
		//console.log(sorts);


		$.each(sorts, function(key,val) { 
			//console.log('@@@@@@@@');
			//console.log(sorts[key]);
			var a = sorts[key].firstChild;
			//console.log(a);

			
			//var str = sorts[key].href;
			var str = a.href;

			// Remove old sorts from this table type
			var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
			var matches = str.match(expr);
			str = (matches !== null ? matches[1]+matches[4] : str);

			var expr = new RegExp('(.*)(&cwd_order_'+type+'=)(asc|desc)(.*)');
			var matches = str.match(expr);
			str = (matches !== null ? matches[1]+matches[4] : str);



			// Create new sorts
			var expr = new RegExp(/(.*)(&orderby=)([a-zA-z0-9_]+)(.*)/);
			var matches = str.match(expr);
			//alert('');
			//alert('Matches: '+matches);
			str = (matches !== null ? matches[1]+'&cwd_orderby_'+type+'='+matches[3]+matches[4] : str);

			var orderBy = matches[3];


			
			var expr = new RegExp(/(.*)(&order=)(asc|desc)(.*)/);
			var matches = str.match(expr);

			var orders = ['asc', 'desc']; 
			//console.log(orders);


			var order = matches[3]; 
			//console.log('M3');
			//console.log(orderBy);
			
			
			
			for ( var key in opts ) {
				if (opts[key].length > 1 && opts[key][0] === 'cwd_orderby_'+type &&  opts[key][1] === orderBy) {
					//isSorted = opts[key];
					//console.log('FLIPPED!!!');

					//opts[x][0] === 'cwd_order_'+type; get opt[x][1];
					order = orders.filter(x => ![order].includes(x)); // Should we get the flip from the active url and not the href of the sortable columns??? 

					
				}
			}
			
			
			
			//console.log(order);

			
			//alert('Str: ' +str);
			//alert('Matches: '+matches);
			//sorts[key].href = (matches !== null ? matches[1]+'&cwd_order_'+type+'='+matches[3]+matches[4] : str);
			str = (matches !== null ? matches[1]+'&cwd_order_'+type+'='+order+matches[4] : str);
			//alert('Str: ' +str);
			a.href = str;
			//alert(opts);

			

			//Change asc/desc for active orderby col 
			//if (matches[]) {

			//}

		});

	//	alert(typeof(sorts));


	//	var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
	//		var matches = str.match(expr);
	

		var tmp = sorts.find(function (obj) { 
			//var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
			//return obj.href == map_id; 
			return obj.href == 'a';//.href == '(.*)(&cwd_orderby_'+type+'=)(tilt)(.*)';
		});

	//	alert('TMP: ');
	//	alert(tmp);
		//console.log('TMP:');
		//console.log(tmp);


		//sorts = sorts.attr('href');
		//console.log(sorts);
		//console.log(sorts.hasClass('sortable'));
		//sorts = sorts.filter(contains(class=""))

		return true;
	}; // End of cwd_match()



	/*
	 * For Markers Page 
	 */
	 $(function() {	
	 	// load based on specific cwd admin page
	 	var currPage = location.toString().split('?page=')[1];
	 	var expr = /(cwd_maps_markers_edit)(.*)/;
		var matches = currPage.match(expr);
		var base = matches;
		if (matches !== null && typeof(matches[1]) !== 'undefined' && matches[1] === 'cwd_maps_markers_edit') {


			
			
			// Ajax Submit
			/*
			$("#upload_markers_csv").click( function (event) {
				var post_data = $("#cwd-import-markers-form").serialize();
				post_data += "&action=cwd_request&param=import_markers_csv";
				console.log(post_data);

				var file = $("#file")[0].files[0];
				console.log( file );
				console.log($(this));


				var formData = new FormData();
    			//formData.append( 'csv',  file ); 
    			formData.append( 'name', 'cwd_file' );

    			//formData.append( 'action', 'cwd_request' );
    			//formData.append( 'param', 'import_markers_csv' );

    			console.log(formData);

    			$.post(cwd_ajax_url, formData, function(response) {
    				alert(response);
    			});
    		});
    		*/


    		//Intercept direct submit
    		$("#cwd-import-markers-form").on('submit', function(event) {
    			event.preventDefault();
    			var post_data = $("#cwd-import-markers-form").serialize();
    			var expr = /(.*)(marker_import_group=)([0-9]+)(.*)(marker_import_full_name=)([a-zA-z0-9_]+)(.*)/;
				var matches = post_data.match(expr);
				var grp_num = matches[3];
				var grp_full_name = matches[6];
				//post_data += "&action=cwd_request&param=import_markers_csv";
				//alert('FORM INTERCEPTED');
				//console.log(post_data);

				var file = $("#file")[0].files[0];
				/*console.log( file );
				console.log($(this));*/


				var formData = new FormData();
    			formData.append( 'cwd_csv',  file ); 
    			formData.append( 'name', 'cwd_file' );

    			formData.append( 'grp_num', grp_num );
    			formData.append( 'grp_full_name', grp_full_name );

    			formData.append( 'action', 'cwd_request' );
    			formData.append( 'param', 'import_markers_csv' );

    			
    			/*console.log(formData);
    			for (var key of formData) {
    				console.log( key );
    			}*/

    			$.ajax({
				  url: cwd_ajax_url,
				  data: formData,
				  processData: false,
				  contentType: false,
				  type: 'POST',
				  success: function(response){
				    console.log(response);
				    alert(response);
				  }
				});

    			/*$.post(cwd_ajax_url, formData, function(response) {
    				alert(response);
    			});*/

    		});


				


				//submit form the direct method
				//$("#cwd-import-markers-form").trigger('submit');

				/*
				$.post('', 'upload_csv', function(response) {
					alert(response);

				});
				*/


				/*$.post(cwd_ajax_url, post_data, function(response) {
					console.log(response);
					alert('Ajax Success: '+response);

				})*/
			



			$("#download_markers_csv").click( function (event) {
				var post_data = $("#cwd-export-markers-form").serialize();
				var expr = /(.*)(marker_export_group=)([0-9]+)(.*)(marker_export_full_name=)([a-zA-z0-9_]+)(.*)/;
				var matches = post_data.match(expr);
				var grp_num = matches[3];
				var grp_full_name = matches[6];

				post_data += "&action=cwd_request&param=export_markers_csv";

			 	if (grp_num !== '' && grp_full_name !== '') {
				 	$.post(cwd_ajax_url, post_data, function(response) {
				 	
				 		// Validate response???

					 	var encodedUri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(response);
						var link = document.createElement("a");
						link.setAttribute("href", encodedUri);
						link.setAttribute("download", grp_full_name+".csv");
						link.innerHTML= "Download Markers Data";
						document.body.appendChild(link);
						link.click();
					})
				}

			});
				
	


			/*
			 * Rewrite table url links to be specific to table type.
			 */
			var expr = /(.*)(&cwd_paged=)([0-9]+)(.*)/;

			var matches = matches[2].match(expr);

			/*
			// !!! START CWD MATCH !!!
			// Alter Selection Tables by Type so Multiple Tables Work Independently on Same Page
			function cwd_match(type, base) {

				var expr = new RegExp('(.*)(&cwd_paged_'+type+'=)([0-9]+)(.*)');

				var form = $('form[id="cwd-'+type+'-selection-form"]');
				var searchInput = form.find('input[id="search-search-input"]');

				searchInput[0].name =  'cwd_s_'+type;

				var pageNavs = form.find('span[class="pagination-links"]');
				var navBtns = pageNavs.children('span[class="tablenav-pages-navspan"]');

				$.each(navBtns, function(key,val) { 
					var inner = navBtns[key].innerHTML;
					var label;
					switch(inner) {
					  case '«': //'&laquo'
					    label = 'first-page';
					    break;
					  case '‹': //'&lsaquo'
					    label = 'prev-page';
					    break;
					  case '›': //'&rsaquo'
					    label = 'next-page';
					    break;
					  case  '»': //'&raquo'
					    label = 'last-page';
					    break;
					  default:
					  	label = 'error-err';
					} 

					navBtns[key].outerHTML = '<a class="'+label+'" href="" >'
						+'<span class="screen-reader-text">'+label.charAt(0).toUpperCase()+label.slice(1).replace('-',' ')+'</span>'
						+'<span aria-hidden="true">'+inner+'</span>'
					+'</a>';
				});

				var nexts = form.find('a[class="next-page"]');
			 	var prevs = form.find('a[class="prev-page"]');
			 	var firsts = form.find('a[class="first-page"]');
			 	var lasts = form.find('a[class="last-page"]');

			 	
			 	var select = form.find('input[id="current-page-selector"]');
			 	var textPage = form.find('span[class="tablenav-paging-text"]');
			 	var totalPages = form.find('span[class="total-pages"]')[0].innerHTML;

			 	
			 	//alert('Base: '+base);
			 	var currPage = base[2].match(expr); 
			 	var opts = base[2];
			 	opts = opts.split('&');

			 	$.each(opts, function(key, val) { opts[key] = val.split('='); } );

			 	currPage = ( (currPage === null) ? 1 : parseInt(currPage[3]) );

			 	var nextPage = (currPage + 1);
			 	var prevPage = (currPage - 1);
			 	nextPage = Math.min(totalPages, nextPage);
			 	prevPage = Math.max(1, prevPage);

			 	select.val(currPage);
			 	select.attr('name', 'cwd_paged_'+type);
				textPage[1].innerHTML = currPage + ' of ' +totalPages;

			 	//$.each(nexts, function(key,val) { alert(key+': '+val); nexts[key].href.replace(/\&paged=[0-9]+/, ''); });
			 	$.each( nexts, function(key,val) { 
			 		var str = nexts[key].href;
			 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
			 		var matches = str.match(expr);
			 		nexts[key].href = ( matches !== null ? matches[1]+matches[3] : str);
			 	} );
			 	$.each(nexts, function(key,val) { nexts[key].href += '&cwd_paged_'+type+'='+nextPage; });


			 	$.each(prevs, function(key,val) { 
			 		var str = prevs[key].href;
			 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
			 		var matches = str.match(expr);
			 		prevs[key].href = (matches !== null ? matches[1]+matches[3] : str);
			 	});
			 	$.each(prevs, function(key,val) { prevs[key].href += '&cwd_paged_'+type+'='+prevPage; });


			 	$.each(firsts, function(key,val) { 
			 		var str = firsts[key].href;
			 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
			 		var matches = str.match(expr);
			 		firsts[key].href = (matches !== null ? matches[1]+matches[3] : str);
			 	});
			 	$.each(firsts, function(key,val) { firsts[key].href += '&cwd_paged_'+type+'='+1; });


			 	$.each(lasts, function(key,val) { 
			 		var str = lasts[key].href;
			 		var expr = new RegExp(/(.*)(&paged=[0-9]+)(.*)/);
			 		var matches = str.match(expr);
			 		lasts[key].href = (matches !== null ? matches[1]+matches[3] : str);
			 	});
			 	$.each(lasts, function(key,val) { lasts[key].href += '&cwd_paged_'+type+'='+totalPages; });
				
				var sorts = form.find('th');
				console.log('Sorts: ');
				console.log(sorts);
				sorts = sorts.filter('.sortable');
				console.log(sorts);
				//sorts = sorts.find('a'); // NEED???
				//console.log(sorts);


				$.each(sorts, function(key,val) { 
					console.log('@@@@@@@@');
					console.log(sorts[key]);
					var a = sorts[key].firstChild;
					console.log(a);

					
					//var str = sorts[key].href;
					var str = a.href;

					// Remove old sorts from this table type
					var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
					var matches = str.match(expr);
					str = (matches !== null ? matches[1]+matches[4] : str);

					var expr = new RegExp('(.*)(&cwd_order_'+type+'=)(asc|desc)(.*)');
					var matches = str.match(expr);
					str = (matches !== null ? matches[1]+matches[4] : str);



					// Create new sorts
					var expr = new RegExp(/(.*)(&orderby=)([a-zA-z0-9_]+)(.*)/);
					var matches = str.match(expr);
					//alert('');
					//alert('Matches: '+matches);
					str = (matches !== null ? matches[1]+'&cwd_orderby_'+type+'='+matches[3]+matches[4] : str);

					var orderBy = matches[3];


					
					var expr = new RegExp(/(.*)(&order=)(asc|desc)(.*)/);
					var matches = str.match(expr);

					var orders = ['asc', 'desc']; 
					console.log(orders);


					var order = matches[3]; 
					console.log('M3');
					console.log(orderBy);
					
					
					
					for ( var key in opts ) {
						if (opts[key].length > 1 && opts[key][0] === 'cwd_orderby_'+type &&  opts[key][1] === orderBy) {
							//isSorted = opts[key];
							console.log('FLIPPED!!!');

							//opts[x][0] === 'cwd_order_'+type; get opt[x][1];
							order = orders.filter(x => ![order].includes(x)); // Should we get the flip from the active url and not the href of the sortable columns??? 

							
						}
					}
					
					
					
					console.log(order);

					
					//alert('Str: ' +str);
					//alert('Matches: '+matches);
					//sorts[key].href = (matches !== null ? matches[1]+'&cwd_order_'+type+'='+matches[3]+matches[4] : str);
					str = (matches !== null ? matches[1]+'&cwd_order_'+type+'='+order+matches[4] : str);
					//alert('Str: ' +str);
					a.href = str;
					//alert(opts);

					

					//Change asc/desc for active orderby col 
					//if (matches[]) {

					//}

				});

			//	alert(typeof(sorts));


			//	var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
			//		var matches = str.match(expr);
			

				var tmp = sorts.find(function (obj) { 
					//var expr = new RegExp('(.*)(&cwd_orderby_'+type+'=)([a-zA-z0-9_]+)(.*)');
					//return obj.href == map_id; 
					return obj.href == 'a';//.href == '(.*)(&cwd_orderby_'+type+'=)(tilt)(.*)';
				});

			//	alert('TMP: ');
			//	alert(tmp);
				console.log('TMP:');
				console.log(tmp);


				//sorts = sorts.attr('href');
				//console.log(sorts);
				//console.log(sorts.hasClass('sortable'));
				//sorts = sorts.filter(contains(class=""))

				return true;
			}// End of cwd_match()
			// !!! END CWD MATCH !!!
			*/

			cwd_match('map', base);
			cwd_match('group', base);

			//console.log($('a[class="next-page"]') );

			/*alert('Match: '+JSON.stringify(cwd_match('map', base)));


			 var nexts = $('a[class="next-page"]');
			 var prevs = $('a[class="prev-page"]');
			 console.log('Nexts');
			 console.log(nexts);
			 alert(typeof(nexts));
			 */
			// var hrefs = $.each(nexts, function (key, val) { this[key] = val+ '!!!abc!!!'; });
		//	 $.each(nexts, function (key, val) { nexts[key].href = nexts[key].href.replace(/\&paged=[0-9]+/, '') ; /*console.log(nexts[key]);*/ });
		//	 $.each(nexts, function (key, val) { nexts[key].href = nexts[key].href.replace(/\&cwd_paged=[0-9]+/, '' ) ; /*console.log(nexts[key]);*/ });
		//	 $.each(nexts, function (key, val) { nexts[key].href = nexts[key].href += '&cwd_paged='+(nextPage) ; /*console.log(nexts[key]);*/ });
			// $.each(nexts, function (key, val) { nexts[key].href = nexts[key].href.replace('&paged=', '&cwd_paged=') ; /*console.log(nexts[key]);*/ });
			// $.each(nexts, function (key, val) { nexts[key].href = nexts[key].href.replace('&paged=', '&cwd_paged=') ; /*console.log(nexts[key]);*/ });

		//	 $.each(prevs, function (key, val) { prevs[key].href = prevs[key].href.replace(/\&paged=[0-9]+/, '') ; /*console.log(nexts[key]);*/ });
		//	 $.each(prevs, function (key, val) { prevs[key].href = prevs[key].href.replace(/\&cwd_paged=[0-9]+/, '' ) ; /*console.log(nexts[key]);*/ });
		//	 $.each(prevs, function (key, val) { prevs[key].href = prevs[key].href += '&cwd_paged='+(prevPage) ; /*console.log(nexts[key]);*/ });

			// $.each(prevs, function (key, val) { prevs[key].href = prevs[key].href.replace('&paged=', '&cwd_paged=') ; /*console.log(nexts[key]);*/ });
			 //alert( JSON.stringify( hrefs ) );
			 //console.log('Hrefs');
			 //console.log(hrefs);

			/*var expr = /(.*)(&paged=)([0-9]+)(.*)/;
			alert(matches[2]);
			var matches = matches[2].match(expr);
			alert(matches);
			var new_next = matches[0];
			alert(new_next);
			alert(matches[2]);
			new_next = new_next.replace(matches[2], '&cwd_paged=');
			alert(new_next);
			nexts.attr('href', new_next);*/

			 //alert(matches.length + JSON.stringify(matches) );
			 //if (matches.length >)
			 //var expr = 

			/*
			 * Save Map Selection for Session to Edit on Marker's Page
			 */
			$(".cwd-edit-action-map-settings-form").click( function(event) {
				var thisLink = $(this);
				var map_id = thisLink.attr('data-map_id');
				var map_data = JSON.parse(cwd_map_data);
				var selectedMap = map_data.find(function (obj) { return obj.id == map_id; } );

				var post_data = "map_selected="+map_id+"&action=cwd_request&param=marker_select_map";
				$.post(cwd_ajax_url, post_data, function(response){
					window.location.reload(true);
				})
			})

			/*
			 * Save Group Selection for Session to Edit on Marker's Page
			 */
			$(".cwd-edit-action-group-settings-form").click( function(event) {

				var thisLink = $(this);
				var groupNum = thisLink.attr('data-group_number');
				var groupName = thisLink.attr('data-group_name');
				
				var post_data = "group_selected="+groupNum+"&action=cwd_request&param=marker_select_group";
				$.post(cwd_ajax_url, post_data, function(response){
					window.location.reload(true);
				}) 
			})




			/* 
			 * Update Marker button - calls on button click by including cwd-form-button in button tag 
			 * NOTE: avoids page refresh of wordpress defined submit_button();
			 */
			$("#cwd-form-button").click(function(){
			 	var post_data = $("#cwd-form-id").serialize()+"&action=cwd_request&param=update_marker";
			 	$.post(cwd_ajax_url, post_data, function(response){
			 		alert(response);
			 	})
			})

			/*
			 * Make Update Location Button for Add Marker Form
			 */
		 	var buttonWrap = $('<div>')
		 	var latLngButton = $('<button>').attr('id', 'cwd-update-location').attr('type', 'button').css('float', 'right').addClass('button button-primary').html('Update Location');
		 	var lngInput = $('input[name="longitude"]');
		 	var latLngWrap = lngInput.parent();
		 	buttonWrap.append(latLngButton)
		 	latLngWrap.append(buttonWrap);




		}//End if page is map
	});//End jQuery function 


	/*
	 * Set up variables for functions called by buttons
	 * Note: if setting up Toggle Button via html on cwd-dynamic-maps-maps-page.php, 
	 * these must defined above the jQuery loop 
	 */
	 var map, markers, markerCluster, userMarker, updateMarker, centerLat, centerLng, overlay, polyline, selectMarker, openInfoWindow, fillForm, declusteredMarker;	 

	 /*
	 * Prepare Table Data for Map
	 */
	$(function () {
		// PHP table data sent from wp_localize_scripts function in class-cwd-dynamic-maps-admin.php 
		if (typeof cwd_php_vars !== 'undefined') {
			markers = JSON.parse(cwd_php_vars);
		}
		else {
			markers = [];
		}
		
	});


	/*
	 * Make Pagination for Table
	 */

	$(function() {

		if (/*markers.length > 0*/ true) {

		 	var numRows = markers.length;
		 	var maxPerPage = 2;
		 	var totalPages = Math.ceil(numRows/maxPerPage);

		 	var wrap = $('.cwd-table-wrap');

		 	var form = $('<form>');
		 	var input = $('<input>').attr('type', 'text').attr('name', 'cwd-marker-filter').attr('placeholder', 'Search...').attr('value', '');
		 	var inputButton = $('<button>').addClass('button button-primary').attr('id', 'cwd-marker-filter-button').attr('type', 'button').html('Filter');

		 	var tableNavTop = $('<div>').addClass('tablenav top');
		 	var leftActions = $('<div>').addClass('alignleft  bulkactions');
		 	var navPages = $('<div>').addClass('tablenav-pages');
		 	var displayNum = $('<span>').addClass('cwd-displaying-num').html(numRows +' item(s)');
		 	var pageLinks = $('<span>').addClass('pagination-links');
		 	var toFirstPage = $('<a>').addClass('tablenav-pages-navspan cwd-first');
		 	var firstSpan = $('<span>').html('&laquo;');
		 	var toBackPage = $('<a>').addClass('tablenav-pages-navspan cwd-back');
		 	var backSpan = $('<span>').html('&lsaquo;');
		 	
		 	var pagingInput = $('<span>').addClass('paging-input');
		 	var pageInput = $('<input>').addClass('current-page').attr('id', 'cwd-current-page-selector').attr('type', 'text').attr('size', '1').val(1);
		 	var pagingText = $('<span>').addClass('tablenav-paging-text').html('of ');
		 	var maxPageText = $('<span>').addClass('cwd-total-pages').html(totalPages);

		 	var toLastPage = $('<a>').addClass('tablenav-pages-navspan cwd-last');
		 	var lastSpan = $('<span>').html('&raquo;'); 
		 	var toNextPage = $('<a>').addClass('tablenav-pages-navspan cwd-next');
		 	var nextSpan = $('<span>').html('&rsaquo;');

		 	//var tableNavBottom = $('<div>').addClass('tablenav bottom');

		 		toFirstPage.append(firstSpan);
		 	pageLinks.append(toFirstPage);
		 		toBackPage.append(backSpan);
		 	pageLinks.append(toBackPage);
		 			
		 		pagingInput.append(pageInput);
		 			pagingText.append(maxPageText);
		 		pagingInput.append(pagingText);
		 	pageLinks.append(pagingInput);

		 		toNextPage.append(nextSpan);
		 	pageLinks.append(toNextPage);
		 		toLastPage.append(lastSpan);
		 	pageLinks.append(toLastPage);

		 	navPages.append(displayNum);
		 	navPages.append(pageLinks);

		 			form.append(input);
		 			form.append(inputButton);
				leftActions.append(form);
		 	tableNavTop.append(leftActions);
		 	tableNavTop.append(navPages);
		 	wrap.append(tableNavTop);
		}
	})

	/*
	 * Fill Javascript Table 
	 */
	 $(function () {
	 	var wrap = $('.cwd-table-wrap');

	 	var table = $('<table>').addClass('widefat striped marker-sorter');
	 	var tHead = $('<thead>'); 
	 	var tBody = $('<tbody>'); 
	 	var tFoot = $('<tfoot>'); 
	 	var numRows = markers.length;
	 	var firstRow = markers[0];
	 	var numCols = 0;
	 	var colNames = Array();
	 	var row, th, a, sLabel, sArrow, td, x, y, i, j;
		for (x in firstRow) if (firstRow.hasOwnProperty(x)) {++numCols; colNames.push(x);}

		//Fill tHead & tFoot
	 	row = $('<tr>');
	 	for (y=0; y<numCols; ++y) {
	 		var colName = colNames[y];
	 		th = $('<th>').attr('data-cwd-col', colName).attr('scope', 'col').addClass('sortable asc cwd-sortable-col');
	 		if ($.isNumeric(firstRow[colName])) {
	 			th.addClass('cwd_number');
	 		}
	 		a = $('<a>');
	 		
	 		if (colName == 'id') {
	 			sLabel = $('<span>').text( colName.toUpperCase() ); // display id as ID
	 		}
	 		else {
				sLabel = $('<span>').text( colName.replace(/_/g, ' ') ); // remove underline from column_name
	 		}
	 		sArrow = $('<span>').addClass('sorting-indicator');
	 		a.append(sLabel).append(sArrow);
	 		th.append(a);
	 		row.append(th);
	 	}
	 	var rowClone = row.clone();
	 	tHead.append(row);
	 	tFoot.append(rowClone);
	 	table.append(tHead);

	 	//Fill tBody
	 	for (i=0; i<numRows; ++i) {
	 		row = $('<tr>');
	 		row.addClass('cwd-match'); //Give ok for pagination to all rows
	 		row.attr('id', '"cwd-row-'+i+'"');
	 		row.hide();

	 		for ( j=0; j<numCols; ++j) {
	 			var colName = colNames[j];
 				td = $('<td>').attr('data-cwd-col', colName);

 				/*var linkWrap = $('<a>').addClass('cwd-link-marker').text(markers[i][colName]);
 				td.append(linkWrap);
 				*/

 				//make link to marker on map
 				if (j == 0) {
 					//td.html('<a>'+markers[i][colName]+'</a>');
 					var linkWrap = $('<a>').addClass('cwd-link-marker').text(markers[i][colName]);
 					td.append(linkWrap);
 				}
 				else {
 					td.text(markers[i][colName]);
 				}

	 			row.append(td);	
	 		}
	 		table.prepend(row);
	 	}
	 	table.append(tFoot);

	 	wrap.append(table);
	 });

	/*
	 * Table Actions
	 */
	$(function () {
		/*var currPage = 1; 
		var maxPerPage = 3;
		var rows = $('div.cwd-table-wrap table tbody tr');
		var matchedRows = rows;
		var numRows = matchedRows.length;
		var totalPages = Math.ceil(numRows/maxPerPage);
		
		

		//console.log('ROWS: ')
		//console.log(rows);

		// Make Stats Div
		var statsDiv = $('<div>');
		var markerDiv = $('#cwd-markers-div');
		statsDiv.attr('id', 'stats-div');
		markerDiv.prepend(statsDiv);
		var input = $('input[id="cwd-current-page-selector"]');
		var maxPageText = $('span[class="cwd-total-pages"]');
		var displayNum = $('span[class="cwd-displaying-num"]');

		*/

		var addPageButtons;

		var rows = $('div.cwd-table-wrap table tbody tr');
		var input = $('input[id="cwd-current-page-selector"]');
		var maxPageText = $('span[class="cwd-total-pages"]');
		var displayNum = $('span[class="cwd-displaying-num"]');
		var maxPerPage = 3;
		var matchedRows;
		var numRows;
		var totalPages;
		var currPage;
		


		/*
	 	* Pagination Functions
	 	*/
	 	function paginate() {
			
			rows.hide();
			matchedRows = rows.filter('.cwd-match');
			numRows = matchedRows.length;
			totalPages = Math.ceil(numRows/maxPerPage);
			currPage = 1;
			if (totalPages == 0) {
				currPage = 0;
			}
			var bound = Math.min(maxPerPage, numRows)
		
			updatePageStats();


			/*console.log('MATCHED: ')
			console.log(matchedRows);
			*/


			
			addPageButtons = (function() {
				$('.cwd-next').click(function(event) {
					if(currPage < totalPages) {
						currPage++;
						updatePageStats();
					}

				});

				$('.cwd-back').click(function(event) {
					if(currPage > 1) {
						currPage--;
						updatePageStats();
					}
					
				});

				input.on("keyup", function(event) {
					var newPage = $(this).val();
					//Check if newPage is an int
					if ( (Math.floor(newPage) == newPage) && (newPage > 0) && (newPage <= totalPages) )  {
							currPage = newPage;
							updatePageStats();
					}
					//Allow user to remove Current Page #
					else if (newPage == '') {

					}
					else {
						//$(this).val(currPage);
					}
					
				})

				input.on("focusout", function(event) {
					var newPage = $(this).val();
					if ( (newPage == '') | (newPage <= 0) | (newPage > totalPages) | (Math.floor(newPage) != newPage) ) {
						$(this).val(currPage);
					} 
				})

				$('.cwd-first').click(function(event) {
					if(currPage != 1) {
						currPage = 1;
						updatePageStats();
					}
				});

				$('.cwd-last').click(function(event) {
					if(currPage != totalPages) {
						currPage = totalPages;
						updatePageStats();
					}

				});
			})//AddPageButtons
			
						

			function updatePageStats() {
				rows.hide();
				for (var i=0; i<maxPerPage; i++) {
					$(matchedRows[(currPage*maxPerPage - maxPerPage + i)]).show()
					if ( (currPage*maxPerPage - maxPerPage + i ) >= numRows ){
						break;
					}
				}

				input.val(currPage);
				maxPageText.html(totalPages);
				displayNum.html(numRows+' item(s)');

				/*statsDiv.html(
					'<p>Page: ' + currPage + 
					'</p><p>numRows: ' + numRows +

					'</p><p>maxPerPage: ' + maxPerPage +
					'</p><p>totalPages: ' + totalPages 
					);
					*/

			};

		}//End Paginate

		paginate();
		addPageButtons();		

		/*
		 * Filter Markers
		 */
		$("#cwd-marker-filter-button").click( function(event){
			var filter = $("input[name='cwd-marker-filter']").val().toLowerCase();
		//	$(".marker-sorter tbody tr").filter(function() {
		//		$(this).toggle($(this).text().toLowerCase().indexOf(filter) > -1)
		//	})

			$(".marker-sorter tbody tr").each( function() {
				
				if( $(this).text().toLowerCase().indexOf(filter) > -1) {
					//Match
					//$(this).show();
					$(this).addClass('cwd-match').removeClass('cwd-no-match');

				}
				else {
					//$(this).hide();
					$(this).addClass('cwd-no-match').removeClass('cwd-match');
				}

			})
			paginate();
		});
		

		/*
		 * Sort Javascript Table
		 */
		$(".cwd-sortable-col").click(function(event) {
			var th = $(this);
			var colName = th.data('cwd-col');
			var table = th.parent().parent().parent();
			var tableBody = table.find("tbody");
			var tableRows = tableBody.children("tr");
			var ths = table.find("th[data-cwd-col="+colName+"]");
			var siblings = table.find("th[data-cwd-col!="+colName+"]");
			var isReverse = 1;
			var desc = th.hasClass('desc');
			if (desc) {
				ths.removeClass('desc').addClass('asc');
			}
			else {
				ths.removeClass('asc').addClass('desc');
				isReverse = -1;
			}

			var isNum = th.hasClass('cwd_number');
			
			tableRows.sort( function(a,b) {
			 	var aData = $(a).find("td[data-cwd-col="+colName+"]").html().toLowerCase();
		 		var bData = $(b).find("td[data-cwd-col="+colName+"]").html().toLowerCase();
		 		if (colName == 'id') {
		 			aData = $(a).find("td[data-cwd-col="+colName+"] a").html().toLowerCase();
		 			bData = $(b).find("td[data-cwd-col="+colName+"] a").html().toLowerCase();
		 		}
		 		var ret = 0;
		 		if (isNum) {
		 			ret = aData - bData;
		 		}
		 		else {
				 	if (aData > bData) {
				 		ret = 1;
				 	}
				 	if (aData < bData) {
				 		ret = -1;
				 	}
				 }
				 return ret * isReverse;
			 });
			tableRows.detach().appendTo(tableBody);
			rows = tableRows;
			ths.removeClass('sortable').addClass('sorted');
			siblings.removeClass('sorted asc').addClass('sortable desc');


			paginate();
		})



	}) //End of Pagination Functions 



	/*
	 * Sort Javascript Table
	 */

	 /*
	$(function () {
		$(".cwd-sortable-col").click(function(event) {
			var th = $(this);
			var colName = th.data('cwd-col');
			var table = th.parent().parent().parent();
			var tableBody = table.find("tbody");
			var tableRows = tableBody.children("tr");
			var ths = table.find("th[data-cwd-col="+colName+"]");
			var siblings = table.find("th[data-cwd-col!="+colName+"]");
			var isReverse = 1;
			var desc = th.hasClass('desc');
			if (desc) {
				ths.removeClass('desc').addClass('asc');
			}
			else {
				ths.removeClass('asc').addClass('desc');
				isReverse = -1;
			}

			var isNum = th.hasClass('cwd_number');
			
			tableRows.sort( function(a,b) {
			 	var aData = $(a).find("td[data-cwd-col="+colName+"]").html().toLowerCase();
		 		var bData = $(b).find("td[data-cwd-col="+colName+"]").html().toLowerCase();
		 		var ret = 0;
		 		if (isNum) {
		 			ret = aData - bData;
		 		}
		 		else {
				 	if (aData > bData) {
				 		ret = 1;
				 	}
				 	if (aData < bData) {
				 		ret = -1;
				 	}
				 }
				 return ret * isReverse;
			 });
			tableRows.detach().appendTo(tableBody);
			ths.removeClass('sortable').addClass('sorted');
			siblings.removeClass('sorted asc').addClass('sortable desc');
		})
	});
	*/

	/*
	 * Search Filter Javascript Table
	 */
	/*
	$(function () {
		
		$("#cwd-marker-filter-button").click( function(){
			var filter = $("input[name='cwd-marker-filter']").val().toLowerCase();
			console.log(filter);
		//	$(".marker-sorter tbody tr").filter(function() {
		//		$(this).toggle($(this).text().toLowerCase().indexOf(filter) > -1)
		//	})

			$(".marker-sorter tbody tr").each( function() {
				
				if( $(this).text().toLowerCase().indexOf(filter) > -1) {
					//Match
					$(this).show();
					$(this).addClass('cwd-match').removeClass('cwd-no-match');

				}
				else {
					$(this).hide();
					$(this).addClass('cwd-no-match').removeClass('cwd-match');
				}


			})
		})
		

	})
	*/


	

	/* MERGE SORT???

	// Split the array into halves and merge them recursively 
	function mergeSort (arr) {
	  if (arr.length === 1) {
	    // return once we hit an array with a single item
	    return arr;
	  }

	  const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
	  const left = arr.slice(0, middle) // items on the left side
	  const right = arr.slice(middle) // items on the right side

	  return merge(
	    mergeSort(left),
	    mergeSort(right)
	  )
	}

	// compare the arrays item by item and return the concatenated result
	function merge (left, right) {
	  let result = []
	  let indexLeft = 0
	  let indexRight = 0

	  while (indexLeft < left.length && indexRight < right.length) {
	    if ( left[indexLeft] < right[indexRight] ) {
	      result.push(left[indexLeft])
	      indexLeft++
	    } else {
	      result.push(right[indexRight])
	      indexRight++
	    }
	  }

	  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
	}*/


	/*
	 * Give Table Entry Links Actions on the Map
	 */

	 $(function () {
		$(".cwd-link-marker").click( function(event) {
			var a = $(this);
			var sibs = a.parent().siblings();
			//console.log(sibs);
			//console.log($(this));
			//console.log(markerCluster);
			//console.log(markerCluster.markers_)
			//console.log(a);
	
			//var selectedMarker = markerCluster.markers_.find(function (obj) { return obj.cwd_id == a.text(); });
			var selectedMarker = markerCluster.getMarkers().find(function (obj) { return obj.cwd_id == a.text(); } )

			function selectMarker() {
				// check if marker is in a cluster
			
				//console.log('*** Selected Marker ***');
				//console.log(selectedMarker);
				//console.log(selectedMarker.isAdded);

				// if marker hasn't been processed by cluster b/c so out of frame, jump there and refresh 
				if(selectedMarker.isAdded == false) {
					map.setCenter(selectedMarker.getPosition());
					//markerCluster.redraw();
					//markerCluster.resetViewport();
					markerCluster.repaint();
				}

				var onMap = selectedMarker.map;
				if (onMap != null) {
					new google.maps.event.trigger(selectedMarker, 'click');
					map.setCenter(selectedMarker.getPosition());
				} 
				else {
					/*
					map.setZoom(map.getZoom() + 1);
					map.setCenter(selectedMarker.getPosition());
					*/
					
					//console.log('*** Get Cluster *** ');

					var thisCluster = markerCluster.getMarkersCluster(selectedMarker);
					//console.log(thisCluster);

					//console.log('2nd in Clusters Markers');

					var selectedMarkerData = markers.find(function (obj) { return obj.id == selectedMarker.cwd_id } );
					fillForm(selectedMarkerData);

					if (userMarker !=null) {
						userMarker.setMap(null);
						userMarker = null;
					}

					//Click this marker's CLuster
					google.maps.event.trigger(markerCluster, 'clusterclick', thisCluster);
				}
	
			};

			selectMarker();
			
			/*fillForm(selectedMarkerData);
			userMarker.setMap(null);
			userMarker = null;*/
			 
		})
	})

	/*
	 * Fill Form from Table/Map Selection
	 */
	fillForm = (function(marker) {
		
		var thisForm = $('#cwd-form-id')
		thisForm.trigger('reset');

		// Reset hidden image input and image src 
		var hiddens = thisForm.find('input[id="process_custom_images"]');
		var imgs = thisForm.find('img[id="cwd-img-upload"]');
		imgs.attr('src', cwd_plugins_url + '/cwd-dynamic-maps/public/img/camera-icon.svg');
		hiddens.val('');

		//console.log(marker);
		$('#cwd-form-id input[name="id"]').val('');
		if (marker.hasOwnProperty('id')) { 
			$('#update-marker-form-label').html('Edit Marker-' +marker.id);
			// Delete Markers
			$('#cwd-delete-marker-wrap').html('<button id="cwd-delete-marker" type="button" class="button button-secondary cwd-right">Delete Marker</button>');
			
			$('#cwd-delete-marker').click(function () {
				var delId = $("#cwd-form-id").find('div[class="cwd-hidden"] input[name="id"]').val();
				var post_data = "&action=cwd_request&param=delete_marker&marker_id="+delId;
				var check = confirm("Are you sure you want to delete marker: "+delId);

				if (check) {
				 	$.post(cwd_ajax_url, post_data, function(response){
				 		alert(response);
				 	});
			 	}
			 	else {
			 		alert('Deletion was aborted.');
			 	}
			});
		}
		else {
			$('#update-marker-form-label').html('Add Marker');
			$('#cwd-delete-marker-wrap').html('');
		}

		for (var property in marker) {
		    if (marker.hasOwnProperty(property)) {
		    	var input = $("[name='"+property+"']");
		    	input.val(marker[property]);
		    	if ( input[0].id == 'process_custom_images') {
		    		if (marker[property] === '') {
		    			input.prev().attr('src', cwd_plugins_url + '/cwd-dynamic-maps/public/img/camera-icon.svg');
		    		}
		    		else {
		    			//input.prev().attr('src', marker[property]);
		    			input.prev().attr('src', cwd_base_url+marker[property]);

		    		}
		    	}
		    }
		}
	});

	/*
	 * Update User Marker if edit the input box
	 */
	 $(function () {
		 $("#cwd-update-location").click(function(){
		 	var coords = { lat: parseFloat($("input[name='latitude']").val()), lng: parseFloat($("input[name='longitude']").val()) };
		 	updateMarker(coords);
			//map.setCenter(userMarker.getPosition());

		 })
	 })


	/*
	 * Set Up the Buttons for the Map
	 */
	function OverlayButton(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');

		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '2px';
		//controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		//controlUI.style.boxShadow = '0 2px 4px rgba(0,0,0,.2)';
		controlUI.style.boxShadow = ' 0px 1px 4px -1px rgba(0, 0, 0, 0.3)';
		controlUI.style.cursor = 'pointer';
		//controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to Toggle Overlay';

		controlUI.style.marginTop = '10px';
		controlUI.style.marginRight = '10px';
		controlUI.style.float = 'right';

		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.classList.add("cwd-btn-opacity");
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '18px';
		controlText.style.lineHeight = '36px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Overlay';
		controlUI.appendChild(controlText);

		// Setup the click event listeners
		controlUI.addEventListener('click', function() {
		  toggleOverlay();
		});

	}

	function PolylineButton(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '2px';
		controlUI.style.boxShadow = ' 0px 1px 4px -1px rgba(0, 0, 0, 0.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to Toggle Polyline';

		controlUI.style.marginTop = '10px';
		controlUI.style.marginRight = '10px';
		controlUI.style.float = 'right';

		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		//controlText.attr('class', 'cwd-btn-opacity');
		controlText.classList.add("cwd-btn-opacity");
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '18px';
		controlText.style.lineHeight = '36px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Polyline';
		controlUI.appendChild(controlText);

		// Setup the click event listeners
		controlUI.addEventListener('click', function() {
		  togglePolyline();
		});

	}

    function HomeButton(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '2px';
		//controlUI.style.boxShadow = '0 2px 2px rgba(0,0,0,.2)';
		controlUI.style.boxShadow = ' 0px 1px 4px -1px rgba(0, 0, 0, 0.3)';
		controlUI.style.boxSizing = 'content-box';
		controlUI.style.cursor = 'pointer';
		//controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to Center Map';

		controlUI.style.marginTop = '10px';
		controlUI.style.marginRight = '10px';
		controlUI.style.float = 'right';
		//controlUI.style.backgroundImage = 'url('+cwd_plugins_url+'/cwd-dynamic-maps/public/img/home_icon.png)';
		controlUI.style.height = '36px';
		controlUI.style.width = '36px';

		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.innerHTML = '<img  class="cwd-map-home-button cwd-btn-opacity" src="'+cwd_plugins_url+'/cwd-dynamic-maps/admin/img/home_icon.png" >';
		controlUI.appendChild(controlText);

		// Setup the click event listeners
		controlUI.addEventListener('click', function() {
		  recenterMap();
		});

	} // End NewControlButton



	/*
	 * Set Up the Map
	 */
	function initMap() {
		var allMaps = JSON.parse(cwd_map_data);
		//console.log(allMaps);
		//console.log(marker_selected_map_id);
		var map_options = allMaps.find(function (obj) { return obj.id == marker_selected_map_id } );

		//var map_options = JSON.parse(cwd_map_options);
		centerLat = parseFloat(map_options['centerLat']);
		centerLng = parseFloat(map_options['centerLng']);


		var southBound = parseFloat(map_options['southBound']);
		var westBound = parseFloat(map_options['westBound']);
		var northBound = parseFloat(map_options['northBound']);
		var eastBound = parseFloat(map_options['eastBound']);

		var options = {

				zoom: parseInt(map_options['zoom']),
				//minZoom: parseInt(map_options[0]['minZoom']),
				//maxZoom: parseInt(map_options[0]['maxZoom']),
				center: { lat: centerLat, lng: centerLng },
				mapTypeId: map_options['mapTypeId'],
				tilt: parseInt(map_options['tilt']),
				heading: parseInt(map_options['heading']),
				/*restriction: {
		        	latLngBounds: { north: northBound,
        							south: southBound,
        							west: westBound,
        							east: eastBound,
        			},
		        	strictBounds: false,
		        },*/
		        mapTypeControlOptions: {
		        	style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
		        	//mapTypeIds: ['roadmap', 'terrain']
		        },

 
		}



		/*var options = {
				
				zoom:18,
				center:{lat:42.306492,lng:-71.530936} 
		}*/

		map = new google.maps.Map(document.getElementById('map-wrap'), options); 


		


		if (map_options['polyline'] !== '' ) {
			var polylineCoordinates = JSON.parse( map_options['polyline'].replace(/;/g, ',') );	
			polyline = new google.maps.Polyline({
			    path: polylineCoordinates,
			    geodesic: false,
			    strokeColor: '#FF0000',
			    strokeOpacity: 1.0,
			    strokeWeight: 2
			});
			polyline.setMap(map);
		}



		
		var oNorth = (map_options['northOverlayBound'] != null ? parseFloat(map_options['northOverlayBound']) : 1.0);
		var oSouth = (map_options['southOverlayBound'] != null ? parseFloat(map_options['southOverlayBound']) : 0.1);
		var oEast = (map_options['eastOverlayBound'] != null ? parseFloat(map_options['eastOverlayBound']) : 1.0);
		var oWest = (map_options['westOverlayBound'] != null ? parseFloat(map_options['westOverlayBound']) : 0.1);

		/*alert(map_options['northOverlayBound'] );
		alert(oNorth);
		alert( typeof(map_options['overlay']) );
		*/

		var overlayBounds = {
			north:oNorth,
			south:oSouth,
			east:oEast,
			west:oWest,
			/*north:42.30712,
			south:42.30590,
			east:-71.53036,
			west:-71.53145*/
		}

		if (map_options['overlay'] != null ) {
			overlay = new google.maps.GroundOverlay(
				//'../wp-content/plugins/cwd-dynamic-maps/admin/img/Boston_1852_wholemap_web.jpg',
				//'../wp-content/plugins/cwd-dynamic-maps/admin/img/ArtTutor_GridPic',
				cwd_base_url + map_options['overlay'],
				overlayBounds, {clickable:false}
				);
			toggleOverlay();
		}


		
		var cluster = [];

		// Loop through markers
		for(var i = 0;i < markers.length;i++){
			// Add marker
			addMarker(markers[i]);
			//console.log(markers[i]);
		}

		

		// Add Marker Function
		function addMarker(m){
			var coords = {lat:parseFloat(m.latitude), lng:parseFloat(m.longitude)};
			var marker = new google.maps.Marker({
				icon: {
					url: '../wp-content/plugins/cwd-dynamic-maps/admin/img/location-pin-curvy-outline.png',
					scaledSize:  new google.maps.Size(20, 20), // scaled size
				},
				position:coords,
				cwd_id:m.id,
				/*cwd_name:m.Name,
				cwd_No:m.Burial_Site_Number,
				cwd_Death:m.Death*/
			});
			cluster.push(marker); // AIDAN!!! REINSTATE THIS AFTER ADDING MARKERS TO HAVE CLUSTER 
			//marker.setMap(map); // REMOVE THIS LINE AND SWAP WITH ABOVE

			//console.log(marker['cwd_id']);

		
			// Check content
			if (true){
				var contents = '';

				if ( cwd_infowindow_display === null || typeof(cwd_infowindow_display[marker_selected_group_id]) === 'undefined' || cwd_infowindow_display[marker_selected_group_id] === '') {			
					// DEFAULT INFOWINDOW DISPLAY
					for (var prop in m) {
					    if (m.hasOwnProperty(prop)) {
					        contents+='<p>'+prop+': '+m[prop]+'</p>';
					    }
					}
				} 
				else {
					// PARSE THROUGH TEMPLATE FOR DATAFIELDS TO INSERT
					contents += cwd_infowindow_display[marker_selected_group_id];

					var expr = /(\$cwd-infowindow-)([a-zA-Z0-9_]+)/gm;
				
					var matches = contents.match(expr);

					if (matches === null) {matches = 0;}

					var markerColTypes = JSON.parse(marker_col_types);

					var imgCols = markerColTypes.filter(function (obj) {return obj.COLUMN_COMMENT === 'img'});

					for (var i=0; i<matches.length; i++) {
						var x = matches[i].split("$cwd-infowindow-")[1];
						var isImgType = imgCols.filter(function (obj) {return obj.COLUMN_NAME === x});

						if ( isImgType.length > 0 &&  m[x] === '' ) {
							//default image
							contents = contents.replace( matches[i], cwd_plugins_url+'/cwd-dynamic-maps/public/img/camera-icon.png' );
						}
						else if( isImgType.length > 0 &&  m[x] !== '' ) {
							//img relative path
							contents = contents.replace( matches[i], cwd_base_url +/*'/'+*/ m[x] );

						}
						else if ( typeof(m[x]) === 'undefined' ) {
							//empty string
							contents = contents.replace( matches[i],  '' );
						}
						else {
							//database cell
							contents = contents.replace( matches[i], m[x] );
						}
					}

				}

				var id = 'cwd-markers-map';
				var infoWindow = new google.maps.InfoWindow({
			    	content: '<div id="cwd-display-topbar-wrap"><button type="button" data-cwd-uid="'+id+'" id="cwd-display-topbar">&boxbox;</button><div class="cwd-infowindow" style="overflow:scroll;"><div style="height:100%; min-width:100%; width:auto; box-sizing:content-box;">'+contents+'</div></div></div>'

				});

		
				marker.addListener('click', function(event) {
					//Close open infoWindows is exist
					if(openInfoWindow) {
						openInfoWindow.close();
					}
					//Open this infoWindow and save as the openInfoWindow
					infoWindow.open(map, marker);
					//Save this infoWindow as the openInfoWindow
					openInfoWindow = infoWindow;

					var thisMarkerData = markers.find(function (obj) { return obj.id == marker.cwd_id; } )
					//console.log('*** The Marker ***');
					//console.log(thisMarkerData);
					fillForm(thisMarkerData);

					// As we fill the form with the newly seleted marker must remove the temporary user marker to not confuse the user
					if (userMarker !=null) {
						userMarker.setMap(null);
						userMarker = null;
						
					}
				});


			}


		} // End addMarker*/

		var mcOptions = { 
							zoomOnClick: false,
							averageCenter: true,
							imagePath: '../wp-content/plugins/cwd-dynamic-maps/admin/img/m'
						};
		markerCluster = new MarkerClusterer(map, cluster, mcOptions);

		//console.log( markerCluster.getMarkers() );


		/*
		 * Listen for Map Click and User Marker There
		 */

    	//Listen for clusterclick
    	google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster, event) {
    		//console.log(cluster.getMarkers()[0]);

    		//console.log('*** EVENT TYPE ***');
    		//console.log(typeof(event));
    		//console.log(event);
    		/*
    		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		 * STOPS THE MAP CLICK EVENT FROM FIRING WHEN CLUSTERCLICK FIRES 
    		 * This way the new marker doesn't get moved into the selected cluster
    		 * INSTEAD: to avoid blocking propogation I check a few properties of map click
    		 * to see if it was made in a cluster object 
    		 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		 */
    		if (event) {
    			event.stopPropagation(); // *** REMOVE FOR MAPS W/OUT ADD MARKER FEATURE ***
    		}
    		
    		//console.log('*** CLUSTER EVENT ***');
    		//console.log(event);
    		//console.log(cluster);

    		//console.log('Its Markers');
    		//console.log(cluster.getMarkers()[0]);

    		if(openInfoWindow) {
				openInfoWindow.close();
			}

			var clustersMarkers = cluster.getMarkers(); 
			var clusterSize = clustersMarkers.length;
			var cluster_ids = []; 
			var clustersMarkersData = [];
			var clusterDescription = '';
			var defaultDisplay = true;

			var id = 'cwd-markers-map';
			


			for (var i=0; i<clusterSize; i++) {
				var customDisplay = '';
				cluster_ids.push(clustersMarkers[i].cwd_id);
				var tmp = markers.find(function (obj) { return obj.id == clustersMarkers[i].cwd_id; });

				if ( cwd_cluster_display === null || typeof(cwd_cluster_display[marker_selected_group_id]) === 'undefined' || cwd_cluster_display[marker_selected_group_id] === '') {		
					customDisplay = '- '+tmp.id +' -';
				}
				else {
					defaultDisplay = false;
					//customDisplay += '<span>SPECIAL TEXT</span>';
					// PARSE THROUGH TEMPLATE FOR DATAFIELDS TO INSERT
					customDisplay += cwd_cluster_display[marker_selected_group_id];

					var expr = /(\$cwd-infowindow-)([a-zA-Z0-9_]+)/gm;
				
					var matches = customDisplay.match(expr);

					if (matches === null) {
						matches = [];
					} 

					for (var j=0; j<matches.length; j++) {
						var x = matches[j].split("$cwd-infowindow-")[1];

						if ( typeof(tmp[x]) === 'undefined' ) {
							//column doesn't exist
							customDisplay = customDisplay.replace( matches[j], '<br><b>ERROR - NO DATA COLUMN: '+x+',<br>IN MARKER GROUP: '+m_group_num+'</b><br>' );
						}
						else {
							//database cell
							customDisplay = customDisplay.replace( matches[j], tmp[x] );
						}
					}
				}	

				clusterDescription += '<a class="cwd-cluster-link" data-cwd-uid="'+id+'" id="'+tmp.id+'" >'+customDisplay+'</a><br>';
			}


			var infoWindow = new google.maps.InfoWindow({
			    	content: '<div class="cwd-cluster-infowindow">'+clusterDescription+'</div>',
			    	maxWidth: 400,
			    	position: cluster.getCenter()
				});
			infoWindow.open(map);
			
			
			openInfoWindow = infoWindow;
			return event;
    		
	    });

		declusteredMarker = null;

	    // Decluster Selected Markers on Link Click
		$(document).on('click', '.cwd-cluster-link', function(event){

    		var thisDiv = $(this);
    		var id = thisDiv.attr('data-cwd-uid');

    		// If exists Add declusteredMarker back into Clusterer 
			if (declusteredMarker != null) {
						declusteredMarker.setMap(null);

						markerCluster.addMarker(declusteredMarker);

						declusteredMarker = null;
			}

    		// NOTE: id is the unique id from the database, not the user defined No.
    		var link_id = $(this).attr('id');
    		
    		declusteredMarker = cluster.find(function (obj) { return obj.cwd_id == link_id } );
    		markerCluster.removeMarker(declusteredMarker);
    		markerCluster.redraw();
    		declusteredMarker.setMap(map);

    		new google.maps.event.trigger(declusteredMarker, 'click');
    		
		});


		// Listen for click on map
		map.addListener('click', function(event) {

			//var tmp = Object.entries(event);

			//console.log(Object.entries(event));

			//check if click is a cluster click
			var tmp = '';
			for ( var prop in event ) {
				console.log( prop);
				if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.className) {
					console.log('-exists 1');
					tmp = event[prop].explicitOriginalTarget.className; 

				}
				else if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.parentNode && event[prop].explicitOriginalTarget.parentNode.className) {
					console.log('-exists 2');
					tmp = event[prop].explicitOriginalTarget.parentNode.className;

				}
				else {
					console.log('--NULL');
				}
			}

			// update if no cluster click
			if (tmp.substring(0,7) == 'cluster') {

			}
			else {
				updateMarker(event.latLng);
				updateLabel(event.latLng);
			}
			
			
			//console.log('*** EVENT ***');
			//console.log(event);

			//console.log(event.ta.explicitOriginalTarget.className);
			//console.log(event.ta.explicitOriginalTarget.parentNode.className);
			

			/*
			console.log(event);
			console.log(event.target);
			console.log(event.xa.explicitOriginalTarget);
			console.log(event.srcElement);
			console.log(event.click);

			var A = event.ta.explicitOriginalTarget.className;
			var B = event.ta.explicitOriginalTarget.parentNode.className;
			//(A.substring(0,7) == 'cluster') | (B.substring(0,7) == 'cluster')

			// Check these event properties and do nothing if appears to be a map click made on a cluster object
			if ( A ) {
				if (A.substring(0,7) == 'cluster') { 
				}
			}
			else if ( B ) {
				if ( B.substring(0,7) == 'cluster') {
				}
			}
			else {
			
				updateMarker(event.latLng);
				updateLabel(event.latLng);
			}
			*/
			
			/*
			updateMarker(event.latLng);
			updateLabel(event.latLng);
			*/
		});


		// Close infowindows on zoom_change
		map.addListener('zoom_changed', function() {
        	if (openInfoWindow) {
        		openInfoWindow.close();
        	}
    	});


		function updateLabel(coords) {
			var marker = {latitude:coords.lat, longitude:coords.lng};
			fillForm(marker);
		};

		updateMarker = (function(coords) {			
			if (userMarker == null ) {
				var icon = {
					//url:'../wp-content/plugins/cwd-dynamic-maps/admin/img/33622.svg', 
					url: '../wp-content/plugins/cwd-dynamic-maps/admin/img/location-pin-curvy-outline.png',
					scaledSize:  new google.maps.Size(40, 40), // scaled size
				} 

				userMarker = new google.maps.Marker({ 
					position:coords, 
					icon: icon,
					draggable: true
				});
				//markerCluster.addMarker(userMarker); // add marker with clustering
				userMarker.setMap(map); // add marker w/o clustering

				userMarker.addListener('dragend', function(event) {
					updateLabel(event.latLng)
				});

			}
			else {
				userMarker.setPosition(coords);
			}

		});




		// Add Custom Button(s)
		// Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var newControlDiv = document.createElement('div');
        
        if ( typeof(overlay) !== 'undefined' ) {
        	var newOverlayBtn = new OverlayButton(newControlDiv, map);
        }

        if ( typeof(polyline) !== 'undefined' ) {
        	var newPolylineBtn = new PolylineButton(newControlDiv, map);
        }

        var newHomeBtn = new HomeButton(newControlDiv, map);


        var myDiv = $('#floating-panel')

        newControlDiv.index = 1;
        newControlDiv.style.right = '50px';
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(newControlDiv);


	} // End initMap

	
	function toggleOverlay() {
		if ( typeof(overlay) !== 'undefined' ) {
			if ( overlay.getMap() ) {
			overlay.setMap(null);
			}
			else {
				overlay.setMap(map);
			}
		}
	};

	function togglePolyline() {
		if ( typeof(polyline) !== 'undefined' ) {
			if ( polyline.getMap() ) {
				polyline.setMap(null);
			}
			else {
				polyline.setMap(map);
			}
		}
	};

	function recenterMap() {
        map.setCenter(new google.maps.LatLng(centerLat, centerLng));
    };



	// Get Map
	if (typeof google === 'object' && typeof google.maps === 'object') {
    	$(initMAP);
	} 
	else {
	     $.getScript('https://maps.googleapis.com/maps/api/js?key='+cwd_api_key+'&language=en', function(){
	         if( typeof marker_selected_map_id !== 'undefined' && document.getElementById('map-wrap') !== null ) {
	         	$(initMap);
	         }
	     });
	}
	// Enqueued markercluster.js 
	//$.getScript('../wp-content/plugins/cwd-dynamic-maps/admin/js/markerclusterer.js', function(){ });


	 

	/*
	 * Calls on submitting form from by including id="cwd-form-id" in form tag
	 * NOTE: notice the use of $ instead of jQuery  
	 */

	/*
	$(function () {
		 $("#cwd-form-id").submit(function(){
		 	//alert("Form Submitted");
		 	$('#cwd_markers_div').html("Hello World!");

		 })
	})
	*/



})( jQuery );

/*
 * Calls on submitting form by including onsubmit="js_markers_form() in form tag
 * NOTE: notice the use of jQuery instead of $  
 */

/*
function js_markers_form () {
	//alert("Form Submitted");
	jQuery('#cwd_markers_div').html("Hello World!");

}
*/
	



