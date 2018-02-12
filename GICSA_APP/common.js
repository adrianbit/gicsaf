//var SERVER = "http://167.114.156.36";
var SERVER = "http://gicsanetwork.com";

var SERVERDEV = "http://167.114.156.36";
var SERVERTEMP = "http://gicsanetwork.com";
var CENTROS_APP = "";
var centrosAppArray = {};

var loadingHtml = ''+
    '<div class="row loadingData" style="padding:20px 10px 0px;" id="loadingData">'+
        '<div class="col-xs-12 tac" style="padding:20px;">'+
            '<img src="images/loading.gif" style="width:50%;margin-top:30px;"/>'+
        '</div>'+
    '</div>';

function gotoMenu(){
    app.mobileApp.navigate('components/menuView/view.html');
}

function commonData(){
    $.ajax({
        url: SERVER + "/api/appconfig/configapps",
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {
        var data = xhr.value;
        for (var x=0;x<data.length;x++) {
            if (data[x].Key=="EMAIL"){
                $("#gicsaMail").attr('href', 'mailto:'+data[x].Value);
            } else if (data[x].Key=="TWITTER"){
                $("#gicsaTwitter").attr('href', data[x].Value);
            } else if (data[x].Key=="TELEFONO"){
                $("#gicsaContacto").attr('href', 'tel:'+data[x].Value);
            } else if (data[x].Key=="YOUTUBE"){
                $("#gicsaYouTube").attr('href', data[x].Value);
            } else if (data[x].Key=="WHATSAPP"){
                //$("#gicsaWhats").attr('href', 'whatsapp://tel:'+data[x].Value);
            } else if (data[x].Key=="FACEBOOK"){
                $("#gicsaFacebook").attr('href', data[x].Value);
            }
        }
    });
}

commonData();

function loadCentros(idSelect){

    var centrosApp = getCookie("centrosApp");

    if(centrosApp==""){

        var centrosSort = [];
        var centrosResponse = [];

        $.ajax({
            url: SERVER + "/api/appconfig/appcentros",
            contentType: "application/json; charset=utf-8",
            dataType: "json", 
        }).done(function(xhr) {

            var data = xhr.value;

            for (var x=0;x<data.length;x++) {
                centrosSort.push(data[x].Title);
            }
            centrosSort = centrosSort.sort();

            var centros = [];
            var ajaxCalls = [];

            var centrosSelect = "<option style='color:#8a8a8a;' value=''>SELECCIONAR CENTRO COMERCIAL</option>";
            for (var i=0;i<centrosSort.length;i++) {

                for (var x=0;x<data.length;x++) {

                    if (data[x].Title == centrosSort[i]){

                        centrosSelect = centrosSelect + "<OPTION style='color:#8a8a8a;' value='" + data[x].IdCentro + "'>" + data[x].Title + "</OPTION>";
                        //setCookie(("ubicacionCookie"+data[x].IdCentro),data[x].Title,30);
                        centrosAppArray[data[x].IdCentro] = JSON.stringify(data[x]);

                    }
                }
            }

            CENTROS_APP = centrosSelect;
            $("#"+idSelect).html(centrosSelect);

            $("#popUp0").hide();
            $("#popUp1").show();
            
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            
            CENTROS_APP = noDataSelectCentros;
            $("#"+idSelect).html(CENTROS_APP);
            centrosAppArray = noDataArrayCentros;

            $("#popUp0").hide();
            $("#popUp1").show();
        });
    }
}

function loadSelectCentros(id){
    var centrosApp = getCookie("centrosApp");
    $("#"+id).append(centrosApp);
}

function overlayMenu(id){
    $("#"+id).css("-webkit-filter", "brightness(70%)");
    $("#"+id).css("filter", "brightness(70%)");
}

function share(message, subject, image, link){
    var onSuccess = function(result) {
        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }

    var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
    }

    window.plugins.socialsharing.share(message, subject, image, link, onSuccess, onError);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function mapUbicacion(idCentro){
    //selectedPlaza = filterId(selectedPlaza);
    //return getCookie("ubicacionCookie"+selectedPlaza);
    var dataJson;
    for (var name in centrosAppArray) {
        if (name == idCentro)
        dataJson = JSON.parse(centrosAppArray[name]);
    }
    if (dataJson!=undefined){
        return dataJson.Title;
    }  
}

function changeColor(idCentro){
    //var color = getGradientColor(selectedPlaza);
    //selectedPlaza = filterId(selectedPlaza);
    //var color = getCookie("colorCookie"+selectedPlaza);
    var dataJson;
    for (var name in centrosAppArray) {
        if (name == idCentro)
        dataJson = JSON.parse(centrosAppArray[name]);
    }
    if (dataJson!=undefined){
        var color = dataJson.Color;
        var gradient = "linear-gradient(to right, "+color+" 0%, "+color+" 100%)";
        $(".insideHeader").css("background-image",gradient);
        $(".insideGrid").css("background-image",gradient);
        $(".insideHeader").css("background-color",color);
        $(".insideGrid").css("background-color",color);
        $(".km-content").css("background-image",gradient);
        $(".km-view").css("background-color",color);
    }
}

function getColor(idCentro){
    var dataJson;
    for (var name in centrosAppArray) {
        if (name == idCentro)
        dataJson = JSON.parse(centrosAppArray[name]);
    }
    return dataJson.Color;
}

function logoCentro(idCentro){

    $.ajax({
        url: SERVERTEMP + "/api/appconfig/appcentros("+idCentro+")/Logo",
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {
        $('#logoCentroComercial').attr('src', xhr.Url);
    });
}

function logoPlaza(idCentro,idImage){

    var dataJson;
    for (var name in centrosAppArray) {
        //alert(name + " - " + idCentro + " : " + (name == idCentro));
        if (name == idCentro)
        dataJson = JSON.parse(centrosAppArray[name]);
    }

    $.ajax({
        url: SERVERTEMP + "/api/appconfig/appcentros("+dataJson.Id+")/Logo",
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {
        $('#'+idImage).attr('src', xhr.Url);
    });
}

function initSocial(data){

    hideIcons();

    if (data.Email!=""){
        $("#mailCentroHref").show();
        $("#mailCentroHref").attr("href", ("mailto:"+data.Email));
    }
    if (data.Instagram!=""){
        $("#instagramCentroHref").show();
        $("#instagramCentroHref").attr("href", data.Instagram);
    }
    if (data.Twitter!=""){
        $("#twitterCentroHref").show();
        $("#twitterCentroHref").attr("href", data.Twitter);
    }
    if (data.Facebook!=""){
        $("#facebookCentroHref").show();
        $("#facebookCentroHref").attr("href", data.Facebook);
    }
    if (data.YouTube!=""){
        $("#youtubeCentroHref").show();
        $("#youtubeCentroHref").attr("href", data.YouTube);
    }

}

function mapIframe(selectedPlaza, id){

    var key = mapUbicacion(selectedPlaza);

    //var urlMap = "https://www.mapsdirections.info/crear-un-mapa-de-google/map.php?width=100%&height=600&hl=en&q="+key+"&ie=UTF8&t=&z=14&iwloc=A&output=embed";
    var urlMap = "https://www.google.com/maps/embed/v1/directions?origin=mi+ubicacion&destination="+key+"&key=AIzaSyC0LIfIwD5-WT2s6MshjpFiP5tZXULw7LU";

    $('#'+id).attr('src', (urlMap));
}

function inspect(obj) {
	var msg = '';
	for ( var property in obj) {
		if (typeof obj[property] == 'function') {
			var inicio = obj[property].toString().indexOf('function');
			var fin = obj[property].toString().indexOf(')') + 1;
			var propertyValue = obj[property].toString().substring(inicio, fin);
			msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
		} else if (typeof obj[property] == 'unknown') {
			msg += 'unknown ' + property + ' : unknown ;\n';
		} else {
			msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
		}
	}
	console.log("Inspect : \n" + msg);
	return msg;
}

function filterId(idCentro){

    /**if (idCentro=="83b439e7-499a-4962-a648-1e91e424f906"){
        idCentro="21f050cb-aae4-41d8-a446-cc2f22f1089f";
    } else if (idCentro=="d7434e84-6f26-477b-b46f-35c8b2a4ecdf"){
        idCentro="df735de5-a452-4726-8ca4-189978d5da65";
    } else if (idCentro=="d18747eb-ce2b-41b9-8d29-f1e16641b6fd"){
        idCentro="92ce3b14-7a2b-4580-9c86-bb1df0410b16";
    } else if (idCentro=="4b49cbc1-e2d3-445f-a2cf-178fa051e2c5"){
        idCentro="691319f2-46fa-49e2-9d47-efff8c9587aa";
    } else if (idCentro=="79630433-dd66-4d3c-bf16-eb9c66eed6fd"){
        idCentro="80098573-036f-485e-bdef-8d3cf3f9172e";
    } else if (idCentro=="4a42c61d-4623-4a0a-aea5-8475fb40bcc8"){
        idCentro="a814cd34-18dc-46ae-b6b3-2ed5824a38f8";
    } else if (idCentro=="fa9bdb45-dedd-4fd0-aae0-8fa2bed05077"){
        idCentro="10bfa88b-9760-4770-a84c-cc65f620cc2f";
    } else if (idCentro=="39137cf6-8270-400c-9099-16a4caf4ee81"){
        idCentro="c84cfcc7-dadb-4343-b849-63b0501ac2be";
    } else if (idCentro=="81fbe51d-2ee4-45e8-ae49-cc99d40ce8a0"){
        idCentro="960911b2-cb2a-4f3b-adee-1cc921f0c609";
    } else if (idCentro=="2307a665-6299-4215-b523-77ba38bb48e0"){
        idCentro="77028d8a-1929-4d65-aab4-7ea2c64c0285";
    } */

    return idCentro;
}

function downloadIcs(title,description,location,begin,end){
    var cal = ics();
    cal.addEvent(title, description, location, begin, end);
    cal.download("evento");
}

function formatDate(date){
    var formated = date.split('/');
    return formated[1]+"/"+formated[0]+"/20"+formated[2];
}

function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test(email);
}