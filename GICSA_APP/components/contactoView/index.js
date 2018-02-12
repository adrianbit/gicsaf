'use strict';

app.contactoView = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        var dS = new google.maps.DirectionsService;
        var dD = new google.maps.DirectionsRenderer;

        coordsActual();

        var selectedPlazaCookie = getCookie("initial");
        changeColor(selectedPlazaCookie);
        
        logoPlaza(selectedPlazaCookie, "contactoLogo");
        
        /** coordsAddress(mapUbicacion(selectedPlazaCookie));
        setTimeout(function(){
            initializeMap(dS, dD, coordsActualPos, coordsAddressPos,"contactoDiv"); 
        }, 3000);*/

        /**$(".insideHeader").css("background-image","linear-gradient(to right, #f6a426 0%, #ff8a00 100%)");
        $(".insideGrid").css("background-image","linear-gradient(to right, #f6a426 0%, #ff8a00 100%)");
        $(".km-content").css("background-color","#fb9611"); */
    }
});
app.localization.registerView('contactoView');

// START_CUSTOM_CODE_contactoView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
    function initializeMap(dS, dD, origin, destination, id) {

		var mapOptions = {
			center : destination,
			zoom : 12,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		calculateAndDisplayRoute(dS, dD, origin, destination);

		var map = new google.maps.Map(document.getElementById(id), mapOptions);
		dD.setMap(map);
	}
	function calculateAndDisplayRoute(dS, dD, origin, destination) {
		dS.route({
		  origin: origin,
		  destination: destination,
		  travelMode: 'DRIVING'
		}, function(response, status) {
		  if (status === 'OK') {
			dD.setDirections(response);
		  }
		});
	}
    function coordsAddress(address){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coordsAddressPos = results[0].geometry.location;
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
    function coordsActual(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            coordsActualPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          }, function() { });
        }
    }
// END_CUSTOM_CODE_contactoView