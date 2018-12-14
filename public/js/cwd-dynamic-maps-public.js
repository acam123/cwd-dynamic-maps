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

	var map;

	function initMap() {
		var options = {
				zoom:18,
				center:{lat:42.306492,lng:-71.530936} 
		}

		map = new google.maps.Map(document.getElementById('cwd-map-wrap-frontend'), options); 
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
