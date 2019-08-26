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


$.getScript('https://maps.googleapis.com/maps/api/js?key='+cwd_api_key+'&language=en', (function(){

	var tableMeta = {};


for (var itr=0; itr<cwd_static.length; itr++) {

	var map, markers, markerCluster, selectMarker, openInfoWindow, declusteredMarker;

	var thisShortcodeBox = $('#'+cwd_static[itr]['uid']);

	var tmp = 'TMP';

	// PHP table data sent from wp_localize_scripts function in class-cwd-dynamic-maps-admin.php 
	markers = JSON.parse(cwd_static[itr]['markers_data']);




	/*
	 * Make Pagination for Table
	 */

		if (markers.length == 0) {
			thisShortcodeBox.find('.cwd-table-wrap').remove();
			thisShortcodeBox.find('.cwd-map-wrap-frontend').css('width', '100%');
		}

	 	var numRows = markers.length;
	 	var maxPerPage = 2;
	 	var totalPages = Math.ceil(numRows/maxPerPage);

	 	var wrap = thisShortcodeBox.find('.cwd-table-wrap');


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
		

	/*
	 * Fill Javascript Table 
	 */

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
	
		numCols = numCols - 2;

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

 				//make link to marker on map
 				if (j == 0) {
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

	 	tableWrapper.append(table);
	 	wrap.append(tableWrapper);


	 	var howTo = $("<div>").html("<p>- Search for markers by any keyword above and click the desired marker link to view the marker and it's information on the map. <i>(Leave input blank and click <b>Search</b> to see all markers).</i></p><p style='text-align:center;'><b><i>OR</i></b></p><p>- Start exploring the map by dragging, clicking navigation buttons, and selecting markers and marker clusters to find out more.</p>").attr("id", "howTo");
	 	wrap.append(howTo);

	 	thisShortcodeBox.find(".tablenav-pages").hide();
	 	thisShortcodeBox.find(".marker-sorter").hide();


	 /*
	 * Table Actions
	 */

		var addPageButtons;

		var rows = thisShortcodeBox.find('div.cwd-table-wrap table tbody tr');
		var input = thisShortcodeBox.find('input[id="current-page-selector"]');
		var maxPageText = thisShortcodeBox.find('span[class="total-pages"]');
		var displayNum = thisShortcodeBox.find('span[class="displaying-num"]');
		var maxPerPage = 5;
		var matchedRows;
		var numRows;
		var totalPages;
		var currPage;


		var declusteredMarker;
		var openInfoWindow;
		var cluster;

		var markerColTypes = JSON.parse(cwd_static[itr]['marker_col_types']);

		tableMeta[thisShortcodeBox.attr('id')] = { 
			rows:rows, 
			input:input, 
			maxPageText:maxPageText, 
			displayNum:displayNum, 
			maxPerPage:maxPerPage, 
			matchedRows, 
			numRows, 
			totalPages, 
			currPage,
			markerCluster, 
			map, 
			markers,
			declusteredMarker:null,
			openInfoWindow:null,
			markerColTypes:markerColTypes,
			cluster

		};
		

		/*
	 	* Pagination Functions
	 	*/
	 	function paginate(thisShortcodeBox) {

	 		//Remove noResultsRow if exists
	 		var noResultsTr;
			var tbody = thisShortcodeBox.find(".marker-sorter tbody");
			noResultsTr = tbody.find("#no-results-row");
			if ( noResultsTr ) {
				noResultsTr.remove();
			}

			
			var id = thisShortcodeBox.attr('id');

			tableMeta[id]['rows'].hide();

			tableMeta[id]['matchedRows'] = tableMeta[id]['rows'].filter('.cwd-match');

			tableMeta[id]['numRows'] = tableMeta[id]['matchedRows'].length;

			tableMeta[id]['totalPages'] = Math.ceil(tableMeta[id]['numRows'] / tableMeta[id]['maxPerPage']);

			tableMeta[id]['currPage'] = 1;


			if (tableMeta[id]['totalPages'] == 0) {
				tableMeta[id]['currPage'] = 0;
			}

			var bound = Math.min(tableMeta[id]['maxPerPage'], tableMeta[id]['numRows']);
		
			updatePageStats();

			
			addPageButtons = (function() {

				var id = thisShortcodeBox.attr('id');

				thisShortcodeBox.find('.cwd-next').click(function(event) {
					if(tableMeta[id]['currPage'] < tableMeta[id]['totalPages']) {
						tableMeta[id]['currPage']++;
						updatePageStats();
					}

				});

				thisShortcodeBox.find('.cwd-back').click(function(event) {
					if(tableMeta[id]['currPage'] > 1) {
						tableMeta[id]['currPage']--;
						updatePageStats();
					}
					
				});

				input.on("keyup", function(event) {
					var newPage = $(this).val();
					//Check if newPage is an int
					if ( (Math.floor(newPage) == newPage) && (newPage > 0) && (newPage <= tableMeta[id]['totalPages']) )  {
							tableMeta[id]['currPage'] = newPage;
							updatePageStats();
					}
					//Allow user to remove Current Page #
					else if (newPage == '') {

					}
					else {
					}
					
				})

				input.on("focusout", function(event) {
					var newPage = $(this).val();
					if ( (newPage == '') | (newPage <= 0) | (newPage > tableMeta[id]['totalPages']) | (Math.floor(newPage) != newPage) ) {
						$(this).val(tableMeta[id]['currPage']);
					} 
				})

				thisShortcodeBox.find('.cwd-first').click(function(event) {
					if(tableMeta[id]['currPage'] != 1) {
						tableMeta[id]['currPage'] = 1;
						updatePageStats();
					}
				});

				thisShortcodeBox.find('.cwd-last').click(function(event) {
					if(tableMeta[id]['currPage'] != tableMeta[id]['totalPages']) {
						tableMeta[id]['currPage'] = tableMeta[id]['totalPages'];
						updatePageStats();
					}

				});
			})//AddPageButtons
			
						

			function updatePageStats() {

				tableMeta[id]['rows'].hide();
				for (var i=0; i<tableMeta[id]['maxPerPage']; i++) {
					$(tableMeta[id]['matchedRows'][(tableMeta[id]['currPage']*tableMeta[id]['maxPerPage'] - tableMeta[id]['maxPerPage'] + i)]).show();
		
					if ( (tableMeta[id]['currPage']*tableMeta[id]['maxPerPage'] - tableMeta[id]['maxPerPage'] + i ) >= tableMeta[id]['numRows'] ){
						break;
					}
				}

				tableMeta[id]['input'].val(tableMeta[id]['currPage']);
				tableMeta[id]['maxPageText'].html(tableMeta[id]['totalPages']);
				tableMeta[id]['displayNum'].html(tableMeta[id]['numRows']+' item(s)');

				/*statsDiv.html(
					'<p>Page: ' + currPage + 
					'</p><p>numRows: ' + numRows +

					'</p><p>maxPerPage: ' + maxPerPage +
					'</p><p>totalPages: ' + totalPages 
					);
					*/

			};

			// add noResultsRow if 0 results
			if ( tableMeta[id]['numRows'] === 0 ) {
				noResultsTr = $("<tr>").attr("id", "no-results-row");
				var noResultsTd = $("<td>").text('No Results Found').attr("colspan", "100");
				noResultsTr.append(noResultsTd);				
				tbody.append(noResultsTr);
			}

		}//End Paginate

		paginate(thisShortcodeBox);
		addPageButtons();		

		/*
		 * Filter Markers
		 */
		thisShortcodeBox.find("#cwd-marker-filter-button").click( function(event){

			var thisShortcodeBox = $(this).parent().parent().parent().parent().parent();

			thisShortcodeBox.find("#howTo").hide();

			thisShortcodeBox.find(".marker-sorter").show();
			thisShortcodeBox.find(".tablenav-pages").show();

			var filter = thisShortcodeBox.find("input[name='cwd-marker-filter']").val().toLowerCase();
		//	$(".marker-sorter tbody tr").filter(function() {
		//		$(this).toggle($(this).text().toLowerCase().indexOf(filter) > -1)
		//	})
			

			thisShortcodeBox.find(".marker-sorter tbody tr").each( function() {
				
				if( $(this).text().toLowerCase().indexOf(filter) > -1) {

					$(this).addClass('cwd-match').removeClass('cwd-no-match');

				}
				else {
					$(this).addClass('cwd-no-match').removeClass('cwd-match');
				}

			})

			paginate(thisShortcodeBox);
			
		});
		

		/*
		 * Sort Javascript Table
		 */
		thisShortcodeBox.find(".cwd-sortable-col").click(function(event) {
			var th = $(this);

			var colName = th.data('cwd-col');
			var table = th.parent().parent().parent();
			var tableBody = table.find("tbody");
			var tableRows = tableBody.children("tr");
			var ths = table.find("th[data-cwd-col="+colName+"]");
			var indicator = ths.find("span[class='sorting-indicator']");
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


			paginate(thisShortcodeBox);
		}) //End of Pagination Functions



	/*
	 * Give Table Entry Links Actions on the Map
	 */
		thisShortcodeBox.find(".cwd-link-marker").click( function(event) {

			var a = $(this);
			var sibs = a.parent().siblings();

			var thisShortcodeBox = $(this).parent().parent().parent().parent().parent().parent().parent();
			var id = thisShortcodeBox.attr('id');


			var tmp = $.find("div[data-cwd-reattach="+id+"]");
			if ( tmp.length === 1 ) {
				// Reattach fullscreen infowindow to google defined infowindow 
				var tmpWindow = $.find("button[data-cwd-uid="+id+"]");
				tmpWindow = $(tmpWindow[0]); 

				tmpWindow.css('width', 'auto');
				tmpWindow.css('height', 'auto');
				tmpWindow.css('position', 'absolute');
				tmpWindow.css('background', 'transparent');
				tmpWindow.css('color', 'black');
				tmpWindow.css('opacity', '.65');
				tmpWindow.css('padding', '0px');
				tmpWindow.css('top', '-2px');
				tmpWindow.css('left', '0px');

				tmpWindow.removeClass('cwd-info-full');

				tmpWindow.parent().css('position', 'static');
				tmpWindow.parent().css('padding', '0px');
				tmpWindow.parent().css('border', 'none');

				tmp = $(tmp[0]);
				tmp.prepend(tmpWindow.parent());
			}

			// Close Open Infowindows
			if (tableMeta[id]['openInfoWindow']) {
				tableMeta[id]['openInfoWindow'].close();
			}

			// Reset Declustered Marker
			if (tableMeta[id]['declusteredMarker'] != null /*|| 'undefined'*/) {
				tableMeta[id]['declusteredMarker'].setMap(null);
				tableMeta[id]['markerCluster'].addMarker(tableMeta[id]['declusteredMarker']);
				tableMeta[id]['declusteredMarker'] = null;
				tableMeta[id]['markerCluster'].redraw();
			}
			

			var selectedMarker = tableMeta[id]['markerCluster'].getMarkers().find(function (obj) { return obj.cwd_id == a.text(); } )

			//console.log('!!!Marker Cluster!!!');
			//console.log(tableMeta[id]['markerCluster']);

			function selectMarker() {
				// Check if marker is in a cluster
				// if marker hasn't been processed by cluster b/c so out of frame, jump there and refresh 
				if(selectedMarker.isAdded == false) {

					tableMeta[id]['map'].setCenter(selectedMarker.getPosition());
					tableMeta[id]['markerCluster'].repaint();
				}

				var onMap = selectedMarker.map;
				if (onMap != null) {
					new google.maps.event.trigger(selectedMarker, 'click');
					tableMeta[id]['map'].setCenter(selectedMarker.getPosition());
				} 
				else {

					var thisCluster = tableMeta[id]['markerCluster'].getMarkersCluster(selectedMarker);

					var selectedMarkerData = tableMeta[id]['markers'].find(function (obj) { return obj.id == selectedMarker.cwd_id } );

					//google.maps.event.trigger(tableMeta[id]['markerCluster'], 'clusterclick', thisCluster);


				// !!! START REPLACE !!!
					//Decluster Marker 
					// ??? ADD TO Click instead ???
					tableMeta[id]['declusteredMarker'] = selectedMarker;
					tableMeta[id]['markerCluster'].removeMarker(selectedMarker);
    				tableMeta[id]['markerCluster'].redraw();
					tableMeta[id]['declusteredMarker'].setMap(tableMeta[id]['map']);
	
					new google.maps.event.trigger(tableMeta[id]['declusteredMarker'], 'click');
			
					tableMeta[id]['map'].setCenter(selectedMarker.getPosition());
				// !!! END REPLACE !!!
				}
	
			};

			selectMarker();
			 
		})


	 	

	function initMap(itr, id) {
		var short_id = cwd_static[itr]['atts']['map'];
		var m_group_num = cwd_static[itr]['atts']['markers']; 

		var map_options = JSON.parse(cwd_static[itr]['maps_data']);

		var selectedMap = map_options.find(function (obj) { return obj.id == short_id } );

		if (typeof(selectedMap) == "undefined") {
			alert('Error: No Map with this Id found');
			return -1;
		}


		var centerLat = parseFloat(selectedMap['centerLat']);
		var centerLng = parseFloat(selectedMap['centerLng']);

		var southBound = parseFloat(selectedMap['southBound']);
		var westBound = parseFloat(selectedMap['westBound']);
		var northBound = parseFloat(selectedMap['northBound']);
		var eastBound = parseFloat(selectedMap['eastBound']);

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
				zoom: parseInt(selectedMap['zoom']),
				minZoom: parseInt(selectedMap['minZoom']),
				maxZoom: parseInt(selectedMap['maxZoom']),
				center: { lat: centerLat, lng: centerLng },
				mapTypeId: selectedMap['mapTypeId'],
				tilt: parseInt(selectedMap['tilt']),
				heading: parseInt(selectedMap['heading']),
				restriction: {
		        	latLngBounds: { north: northBound,
        							south: southBound,
        							west: westBound,
        							east: eastBound,
        			},
		        	strictBounds: false,
		        },

		}

		var mapWrap = $("#"+cwd_static[itr]['uid']).find('div[class="cwd-map-wrap-frontend"]')[0];

		tableMeta[id]['map'] = new google.maps.Map(mapWrap, options);

		// Add Custom Button(s)
		// Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var newControlDiv = document.createElement('div');
        var newControl = new NewControlButton(newControlDiv, tableMeta[id]['map']);

        var myDiv = $('#floating-panel');

        newControlDiv.index = 1;
        tableMeta[id]['map'].controls[google.maps.ControlPosition.TOP_LEFT].push(newControlDiv);

        function recenterMap() {
        	tableMeta[id]['map'].setCenter(new google.maps.LatLng(centerLat, centerLng));
        }

        /*
		 * Set Up the Buttons for the Map
		 */
		function NewControlButton(controlDiv, map) {
			// Set CSS for the control border.
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = '#fff';
			controlUI.style.border = '2px solid #fff';
			controlUI.style.borderRadius = '2px';
			controlUI.style.boxShadow = '0 2px 4px rgba(0,0,0,.2)';
			controlUI.style.boxSizing = 'content-box';
			controlUI.style.cursor = 'pointer';
			controlUI.style.marginBottom = '22px';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to Center Map';

			controlUI.style.marginTop = '10px';
			controlUI.style.marginRight = '10px';
			//controlUI.style.backgroundImage = 'url('+cwd_plugin_url+'/cwd-dynamic-maps/public/img/home_icon.png)';
			controlUI.style.height = '36px';
			controlUI.style.width = '36px';

			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior.
			var controlText = document.createElement('div');
			//controlText.style.color = 'rgb(25,25,25)';
			//controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
			//controlText.style.fontSize = '16px';
			//controlText.style.lineHeight = '37px';
			//controlText.style.paddingLeft = '3px';
			//controlText.style.paddingRight = '3px';
			controlText.innerHTML = '<img  class="cwd-map-home-button" style="height:25px;width:25px;margin-top:5px;" src="'+cwd_plugin_url+'/cwd-dynamic-maps/public/img/home_icon.png" >';
			controlUI.appendChild(controlText);

			// Setup the click event listeners
			controlUI.addEventListener('click', function() {
			  recenterMap();
			});

		} // End NewControlButton

		
		if (selectedMap['polyline'] !== '' ) {
			var polylineCoordinates = JSON.parse( selectedMap['polyline'].replace(/;/g, ',') );	
			var polyline = new google.maps.Polyline({
			    path: polylineCoordinates,
			    geodesic: false,
			    strokeColor: '#FF0000',
			    strokeOpacity: 1.0,
			    strokeWeight: 2
			});
			polyline.setMap(tableMeta[id]['map']);
		}


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

		tableMeta[id]['cluster'] = [];


		// Loop through markers
		for(var i = 0; i<tableMeta[id]['markers'].length;i++){
			// Add marker
			addMarker(tableMeta[id]['markers'][i]);
		}



		// Add Marker Function
		function addMarker(m){
			var coords = {lat:parseFloat(m.latitude), lng:parseFloat(m.longitude)};
			var marker = new google.maps.Marker({
				icon: {
					url: cwd_plugin_url+'/cwd-dynamic-maps/public/img/location-pin-curvy-outline.png',
					scaledSize:  new google.maps.Size(20, 20), // scaled size
				},
				position:coords,
				cwd_id:m.id,
				
			});
			tableMeta[id]['cluster'].push(marker); 

			// Check content
			if (true ){
				var contents = '';
	

				if ( cwd_infowindow_display === null || typeof(cwd_infowindow_display[m_group_num]) === 'undefined' || cwd_infowindow_display[m_group_num] === '') {			
					// DEFAULT INFOWINDOW DISPLAY
					contents = '';
					for (var prop in m) {
					    if (m.hasOwnProperty(prop)) {
					        contents+='<p>'+prop+': '+m[prop]+'</p>';
					    }
					}
				} 
				else {
					// PARSE THROUGH TEMPLATE FOR DATAFIELDS TO INSERT
					contents += cwd_infowindow_display[m_group_num];

					var expr = /(\$cwd-infowindow-)([a-zA-Z0-9_]+)/gm;
				
					var matches = contents.match(expr);

					if (matches === null) {matches = 0;}

					var imgCols = tableMeta[id]['markerColTypes'].filter(function (obj) {return obj.COLUMN_COMMENT === 'img'});
			
					for (var i=0; i<matches.length; i++) {
						var x = matches[i].split("$cwd-infowindow-")[1];
						var isImgType = imgCols.filter(function (obj) {return obj.COLUMN_NAME === x});

						if ( isImgType.length > 0 &&  m[x] === '' ) {
							//default image
							contents = contents.replace( matches[i], cwd_plugin_url+'/cwd-dynamic-maps/public/img/camera-icon.png' );
						}
						else if( isImgType.length > 0 &&  m[x] !== '' ) {
							//img relative path
							contents = contents.replace( matches[i], cwd_base_url +'/'+ m[x] );

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
		
				var infoWindow = new google.maps.InfoWindow({
			    	content: '<div id="cwd-display-topbar-wrap" style="/*padding:5px;*/"><button type="button" data-cwd-uid="'+id+'" id="cwd-display-topbar">&boxbox;</button><div class="cwd-infowindow" style="overflow:scroll;"><div style="height:100%; min-width:100%; width:auto; box-sizing:content-box;">'+contents+'</div></div></div>'
				});

				marker.addListener('click', function(event) {
					//Close open infoWindows is exist
					if(tableMeta[id]['openInfoWindow']) {
						tableMeta[id]['openInfoWindow'].close();
					}

					//Open this infoWindow and save as the openInfoWindow
					infoWindow.open(tableMeta[id]['map'], marker);






					

					




					//Save this infoWindow as the openInfoWindow
					tableMeta[id]['openInfoWindow'] = infoWindow;

					var thisMarkerData = tableMeta[id]['markers'].find(function (obj) { return obj.id == marker.cwd_id; } );
					
				});


			}

		} // End addMarkers

		var mcOptions = { 
							zoomOnClick: false,
							averageCenter: true,
							imagePath: cwd_plugin_url+'/cwd-dynamic-maps/public/img/m',
							//imagePath: '../wp-content/plugins/cwd-dynamic-maps/public/img/m',
							gridSize: 40, //
							maxZoom: 21, //On smallest possible zoom force all markers to be shown
						};

		tableMeta[id]['markerCluster'] = new MarkerClusterer(tableMeta[id]['map'], tableMeta[id]['cluster'], mcOptions);


		/*
		 * Listen for Map Click and User Marker There
		 */

    	//Listen for clusterclick
    	google.maps.event.addListener(tableMeta[id]['markerCluster'], 'clusterclick', function(cluster, event) {
    	
    
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
    		

    		if (tableMeta[id]['openInfoWindow']) {
				tableMeta[id]['openInfoWindow'].close();
			}


			if(tableMeta[id]['declusteredMarker'] != null) {
					
					tableMeta[id]['declusteredMarker'].setMap(null);
					tableMeta[id]['markerCluster'].addMarker(tableMeta[id]['declusteredMarker']);
    				tableMeta[id]['markerCluster'].redraw();
    				tableMeta[id]['declusteredMarker'] = null;
			}

			var clustersMarkers = cluster.getMarkers(); 

			var clusterSize = clustersMarkers.length;
			var cluster_ids = []; 
			var clustersMarkersData = [];
			var clusterDescription = '<br>';
			var cols;
			var defaultDisplay = true;
			var customDisplay = '';
			var linkCode = '';


			for (var i=0; i<clusterSize; i++) {
				var customDisplay = '';
				cluster_ids.push(clustersMarkers[i].cwd_id);
				var tmp = tableMeta[id]['markers'].find(function (obj) { return obj.id == clustersMarkers[i].cwd_id; });

				if ( cwd_cluster_display === null || typeof(cwd_cluster_display[m_group_num]) === 'undefined' || cwd_cluster_display[m_group_num] === '') {		
					customDisplay = '- '+tmp.id +' -';
				}
				else {
					defaultDisplay = false;
					//customDisplay += '<span>SPECIAL TEXT</span>';
					// PARSE THROUGH TEMPLATE FOR DATAFIELDS TO INSERT
					customDisplay += cwd_cluster_display[m_group_num];

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
			infoWindow.open(tableMeta[id]['map']);
			
			tableMeta[id]['openInfoWindow'] = infoWindow;
			return event;
    		
	    });


		// Listen for click on map
		tableMeta[id]['map'].addListener('click', function(event) {

        	/* If exists Add declusteredMarker back into Clusterer */
			if (tableMeta[id]['declusteredMarker'] !=null) {
						tableMeta[id]['declusteredMarker'].setMap(null);
						tableMeta[id]['markerCluster'].addMarker(tableMeta[id]['declusteredMarker']);
						tableMeta[id]['declusteredMarker'] = null;
			}


			//check if click is a cluster click
			var tmp = '';
			for ( var prop in event ) {
				
				if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.className) {
					tmp = event[prop].explicitOriginalTarget.className; 
				}
				else if (event[prop].explicitOriginalTarget && event[prop].explicitOriginalTarget.parentNode && event[prop].explicitOriginalTarget.parentNode.className) {
					tmp = event[prop].explicitOriginalTarget.parentNode.className;
				}
				else {
				}
			}

			// update if no cluster click
			if (tmp.substring(0,7) == 'cluster') {
			}
			else {
			}
			
		});


		// Close infowindows on zoom_change (so infowindow doesn't get lost in a reclustering and behave strangely when declustered)
		tableMeta[id]['map'].addListener('zoom_changed', function() {
        	if (tableMeta[id]['openInfoWindow']) {
        		tableMeta[id]['openInfoWindow'].close();
        	}
    	});


		/* Decluster Selected Markers on Link Click */
		$(document).on('click', '.cwd-cluster-link', function(event){

    		var thisDiv = $(this);
    		var id = thisDiv.attr('data-cwd-uid');

    		/* If exists Add declusteredMarker back into Clusterer */
			if (tableMeta[id]['declusteredMarker'] != null) {
						tableMeta[id]['declusteredMarker'].setMap(null);

						tableMeta[id]['markerCluster'].addMarker(tableMeta[id]['declusteredMarker']);

						tableMeta[id]['declusteredMarker'] = null;
			}

    		// NOTE: id is the unique id from the database, not the user defined No.
    		var link_id = $(this).attr('id');
    		
    		tableMeta[id]['declusteredMarker'] = tableMeta[id]['cluster'].find(function (obj) { return obj.cwd_id == link_id } );
    		tableMeta[id]['markerCluster'].removeMarker(tableMeta[id]['declusteredMarker']);
    		tableMeta[id]['markerCluster'].redraw();
    		tableMeta[id]['declusteredMarker'].setMap(tableMeta[id]['map']);

    		new google.maps.event.trigger(tableMeta[id]['declusteredMarker'], 'click');


		});

		
		$(document).on( 'click', '#cwd-display-topbar', function(event) {
			/*console.log(this);
			console.log($(this).find("[data-cwd-uid="+id+"]"));
			console.log($(this).data('cwd-uid'));
			console.log(id);
			console.log(event);
			console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			alert('!!!');*/
			console.log(id);

			if ( $(this).data('cwd-uid') === id ) {

				if ( $(this).hasClass('cwd-info-full') === true ) {
						$(this).css('width', 'auto');
						$(this).css('height', 'auto');
						$(this).css('position', 'absolute');
						$(this).css('background', 'transparent');
						$(this).css('color', 'black');
						$(this).css('opacity', '.65');
						$(this).css('padding', '0px');
						$(this).css('top', '-2px');
						$(this).css('left', '0px');

						$(this).removeClass('cwd-info-full');

						$(this).parent().css('position', 'static');
						$(this).parent().css('padding', '0px');
						$(this).parent().css('border', 'none');

						var box = $('#'+id);

						var tmp = box.find("div[data-cwd-reattach="+id+"]");

						tmp.prepend($(this).parent());
				}
				else {
					var chosen = $(this).data('cwd-uid');

					$(this).parent().parent().attr('data-cwd-reattach', id);

					var infowindow = $(this).parent(); 
					infowindow.css('position', 'absolute');
					infowindow.css('overflow', 'scroll');
					infowindow.css('display', 'block');
					infowindow.css('margin', '0px');
					infowindow.css('z-index', '1');
					infowindow.css('height', '100%');
					infowindow.css('width', '100%');

					infowindow.css('padding', '20px 10px 10px 10px');
					infowindow.css('box-sizing', 'border-box');
					infowindow.css('background', 'white');
					infowindow.css('border', 'black 1px solid');

					$(this).next().css('height', '100%');

					$(this).css('margin', '0px 0px 0px 0px');
					$(this).css('top', '0px');
					$(this).css('padding', '0px');
					$(this).addClass('cwd-info-full');

					var box = $('#'+id);
					box.find('.cwd-map-wrap-frontend').first().prepend(infowindow);

				}
			}

		})

	} //End initMap()


$(initMap(itr, cwd_static[itr]['uid']));



}// End new for 

}))// End of getScript

})( jQuery );
