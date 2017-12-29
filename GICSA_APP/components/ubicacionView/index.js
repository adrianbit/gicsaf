'use strict';

var coordsAddressPos;
var coordsActualPos;

app.ubicacionView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { app.mobileApp.navigate('components/home/view.html'); return; } else { $("#selectedPlazaUbicacion").html(CENTROS_APP); } 

        var selectedPlazaCookie = getCookie("initial");
        changeColor(selectedPlazaCookie);

        $("#selectedPlazaUbicacion").val(selectedPlazaCookie);
        $("#selectedPlazaUbicacion").change(function() {
            var thisVal = $("#selectedPlazaUbicacion").val();
            changeColor(thisVal);
            //$("#googleMapsHref").attr('href', 'http://maps.google.com/maps?saddr=mi+ubicacion&daddr='+mapUbicacion(selectedPlazaCookie));
            initializeGoogleMaps("ubicacionDiv",thisVal);
            setCookie("initial",thisVal,30);
        });

        initializeGoogleMaps("ubicacionDiv",selectedPlazaCookie);
    }
});
app.localization.registerView('ubicacionView');

// START_CUSTOM_CODE_ubicacionView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

    function appMaps(idCentro,latitud,longitud){
        var deviceType = device.platform;
        if (deviceType=="iOS"){
            $("#googleMapsHref").attr('href', 'http://maps.apple.com/?ll='+latitud+','+longitud);
        } else if(deviceType=="Android"){
            $("#googleMapsHref").attr('href', 'geo:0,0?q='+latitud+','+longitud);
        } else {
            $("#googleMapsHref").attr('href', 'http://maps.google.com/maps?saddr=mi+ubicacion&daddr='+mapUbicacion(idCentro));
        }
    }

    function initializeGoogleMaps(idDiv, idCentro) {

        var dataJson;
        var latitud = "19.3971997";
        var longitud = "-99.2830913";
    
        for (var name in centrosAppArray) {
            if (name == idCentro)
            dataJson = JSON.parse(centrosAppArray[name]);
        }
        if (dataJson!=undefined){
            if (dataJson.Latitud!=""&&dataJson.Longitud!=""){
                latitud = dataJson.Latitud;
                longitud = dataJson.Longitud;
            }
        }

        appMaps(idCentro,latitud,longitud);

		var mapOptions = {
			center: new google.maps.LatLng(latitud,longitud),
			zoom : 15,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

        var map = new google.maps.Map(document.getElementById(idDiv), mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitud,longitud),
            map: map,
            title: 'GICSA'
        });

        marker.setMap(map);
	}

    function initializeMap(dS, dD, origin, destination, id) {

		var mapOptions = {
			center : destination,
			zoom : 12,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

        var map = new google.maps.Map(document.getElementById(id), mapOptions);

        alert(destination);
        var marker = new google.maps.Marker({
            position: destination,
            map: map,
            title: 'GICSA'
        });

		//calculateAndDisplayRoute(dS, dD, origin, destination);
		//dD.setMap(map);
        marker.setMap(map);

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
                //alert("Geocode was not successful for the following reason: " + status);
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

// END_CUSTOM_CODE_ubicacionView