'use strict';

app.promocionesView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { app.mobileApp.navigate('components/home/view.html'); return; } else { $("#selectedPlazaPromociones").html(CENTROS_APP); } 

        loadCategorias();

        var selectedPlazaCookie = getCookie("initial");
        
        changeColor(selectedPlazaCookie);
        $("#selectedPlazaPromociones").val(selectedPlazaCookie);
        $("#selectedPlazaPromociones").change(function() { 
            changeColor($("#selectedPlazaPromociones").val());
            loadPromociones($("#selectedPlazaPromociones").val()); 
            setCookie("initial",$("#selectedPlazaPromociones").val(),30);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        $("#categoriasPromociones").change(function() { 
            loadPromocionesCategoriaSearch(selectedPlazaCookie);
            $('.km-scroll-container').css( "transform", "translate3d(0px, 0px, 0px) scale(1)");
        });
        $("#searchPromociones").keypress(function(e) {
            if(e.which == 13) {
                loadPromocionesCategoriaSearch(selectedPlazaCookie);
            }
        });
        loadPromociones(selectedPlazaCookie);
    }
});
app.localization.registerView('promocionesView');

// START_CUSTOM_CODE_promocionesView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function loadCategorias(){
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetAllCategories";

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {
        var categorias = xhr.GetAllCategoriesResult;

        for (var x=0;x<categorias.length;x++) {
            $("#categoriasPromociones").append("<option value='" + categorias[x].Id + "'>" + categorias[x].Nombre + "</option>");
        }
    });
}

function loadPromociones(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var color = getColor(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetPromocionesDestacadasByCentro?centroId="+selectedPlazaCookie;

    $("#promocionesResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var promociones = xhr.GetPromocionesDestacadasByCentroResult;
        setDataPromociones(promociones,color);
    });
}

function loadPromocionesCategoriaSearch(selectedPlazaCookie){

    //var centroId = getIdCentro(selectedPlazaCookie);
    var color = getColor(selectedPlazaCookie);
    var urlService = SERVER + "/CustomServices/CentrosComerciales/CentrosService/GetPromocionesByCentrosAndFilter?centroId="+selectedPlazaCookie;

    var categoriaId = $("#categoriasPromociones").val();
    if (categoriaId != ""){
        urlService = urlService + "&categId="+categoriaId;
    }

    var search = $("#searchPromociones").val();
    if (search != ""){
        urlService = urlService + "&tiendaName="+search;
    }

    $("#promocionesResponse").html(loadingHtml);
    $(".loadingData").show();

    $.ajax({
        url: urlService,
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
    }).done(function(xhr) {

        var promociones = xhr.GetPromocionesByCentrosAndFilterResult;
        setDataPromociones(promociones,color);
    });
}

function setDataPromociones(promociones,color){

    $(".loadingData").hide();
    
    if (promociones.length==0){
        $("#promocionesResponse").html('<span style="color:white;margin-top:20px;">No se encontraron promociones.</span>');
        return;
    }

    for (var x=0;x<promociones.length;x++) {

        var idPromocion = promociones[x].Id;
        var tituloPromocion = promociones[x].Titulo;
        var imagePromocion = promociones[x].ImagenUrl;
        var detallePromocion = promociones[x].DetalleUrl;
        var inicioPromocion = promociones[x].VigenciaInicio;
        var finPromocion = promociones[x].VigenciaFin;

        var stringPromocion = tituloPromocion + "|" + imagePromocion + "|" + detallePromocion + "|" + inicioPromocion + "|" + finPromocion +  + "|" + color;

        var display = "none";
        if (detallePromocion.length >= 400){
            detallePromocion = detallePromocion.substring(0, 398);
            display = "block";
        }

        var share = "share('Promoción : "+tituloPromocion+"', '', '"+imagePromocion+"', '"+detallePromocion+"');";

        var htmlPromocion = '' +
            '<div class="row" style="padding:20px 0px 0px;background-color:white;">'+
                '<div class="col-xs-12" style="padding:0px;">'+
                    '<img src="'+imagePromocion+'&size=450" style="width:100%;background: url(images/img_precarga_generica_promocion2.gif) 100%;min-height:160px;min-width:100%;background-size:cover;"/>'+
                '</div>'+
                '<div class="col-xs-12" style="margin-top:20px;text-align:left;padding:0px 30px;">'+
                    '<span>'+tituloPromocion+'</span>'+
                    '<br/>'+
                    '<a href="'+detallePromocion+'" target="_blank" style="color:'+color+';display:'+display+'">Leer más</a>'+
                '</div>'+
                '<div class="col-xs-12 tal" style="margin:20px 0px 0px;padding:0px 30px;">'+
                    '<span>Del '+inicioPromocion+' al '+finPromocion+'</span>'+
                    '<br/>'+
                    '<a href="#" style="color:'+color+'">Terminos y condiciones</a>'+
                    '<hr/>'+
                '</div>'+
                '<div class="col-xs-12 tal" id="promo'+idPromocion+'" style="margin:0px 0px 10px;padding:0px 30px;color:'+color+';display:none;">Promoción guardada</div>'+
                '<div class="col-xs-6 tal" style="padding-left:30px;"><a href="javascript:addCookiePromocion(&#39;'+stringPromocion+'&#39;,&#39;'+idPromocion+'&#39;)"><img src="images/download-icon.svg" style="width:32px;cursor:pointer;"/></a></div>'+
                '<div class="col-xs-6 tar" style="padding-right:30px;"><img src="images/share-icon.svg" onclick="'+share+'" style="width:30px;cursor:pointer;"/></div>'+
                '<div class="col-xs-12"><hr style="border:2px solid #dcdcdc;width:130%;margin-left:-20%;"/></div>'+
            '</div>';

        $("#promocionesResponse").append(htmlPromocion);
    }
}

function addCookiePromocion(promocion,idPromocion){

    var cookiePromociones = $.cookie('misPromociones');
    try { cookiePromociones = JSON.parse(cookiePromociones); } catch(err){}

    if (cookiePromociones == undefined){
        cookiePromociones = [];
        cookiePromociones[0] = promocion;
    } else {
        var tempPromos = cookiePromociones;
        var exist = false;
        for (var j=0;j<tempPromos.length;j++) {

            var oldProm = tempPromos[j];
            oldProm = oldProm.split("|")[0];

            var newProm = promocion;
            newProm = newProm.split("|")[0];

            if (oldProm == newProm){
                exist = true;
            }
        }
        if (!exist){
            tempPromos.push(promocion);
            cookiePromociones = tempPromos;
        }
    }

    $.cookie('misPromociones', JSON.stringify(cookiePromociones));
    $("#promo"+idPromocion).show('');

}

// END_CUSTOM_CODE_promocionesView