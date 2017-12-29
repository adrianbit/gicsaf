'use strict';

app.tiendasView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { gotoMenu(); return; } else { $("#selectedPlazaTiendas").html(CENTROS_APP); } 

        loadCategoriasTiendas();

        var selectedPlazaCookie = getCookie("initial");

        changeColor(selectedPlazaCookie);

        $("#searchTiendas").val("");
        $("#selectedPlazaTiendas").val(selectedPlazaCookie);
        $("#selectedPlazaTiendas").change(function() { 
            changeColor($("#selectedPlazaTiendas").val());
            loadTiendas($("#selectedPlazaTiendas").val());
            setCookie("initial",$("#selectedPlazaTiendas").val(),30);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        $("#categoriasTiendas").change(function() { 
            loadTiendasCategoriaSearch(selectedPlazaCookie);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        $("#searchTiendas").keypress(function(e) {
            if(e.which == 13) {
                loadTiendasCategoriaSearch(selectedPlazaCookie);
            }
        });
        
        
        //location = '#tiendasViewScreen';
        loadTiendas(selectedPlazaCookie);
    }
});
app.localization.registerView('tiendasView');

// START_CUSTOM_CODE_tiendasView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function loadCategoriasTiendas(){
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetAllCategories";

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {
        var categorias = xhr.GetAllCategoriesResult;

        for (var x=0;x<categorias.length;x++) {
            $("#categoriasTiendas").append("<option value='" + categorias[x].Id + "'>" + categorias[x].Nombre + "</option>");
        }
    });
}

function loadTiendas(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetTiendaByFilters?centroId="+selectedPlazaCookie;

    $("#tiendasResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var tiendas = xhr.GetTiendaByFiltersResult;
        setDataTiendas(tiendas);

        $(".imgData").css("background","none");
    });
}

function loadTiendasCategoriaSearch(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetTiendaByFilters?centroId="+selectedPlazaCookie;

    var categoriaId = $("#categoriasTiendas").val();
    if (categoriaId != ""){
        urlService = urlService + "&categId="+categoriaId;
    }

    var search = $("#searchTiendas").val();
    if (search != ""){
        urlService = urlService + "&nombre="+search;
    }

    $("#tiendasResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var tiendas = xhr.GetTiendaByFiltersResult;
        setDataTiendas(tiendas);

        $(".imgData").css("background","none");
    });
}

function setDataTiendas(tiendas){

    $(".loadingData").hide();
    
    if (tiendas.length==0){
        $("#tiendasResponse").html('<span style="color:white;margin-top:20px;">No se encontraron tiendas.</span>');
        return;
    }

    for (var x=0;x<tiendas.length;x++) {

        var idTienda = tiendas[x].Id;
        var tituloTienda = tiendas[x].Nombre;
        var imageTienda = tiendas[x].LogoURL;
        var detalleTienda = tiendas[x].DetalleURL;
        var horarioTienda = tiendas[x].Horario;
        var telefonoTienda = tiendas[x].Telefono;

        var display = "none";
        if (detalleTienda.length >= 400){
            detalleTienda = detalleTienda.substring(0, 398);
            display = "block";
        }

        var share = "share('Tienda : "+tituloTienda+"', '', '"+imageTienda+"', '"+detalleTienda+"');";

        var htmlTienda = '' +
            '<div class="row" style="padding:20px 0px 0px;background-color:white;">'+
                '<div class="col-xs-12" style="padding:0px;">'+
                    '<img id="imgT'+idTienda+'" src="" class="imgData" style="width:100%;background: url(images/img_precarga_generica_tiendas.gif) 100%;min-height:160px;min-width:100%;background-size:cover;"/>'+
                '</div>'+
                '<div class="col-xs-12" style="margin-top:10px;text-align:left;padding:0px 30px;">'+
                    '<span style="font-weight:bold;">'+tituloTienda+'</span>'+
                    '<br/>'+
                    '<span style="font-weight:bold;">'+""+'</span>'+
                '</div>'+
                '<div class="col-xs-12 tal" style="margin:10px 0px 10px;padding:0px 30px;">'+
                    '<span>'+""+'</span>'+
                    '<br/>'+
                    '<span>'+horarioTienda+'</span>'+
                    '<br/>'+
                    '<a href="'+detalleTienda+'" target="_blank" style="display:'+display+'">Leer más</a>'+
                    '<hr/>'+
                '</div>'+
                '<div class="col-xs-6 tal" style="padding-left:30px;"><a href="tel:'+telefonoTienda+'"><img src="images/call-icon.svg" style="width:36px;cursor:pointer;"/></a></div>'+
                '<div class="col-xs-6 tar" style="padding-right:30px;"><img src="images/share-icon.svg" onclick="'+share+'" style="width:30px;cursor:pointer;"/></div>'+
                '<div class="col-xs-12"><hr style="border:2px solid #dcdcdc;width:130%;margin-left:-20%;"/></div>'+
            '</div>';

        $(".loadingData").hide();
        $("#tiendasResponse").append(htmlTienda);
    }

    for (var x=0;x<tiendas.length;x++) {

        var idTienda = tiendas[x].Id;
        var imageTienda = tiendas[x].LogoURL + "&size=450";

        $("#imgT"+idTienda).attr('src', imageTienda);
    }
}

// END_CUSTOM_CODE_tiendasView