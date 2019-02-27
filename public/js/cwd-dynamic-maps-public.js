(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
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

	var map, markers, markerCluster, selectMarker, openInfoWindow, declusteredMarker, searched;

	$(function () {
		// PHP table data sent from wp_localize_scripts function in class-cwd-dynamic-maps-admin.php 
		markers = JSON.parse(cwd_php_vars);
	});

	/*
	 * Make Pagination for Table
	 */

	searched = false;
	$(function() {

		if (/*markers.length > 0*/ true) {

		 	var numRows = markers.length;
		 	var maxPerPage = 2;
		 	var totalPages = Math.ceil(numRows/maxPerPage);

		 	var wrap = $('.cwd-table-wrap');


		 	var form = $('<form>');
		 	var input = $('<input>').attr('type', 'text').attr('name', 'cwd-marker-filter').attr('placeholder', 'E.g. Smith, 1788').attr('value', '');
		 	var inputButton = $('<button>').addClass('button button-primary').attr('id', 'cwd-marker-filter-button').attr('type', 'button').html('Search');

		 	var tableNavTop = $('<div>').addClass('tablenav top');
		 	var leftActions = $('<div>').addClass('alignleft  bulkactions');
		 	var navPages = $('<div>').addClass('tablenav-pages');
		 	var displayNum = $('<span>').addClass('displaying-num').html(numRows +' item(s)');
		 	var pageLinks = $('<span>').addClass('pagination-links');
		 	var toFirstPage = $('<a>').addClass('tablenav-pages-navspan cwd-first');
		 	var firstSpan = $('<span>').html('&laquo;');
		 	var toBackPage = $('<a>').addClass('tablenav-pages-navspan cwd-back');
		 	var backSpan = $('<span>').html('&lsaquo;');
		 	
		 	var pagingInput = $('<span>').addClass('paging-input');
		 	var pageInput = $('<input>').addClass('current-page').attr('id', 'current-page-selector').attr('type', 'text').attr('size', '1').val(1);
		 	var pagingText = $('<span>').addClass('tablenav-paging-text').html('of ');
		 	var maxPageText = $('<span>').addClass('total-pages').html(totalPages);

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

	 	var tableWrapper = $('<div>').attr('class', 'cwd-table-wrapper'); 
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

		// Remove longitude and latitude columns from table
		colNames.splice(colNames.indexOf('latitude'),1);
		colNames.splice(colNames.indexOf('longitude'),1);
		colNames.splice(colNames.indexOf('Burial_Site_Number'),1);
		numCols = numCols - 3;


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
	 		//table.append(row);
	 		table.prepend(row);
	 	}
	 	table.append(tFoot);

	 	tableWrapper.append(table);
	 	wrap.append(tableWrapper);


	 	var howTo = $("<div>").text("This is how you use the plugin..." /*+ map_options[0] + '----------------------------' + jQuery.type(map_options[0])*/ ).attr("id", "howTo");
	 	wrap.append(howTo);

	 	$(".tablenav-pages").hide();
	 	$(".marker-sorter").hide();

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
		var input = $('input[id="current-page-selector"]');
		var maxPageText = $('span[class="total-pages"]');
		var displayNum = $('span[class="displaying-num"]');

		*/

		var addPageButtons;

		var rows = $('div.cwd-table-wrap table tbody tr');
		var input = $('input[id="current-page-selector"]');
		var maxPageText = $('span[class="total-pages"]');
		var displayNum = $('span[class="displaying-num"]');
		var maxPerPage = 5;
		var matchedRows;
		var numRows;
		var totalPages;
		var currPage;
		


		/*
	 	* Pagination Functions
	 	*/
	 	function paginate() {

	 		//Remove noResultsRow if exists
	 		var noResultsTr;
			var tbody = $(".marker-sorter tbody");
			noResultsTr = tbody.find("#no-results-row");
			if ( noResultsTr ) {
				noResultsTr.remove();
			}

			
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

			// add noResultsRow if 0 results
			if ( numRows === 0 ) {
				noResultsTr = $("<tr>").attr("id", "no-results-row");
				var noResultsTd = $("<td>").text('No Results Found').attr("colspan", "100");
				noResultsTr.append(noResultsTd);				
				tbody.append(noResultsTr);
			}

		}//End Paginate

		paginate();
		addPageButtons();		

		/*
		 * Filter Markers
		 */
		$("#cwd-marker-filter-button").click( function(event){

			searched = true;
			$("#howTo").hide();
			//alert(searched);
			$(".marker-sorter").show();
			$(".tablenav-pages").show();

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
					//fillForm(selectedMarkerData);

					/*if (userMarker !=null) {
						userMarker.setMap(null);
						userMarker = null;
					}*/

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
	 	

	function initMap() {

		var map_options = JSON.parse(cwd_map_options);
		var centerLat = parseFloat(map_options[0]['centerLat']);
		var centerLng = parseFloat(map_options[0]['centerLng']);


		var southBound = parseFloat(map_options[0]['southBound']);
		var westBound = parseFloat(map_options[0]['westBound']);
		var northBound = parseFloat(map_options[0]['northBound']);
		var eastBound = parseFloat(map_options[0]['eastBound']);

		var options = {
				/*
				zoom:18,
				minZoom:18,
				maxZoom:22,
				center:{lat:42.306492,lng:-71.530936},
				mapTypeId: 'hybrid',
				tilt: 45,
				heading: 90
				*/
				zoom: parseInt(map_options[0]['zoom']),
				minZoom: parseInt(map_options[0]['minZoom']),
				maxZoom: parseInt(map_options[0]['maxZoom']),
				center: { lat: centerLat, lng: centerLng },
				mapTypeId: map_options[0]['mapTypeId'],
				tilt: parseInt(map_options[0]['tilt']),
				heading: parseInt(map_options[0]['heading']),
				restriction: {
		        	latLngBounds: { north: northBound,
        							south: southBound,
        							west: westBound,
        							east: eastBound,
        			},
		        	strictBounds: false,
		        },

 
		}

		map = new google.maps.Map(document.getElementById('cwd-map-wrap-frontend'), options); 

		
		// Draw polyline (outline) on Map 	
		/*var polylineCoordinates = [
		    {lat: 42.307095, lng: -71.530954},
		    {lat: 42.307088, lng: -71.530537},
		    {lat: 42.305927, lng: -71.530457},
		    {lat: 42.305943, lng: -71.531333},
		    {lat: 42.306230, lng: -71.531317},
		    {lat: 42.307095, lng: -71.530954}
		];*/

		var polylineCoordinates = JSON.parse( map_options[0]['polyline'].replace(/;/g, ',') );	
		var polyline = new google.maps.Polyline({
		    path: polylineCoordinates,
		    geodesic: false,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
		});
		polyline.setMap(map);

		
		// Listen for Map Drags and Limit Range by ReCentering
		/*
		var southBound = parseFloat(map_options[0]['southBound']);
		var westBound = parseFloat(map_options[0]['westBound']);
		var northBound = parseFloat(map_options[0]['northBound']);
		var eastBound = parseFloat(map_options[0]['eastBound']);

		console.log(southBound+', '+westBound+', '+northBound+', '+eastBound);

		var mapBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(southBound, westBound),
			new google.maps.LatLng(northBound, eastBound)
    		
    		//new google.maps.LatLng(42.305394, -71.532197),
    		//new google.maps.LatLng(42.307113, -71.529668)
    		
    	);


		google.maps.event.addListener(map, 'dragend', function () {
	        if (mapBounds.contains(map.getCenter())) {
	            return;
	        }
	        else {
	            map.setCenter(new google.maps.LatLng(centerLat, centerLng));
	        }
	    });
	    */


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
					//console.log('*** The Marker ***');
					//console.log(thisMarkerData);
					//fillForm(thisMarkerData);

					// As we fill the form with the newly seleted marker must remove the temporary user marker to not confuse the user
					/*if (userMarker !=null) {
						userMarker.setMap(null);
						userMarker = null;
						
					}*/
					
				});


			}
		} // End addMarkers

		var mcOptions = { 
							zoomOnClick: false,
							averageCenter: true,
							imagePath: '../wp-content/plugins/cwd-dynamic-maps/admin/img/m',
							gridSize: 40, //
							maxZoom: 21, //On smallest possible zoom force all markers to be shown
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
    			//event.stopPropagation(); // *** REMOVE FOR MAPS W/OUT ADD MARKER FEATURE ***
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
			



			for (var i=0; i<clusterSize; i++) {
				cluster_ids.push(clustersMarkers[i].cwd_id);
				var tmp = markers.find(function (obj) { return obj.id == clustersMarkers[i].cwd_id; });
				clustersMarkersData.push(tmp);
				clusterDescription += '<a class="cwd-cluster-link" id="'+tmp.id+'" >'+tmp.Burial_Site_Number +'</a>, '+tmp.Name+ ', ' +tmp.Death+ '<br>';

				//console.log(tmp);

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


			/* If exists Add declusteredMarker back into Clusterer */
			if (declusteredMarker !=null) {
						declusteredMarker.setMap(null);
						markerCluster.addMarker(declusteredMarker);
						declusteredMarker = null;
			}

			//var tmp = Object.entries(event);

			//console.log(Object.entries(event));

			//check if click is a cluster click
			var tmp = '';
			for ( var prop in event ) {
				//console.log( prop);
				if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.className) {
					//console.log('-exists 1');
					tmp = event[prop].explicitOriginalTarget.className; 

				}
				else if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.parentNode && event[prop].explicitOriginalTarget.parentNode.className) {
					//console.log('-exists 2');
					tmp = event[prop].explicitOriginalTarget.parentNode.className;

				}
				else {
					//console.log('--NULL');
				}
			}

			// update if no cluster click
			if (tmp.substring(0,7) == 'cluster') {

			}
			else {
				//updateMarker(event.latLng);
				//updateLabel(event.latLng);
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


		/* Decluster Selected Markers on Link Click */
		$(document).on('click', '.cwd-cluster-link', function(event){
    		//alert($(this).text());
    		//console.log($(this));

    		//console.log('Markers');
    		//console.log(markers);


    		/* If exists Add declusteredMarker back into Clusterer */
			if (declusteredMarker != null) {
						declusteredMarker.setMap(null);
						markerCluster.addMarker(declusteredMarker);
						declusteredMarker = null;
			}

    		// NOTE id is the unique id from the database, not the user defined No.
    		var link_id = $(this).attr('id');
    		//var selected_marker= markers.find(function (obj) { return obj.id == link_id } );
    		
    		//console.log(cluster);
    		//console.log(markerCluster.getMarkers());
    		declusteredMarker = cluster.find(function (obj) { return obj.cwd_id == link_id } );
    		//console.log(selected_marker);

    		
    		markerCluster.removeMarker(declusteredMarker);
    		console.log(markerCluster);
    		markerCluster.redraw();

    		//declusteredMarker.setZIndex(100000);
    		//declusteredMarker.setOpacity(1);

    		declusteredMarker.setMap(map);

    		//console.log("Z INDEX:");
    		//console.log( declusteredMarker.getZIndex() );


    		new google.maps.event.trigger(declusteredMarker, 'click');
			map.setCenter(declusteredMarker.getPosition());

			console.log(markerCluster.getPanes());


		});




	} //End initMap()



	// Get Map
	if (typeof google === 'object' && typeof google.maps === 'object') {
    	$(initMAP);
	} 
	else {
	     $.getScript('https://maps.googleapis.com/maps/api/js?key='+cwd_api_key+'&language=en', function(){
	         $(initMap);
	     });
	}


})( jQuery );
