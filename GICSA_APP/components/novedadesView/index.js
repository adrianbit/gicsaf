'use strict';

app.novedadesView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { app.mobileApp.navigate('components/home/view.html'); return; } else { $("#selectedPlazaNovedades").html(CENTROS_APP); } 

        var selectedPlazaCookie = getCookie("initial");
        changeColor(selectedPlazaCookie);
        $("#selectedPlazaNovedades").val(selectedPlazaCookie);
        $("#selectedPlazaNovedades").change(function() { 
            changeColor($("#selectedPlazaNovedades").val()); 
            loadNovedades($("#selectedPlazaNovedades").val());
            setCookie("initial",$("#selectedPlazaNovedades").val(),30);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        loadNovedades(selectedPlazaCookie);
    }
});
app.localization.registerView('novedadesView');

// START_CUSTOM_CODE_novedadesView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function loadNovedades(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetNoticiasDestacadosByCentro?centroId="+selectedPlazaCookie;

    $("#novedadesResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var novedades = xhr.GetNoticiasDestacadosByCentroResult;

        $(".loadingData").hide();
    
        if (novedades.length==0){
            $("#novedadesResponse").html('<span style="color:white;margin-top:20px;">No se encontraron novedades.</span>');
            return;
        }

        for (var x=0;x<novedades.length;x++) {

            var tituloNovedad = novedades[x].Titulo;
            var imageNovedad = novedades[x].ImagenUrl;
            var detalleNovedad = novedades[x].DetalleUrl;
            var inicioNovedad = novedades[x].Subtitulo;
            var fechaNovedad = novedades[x].Fecha == undefined ? "" : novedades[x].Fecha;
            var contenidoNovedad = novedades[x].Contenido;

            var displayLink = "none";
            var displayContent = "block";

            if (contenidoNovedad.length >= 180){
                displayLink = "block";
                displayContent = "none";
            }

            var share = "share('Noticia : "+tituloNovedad+"', '', '"+imageNovedad+"', '"+detalleNovedad+"');";

            var subNovedad = "";

            if (inicioNovedad!=""){
                subNovedad = '<div class="col-xs-12 tal" style="margin:20px 0px 10px;padding:0px 30px;">'+
                                '<span>'+inicioNovedad+'</span>'+
                                '<br/>'+
                                '<hr/>'+
                            '</div>';
            } 

            var htmlNovedad = '' +
                '<div class="row" style="padding:0px 0px 20px;background-color:white;">'+
                    '<div class="col-xs-12" style="padding:0px;">'+
                        '<img src="'+imageNovedad+'&size=450" style="width:100%;background: url(images/placeholder.jpg) 100%;background-size:contain;min-height:160px;min-width:100%;"/>'+
                    '</div>'+
                    '<div class="col-xs-12" style="margin-top:20px;text-align:left;padding:0px 30px;">'+
                        '<span>'+tituloNovedad+'</span>'+
                        '<br/>'+
                        '<a id="newL'+x+'" href="javascript:$(&#39;#new'+x+'&#39;).show(&#39;&#39;);$(&#39;#newL'+x+'&#39;).hide();" style="display:'+displayLink+'">Leer más</a>'+
                        '<div id="new'+x+'" style="text-align:justify;margin-top:5px;color:#9e9e9e;display:'+displayContent+'">'+contenidoNovedad+'</div>'+
                    '</div>'+
                    subNovedad +
                    '<div class="col-xs-12 tal" style="margin:10px 0px 10px;padding:0px 30px;">'+
                        '<span>'+fechaNovedad+'</span>'+
                        '<hr/>'+
                    '</div>'+
                    '<div class="col-xs-12 tar" style="padding-right:30px;"><img src="images/share-icon.svg" onclick="'+share+'" style="width:30px;"/></div>'+
                    '<div class="col-xs-12"><hr style="border:2px solid #dcdcdc;width:130%;margin-left:-20%;"/></div>'+
                '</div>';

            $(".loadingData").hide();
            $("#novedadesResponse").append(htmlNovedad);
        }
    });
}

// END_CUSTOM_CODE_novedadesView