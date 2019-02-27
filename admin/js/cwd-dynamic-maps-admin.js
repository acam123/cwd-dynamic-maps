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
	 * Select Map for Map Settings Form
	 */
	$(function() {

		$(".cwd-edit-action-map-settings-form").click( function(event) {
			var thisLink = $(this);
			var map_id = thisLink.attr('data-map_id');
			var map_data = JSON.parse(cwd_map_data);
			var selectedMap = map_data.find(function (obj) { return obj.id == map_id; } );

			// Fill Map Form
			var map_settings_table = $("#map-settings-form table");	
			var td_map_title = map_settings_table.find('th[id="title"] h1').text('Edit Map Settings');

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
			var td_map_north_bound = map_settings_table.find('td[id="north_bound"] input').val( selectedMap['northBound'] );
			var td_map_east_bound = map_settings_table.find('td[id="east_bound"] input').val( selectedMap['eastBound'] );
			var td_map_south_bound = map_settings_table.find('td[id="south_bound"] input').val( selectedMap['southBound'] );
			var td_map_west_bound = map_settings_table.find('td[id="west_bound"] input').val( selectedMap['westBound'] );
			var td_map_polyline = map_settings_table.find('td[id="polyline"] input').val( selectedMap['polyline']);//.replace(/\\/g, '') );
		})

	});

	/*
	 * Select Group for Marker cols Edit Form
	 */

	 $(function() {	
		$(".cwd-edit-action-group-settings-form").click( function(event) {

			var map_id = 1;
			var thisLink = $(this);
			var groupNum = thisLink.attr('data-group_number');
			
			// Update Marker Cols Form
			var marker_cols_form = $("#cwd-marker-cols-update-form");	
			var marker_hidden_input = marker_cols_form.find('input[name="marker_group"]').val(groupNum);
			var plus_minus = $("#col-name-plus-minus").css("visibility", "visible");
			var update_cols_button = $("#cwd-cols-form-button").css("visibility", "visible");
			var col_name_form_tbody = $("#cwd-tbody-col-name-form").empty();


			var post_data = "marker_group="+groupNum+"&action=cwd_request&param=select_group";
			$.post(cwd_ajax_url, post_data, function(response){
		 		col_name_form_tbody.append(response);

		 		// Add Delete Functionality (NOTE: must add after delivering the html for the buttons)
			 	$(".cwd_options_remove_table_col_button").click(function(event) {
			 		var input = $(this).parent().siblings().find('input');
			 		var name = input.attr('name');

			 		if ($(this).val() == 'Delete') {
				 		name = name.split("cwd_form_data_curr_cols_")[1];
				 		var res = confirm("Are you sure you want to delete "+name);

						if (res) {
							alert('This column will be permanently deleted from the database when you click save');
							$(this).parent().parent().css('background-color', 'red');
							$(this).val('Undo');
				 			var newName = "cwd_form_data_delete_cols_";
				 			newName += name;
				 			input.attr('name', newName);
				 		}
				 	}
				 	else {
				 		name = name.split("cwd_form_data_delete_cols_")[1];
				 		$(this).parent().parent().css('background-color', '');
				 		$(this).val('Delete');
				 		var newName = "cwd_form_data_curr_cols_";
				 		newName += name;
				 		input.attr('name', newName);
				 	}
		 		})// End of action on .cwd_options_remove_table_col_button

		 	})// End of $.post(...
		})// End of form action on .cwd-edit-action-group-settings-form
	});//End jQuery fuction 


	/* 
	 * Update Map button - calls on button click by including cwd-map-form-button in button tag 
	 * NOTE: avoids page refresh of wordpress defined submit_button();
	 */
	$(function () {
		 $("#cwd-map-form-button").click(function(){
		 	var post_data = jQuery("#map-settings-form").serialize()+"&action=cwd_request&param=update_map";
		 	$.post(cwd_ajax_url, post_data, function(response){
		 		alert(response);
		 		window.location.reload(true);
		 		$(this).scrollTop(0);

		 	})

		 })
	});


	/* 
	 * Update Marker button - calls on button click by including cwd-form-button in button tag 
	 * NOTE: avoids page refresh of wordpress defined submit_button();
	 */
	$(function () {
		 $("#cwd-form-button").click(function(){
		 	var post_data = jQuery("#cwd-form-id").serialize()+"&action=cwd_request&param=update_marker";
		 	$.post(cwd_ajax_url, post_data, function(response){
		 		alert(response);
		 	})

		 })
	});


	/* 
	 * Update Cols for Marker button - calls on button click by including cwd-cols-form-button in button tag 
	 * NOTE: avoids page refresh of wordpress defined submit_button();
	 */
	$(function () {
		 $("#cwd-cols-form-button").click(function(){
		 	var post_data = jQuery("#cwd-marker-cols-update-form").serialize()+"&action=cwd_request&param=update_marker_cols";
		 	$.post(cwd_ajax_url, post_data, function(response){
		 		alert(response);
		 		window.location.reload(true);
		 		window.scrollTo(0,0);

		 	})

		 })
	});






	/*
	 * Add/Remove Input Fields Dynamically to form to set up Table Cols
	 */
	 $(function () {
	 	$("#cwd_options_add_input_button").click(function() {
	 		var tbody = $('#cwd-tbody-col-name-form');
	 		var count = $('#cwd-tbody-col-name-form tr').length;
	 		var tr = $('<tr>');
	 		var td = $('<td>');
	 		//Make the name attribute iterated off of the last number
	 		var input = $('<input>').addClass("regular-text").attr('type', 'text').attr('name', 'cwd_form_data_add_cols_'+(count++)); 

	 		td.append(input);
	 		tr.append(td);
	 		tbody.append(tr);
	 		
	 	})


	 	$("#cwd_options_remove_input_button").click(function() {
	 		var tbody = $('#cwd-tbody-col-name-form');
	 		var last = $('#cwd-tbody-col-name-form tr:last');
	 		var lastClass = last.find('td input[name^="cwd_form_data_add_cols_"]');

	 		//check if a new row
	 		if (lastClass.length >= 1) {
	 			last.remove();
	 		}
	 		
	 	})

	 	/*
	 	$(".cwd_options_remove_table_col_button").click(function(event) {

	 		var input = $(this).parent().siblings().find('input');
	 		var name = input.attr('name');

	 		if ($(this).val() == 'Delete') {
		 		name = name.split("cwd_form_data_curr_cols_")[1];
		 		var res = confirm("Are you sure you want to delete "+name);

				if (res) {
					alert('This column will be permanently deleted from the database when you click save');
					$(this).parent().parent().css('background-color', 'red');
					$(this).val('Undo');
		 			var newName = "cwd_form_data_delete_cols_";
		 			newName += name;
		 			input.attr('name', newName);
		 		}
		 	}
		 	else {
		 		name = name.split("cwd_form_data_delete_cols_")[1];
		 		$(this).parent().parent().css('background-color', '');
		 		$(this).val('Delete');
		 		var newName = "cwd_form_data_curr_cols_";
		 		newName += name;
		 		input.attr('name', newName);
		 	}
	 		
	 	})
	 	*/

	 })




	/*
	 * Make Update Location Button for Add Marker Form
	 */
	 $(function() {
	 	var buttonWrap = $('<div>')
	 	var latLngButton = $('<button>').attr('id', 'cwd-update-location').attr('type', 'button').css('float', 'right').addClass('button button-primary').html('Update Location');
	 	var lngInput = $('input[name="longitude"]');
	 	//var latLngWrap = lngInput.parent().parent();
	 	var latLngWrap = lngInput.parent();
	 	buttonWrap.append(latLngButton)
	 	latLngWrap.append(buttonWrap);
	 	//console.log(lngInput.parent().parent());
	 	
	 })
	 //<button id="cwd-update-location" type="button" class="button button-primary">Update Location</button>



	/*
	 * Set up variables for functions called by buttons
	 * Note: if setting up Toggle Button via html on cwd-dynamic-maps-maps-page.php, 
	 * these must defined above the jQuery loop 
	 */
	 var map, markers, markerCluster, userMarker, updateMarker, toggleOverlay, historicOverlay, selectMarker, openInfoWindow, fillForm;

	 /*
	 * Prepare Table Data for Map
	 */
	$(function () {
		// PHP table data sent from wp_localize_scripts function in class-cwd-dynamic-maps-admin.php 
		markers = JSON.parse(cwd_php_vars);
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
			console.log(a);
	
			//var selectedMarker = markerCluster.markers_.find(function (obj) { return obj.cwd_id == a.text(); });
			var selectedMarker = markerCluster.getMarkers().find(function (obj) { return obj.cwd_id == a.text(); } )

			function selectMarker() {
				// check if marker is in a cluster
			
				console.log('*** Selected Marker ***');
				console.log(selectedMarker);
				console.log(selectedMarker.isAdded);

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
					
					console.log('*** Get Cluster *** ');

					var thisCluster = markerCluster.getMarkersCluster(selectedMarker);
					console.log(thisCluster);

					console.log('2nd in Clusters Markers');

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
		$('#cwd-form-id').trigger('reset');
		console.log(marker);
		$('#cwd-form-id input[name="id"]').val('');
		if (marker.hasOwnProperty('id')) { 
			$('#update-marker-form-label').html('Edit Marker-' +marker.id);
		}
		else {
			$('#update-marker-form-label').html('Add Marker');
		}
		//alert('RESET');
		console.log('*** Fill Form ***')
		console.log(marker);
		for (var property in marker) {
		    if (marker.hasOwnProperty(property)) {
		    	$("[name='"+property+"']").val(marker[property]);
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
	function NewControlButton(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to toggle Overlay';

		controlUI.style.marginTop = '10px';
		controlUI.style.marginRight = '10px';

		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Toggle Map';
		controlUI.appendChild(controlText);

		// Setup the click event listeners
		controlUI.addEventListener('click', function() {
		  toggleOverlay();
		});

	}



	/*
	 * Set Up the Map
	 */
	function initMap() {
		var options = {
				zoom:18,
				center:{lat:42.306492,lng:-71.530936} 
		}

		map = new google.maps.Map(document.getElementById('map-wrap'), options); 

		var historicMapBounds = {
			/*
			north:42.318010,
			south:42.290221,
			east:-71.505528,
			west:-71.572515
			*/
			north:42.30712,
			south:42.30590,
			east:-71.53036,
			west:-71.53145
		}


		historicOverlay = new google.maps.GroundOverlay(
			//'../wp-content/plugins/cwd-dynamic-maps/admin/img/Boston_1852_wholemap_web.jpg',
			'../wp-content/plugins/cwd-dynamic-maps/admin/img/ArtTutor_GridPic',
			historicMapBounds, {clickable:false}
			);
		toggleOverlay();


		
		var cluster = [];

		// Loop through markers
		for(var i = 0;i < markers.length;i++){
			// Add marker
			addMarker(markers[i]);
			console.log(markers[i]);
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
				cwd_name:m.Name,
				cwd_No:m.Burial_Site_Number,
				cwd_Death:m.Death
			});
			cluster.push(marker); // AIDAN!!! REINSTATE THIS AFTER ADDING MARKERS TO HAVE CLUSTER 
			//marker.setMap(map); // REMOVE THIS LINE AND SWAP WITH ABOVE

			//console.log(marker['cwd_id']);

		
			// Check content
			if (true /*m.description*/){
				var infoWindow = new google.maps.InfoWindow({
			    	content:'<h4>'+m.Name+'</h4>'
			    		+'<p>No. '+m.Burial_Site_Number+'</p>'
			    		+'<p>Date: '+m.Death+'</p>'
				});

				//Maybe this should be drawn dynamically  
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
					console.log('*** The Marker ***');
					console.log(thisMarkerData);
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

		console.log( markerCluster.getMarkers() );


		/*
		 * Listen for Map Click and User Marker There
		 */

    	//Listen for clusterclick
    	google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster, event) {
    		//console.log(cluster.getMarkers()[0]);

    		console.log('*** EVENT TYPE ***');
    		console.log(typeof(event));
    		console.log(event);
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
    		
    		console.log('*** CLUSTER EVENT ***');
    		console.log(event);
    		console.log(cluster);

    		console.log('Its Markers');
    		console.log(cluster.getMarkers()[0]);

    		if(openInfoWindow) {
				openInfoWindow.close();
			}

			var clustersMarkers = cluster.getMarkers(); 
			var clusterSize = clustersMarkers.length;
			var cluster_ids = []; 
			var clustersMarkersData = [];
			var clusterDescription = '';
			


			for (var i=0; i<clusterSize; i++) {
				cluster_ids.push(clustersMarkers[i].cwd_id);
				var tmp = markers.find(function (obj) { return obj.id == clustersMarkers[i].cwd_id; });
				clustersMarkersData.push(tmp);
				clusterDescription += '<b>'+tmp.Burial_Site_Number +'</b>, '+tmp.Name+ ', ' +tmp.Death+ '<br>';
			}


			var infoWindow = new google.maps.InfoWindow({
			    	content:''
			    			+ clusterDescription,
			    	position: cluster.getCenter()
				});
			infoWindow.open(map);
			
			
			openInfoWindow = infoWindow;
			return event;
    		
	    });


		// Listen for click on map
		map.addListener('click', function(event) {

			//var tmp = Object.entries(event);

			console.log(Object.entries(event));

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
			
			
			console.log('*** EVENT ***');
			console.log(event);

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
        var newControl = new NewControlButton(newControlDiv, map);

        var myDiv = $('#floating-panel')

        newControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(newControlDiv);


	} // End initMap

	
	function toggleOverlay() {
		if (historicOverlay.getMap()) {
			historicOverlay.setMap(null);
		}
		else {
			historicOverlay.setMap(map);
		}
	};



	// Get Map
	if (typeof google === 'object' && typeof google.maps === 'object') {
    	$(initMAP);
	} 
	else {
	     $.getScript('https://maps.googleapis.com/maps/api/js?key='+cwd_api_key+'&language=en', function(){
	         $(initMap);
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
	



