'use strict';

app.eventosView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { app.mobileApp.navigate('components/home/view.html'); return; } else { $("#selectedPlazaEventos").html(CENTROS_APP); }

        var selectedPlazaCookie = getCookie("initial");
        changeColor(selectedPlazaCookie);
        $("#selectedPlazaEventos").val(selectedPlazaCookie);
        $("#selectedPlazaEventos").change(function() { 
            changeColor($("#selectedPlazaEventos").val());
            loadEventos($("#selectedPlazaEventos").val());
            setCookie("initial",$("#selectedPlazaEventos").val(),30);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        loadEventos(selectedPlazaCookie);
    }
});
app.localization.registerView('eventosView');

// START_CUSTOM_CODE_eventosView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function loadEventos(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetEventosDestacadosByCentro?centroId="+selectedPlazaCookie;

    $("#eventosResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var eventos = xhr.GetEventosDestacadosByCentroResult;

        $(".loadingData").hide();
    
        if (eventos.length==0){
            $("#eventosResponse").html('<span style="color:white;margin-top:20px;">No se encontraron eventos.</span>');
            return;
        }

        for (var x=0;x<eventos.length;x++) {

            var idEvento = eventos[x].Id;
            var tituloEvento = eventos[x].Nombre;
            var imageEvento = eventos[x].ImagenUrl;
            var detalleEvento = eventos[x].DetalleUrl;
            var inicioEvento = eventos[x].Fecha;
            var centroEvento = eventos[x].NombreCentro;
            var contenidoEvento = eventos[x].Contenido;

            var displayLink = "none";
            var displayContent = "block";

            if (contenidoEvento.length >= 180){
                displayLink = "block";
                displayContent = "none";
            }

            tituloEvento = tituloEvento.replace('"','');
            tituloEvento = tituloEvento.replace('\"','');

            var share = "share('Evento : "+tituloEvento+"', '', '"+imageEvento+"', '"+detalleEvento+"');";
            
            //var calendar = "http://167.114.156.36:8032/Sitefinity/Public/Services/ICalanderService/file.ics/?id="+idEvento+"&provider=&uiculture=es";
            //var calendar = "http://www.google.com/calendar/event?action=TEMPLATE&text="+idEvento+"&dates=20171119T223000Z/20171120T013000Z&location=&sprop=website:"+idEvento+"&recur=";
            //var calendar = 'javascript:downloadIcs(&#39;'+tituloEvento+'&#39;,&#39;'+detalleEvento+'&#39;,&#39;'+centroEvento+'&#39;,&#39;'+formatDate(inicioEvento)+'&#39;,&#39;'+formatDate(inicioEvento)+'&#39;);';

            var calendar = 'javascript:addEvent(&#39;'+tituloEvento+'&#39;,&#39;'+detalleEvento+'&#39;,&#39;'+centroEvento+'&#39;,&#39;'+inicioEvento+'&#39;,&#39;'+inicioEvento+'&#39;)';

            var htmlEvento = '' +
                '<div class="row" style="padding:20px 0px 0px;background-color:white;">'+
                    '<div class="col-xs-12" style="padding:0px;">'+
                        '<img src="'+imageEvento+'&size=450" style="width:100%;background: url(images/img_precarga_generica_eventos_promociones.gif) 100%;background-size: contain;min-height:160px;min-width:100%;background-size:cover;"/>'+
                    '</div>'+
                    '<div class="col-xs-12" style="margin-top:20px;text-align:left;padding:0px 30px;">'+
                        '<span>'+tituloEvento+'</span>'+
                        '<br/>'+
                        '<a id="eventL'+x+'" href="javascript:$(&#39;#event'+x+'&#39;).show(&#39;&#39;);$(&#39;#eventL'+x+'&#39;).hide();" style="display:'+displayLink+'">Leer más</a>'+
                        '<div id="event'+x+'" style="text-align:justify;margin-top:5px;color:#9e9e9e;display:'+displayContent+'">'+contenidoEvento+'</div>'+
                    '</div>'+
                    '<div class="col-xs-12 tal" style="margin:20px 0px 10px;padding:0px 30px;">'+
                        '<span>'+inicioEvento+'</span>'+
                        '<br/>'+
                        '<hr/>'+
                    '</div>'+
                    '<div class="col-xs-6 tal" style="padding-left:30px;"><a href="'+calendar+'"><img src="images/calendar-icon.png" style="width:30px;cursor:pointer;"/></a></div>'+
                    '<div class="col-xs-6 tar" style="padding-right:30px;"><img src="images/share-icon.svg" onclick="'+share+'" style="width:30px;cursor:pointer;"/></div>'+
                    '<div class="col-xs-12"><hr style="border:2px solid #dcdcdc;width:130%;margin-left:-20%;"/></div>'+
                '</div>';

            $(".loadingData").hide();

            if(imageEvento!="")
            $("#eventosResponse").append(htmlEvento);
        }
    });
}

function addEvent(titulo, detalle, ubicacion, inicio, final){

    var td = inicio.split('/');
    var startDate = new Date(("20"+td[2]),(parseInt(td[1])-1),(parseInt(td[0])+1),0,0,0,0,0); // beware: month 0 = january, 11 = december
    var endDate = new Date(("20"+td[2]),(parseInt(td[1])-1),(parseInt(td[0])+1),0,0,0,0,0); // beware: month 0 = january, 11 = december
    //var startDate = new Date(2015,2,15,18,30,0,0,0); // beware: month 0 = january, 11 = december
    //var endDate = new Date(2015,2,15,19,30,0,0,0);
    var title = titulo;
    var eventLocation = ubicacion;
    var notes = detalle;
    var success = function(message) { };
    var error = function(message) { };

    window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);
}

// END_CUSTOM_CODE_eventosView