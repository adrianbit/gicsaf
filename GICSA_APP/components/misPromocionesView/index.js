'use strict';

app.misPromocionesView = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        loadMisPromociones();
    }
});
app.localization.registerView('misPromocionesView');

// START_CUSTOM_CODE_misPromocionesView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function loadMisPromociones(){

    $("#misPromocionesResponse").html(loadingHtml);
    $(".loadingData").show();

    var promociones = $.cookie('misPromociones');
    try { promociones = JSON.parse(promociones); } catch(err){}

    $(".loadingData").hide();
    if (promociones == undefined){
        $("#misPromocionesResponse").html("<span style='color:white;margin-top:20px;'>No se han registrado promociones</span>");
    } else {
        setDataMisPromociones(promociones);
    }
}

function delPromocion(titulo){
    var promociones = $.cookie('misPromociones');
    try { promociones = JSON.parse(promociones); } catch(err){}

    if (promociones != undefined){
        for (var x=0;x<promociones.length;x++) {

            var data = promociones[x].split("|");
            var tituloPromocion = data[0];

            if (tituloPromocion==titulo){
                promociones.splice(x, 1);
                break;
            }
        }
        $.cookie('misPromociones', JSON.stringify(promociones));
        $("#misPromocionesResponse").html("");
        setDataMisPromociones(promociones);
    }
}

function setDataMisPromociones(promociones){
    for (var x=0;x<promociones.length;x++) {

        var data = promociones[x].split("|");

        var tituloPromocion = data[0];
        var imagePromocion = data[1];
        var detallePromocion = data[2];
        var inicioPromocion = data[3];
        var finPromocion = data[4];

        var display = "none";
        if (detallePromocion.length >= 400){
            detallePromocion = detallePromocion.substring(0, 398);
            display = "block";
        }

        var share = "share('Promoción : "+tituloPromocion+"', '', '"+imagePromocion+"', '"+detallePromocion+"');";
        var del = "delPromocion('"+tituloPromocion+"')";

        var htmlPromocion = '' +
            '<div class="row" style="padding:20px 0px 0px;background-color:white;">'+
                '<div class="col-xs-12" style="padding:0px;">'+
                    '<img src="'+imagePromocion+'" style="width:100%;background: url(images/img_precarga_generica_promocion2.gif) 100%;min-height:160px;min-width:100%;"/>'+
                '</div>'+
                '<div class="col-xs-12" style="margin-top:20px;text-align:left;padding:0px 30px;">'+
                    '<span>'+tituloPromocion+'</span>'+
                    '<br/>'+
                    '<a href="'+detallePromocion+'" target="_blank" style="color::#333;display:'+display+'">Leer más</a>'+
                '</div>'+
                '<div class="col-xs-12 tal" style="margin:20px 0px 10px;padding:0px 30px;">'+
                    '<span>Del '+inicioPromocion+' al '+finPromocion+'</span>'+
                    '<br/>'+
                    '<a href="#" style="color:#333;">Terminos y condiciones</a>'+
                    '<hr/>'+
                '</div>'+
                '<div class="col-xs-6 tal" style="padding-left:30px;"><img src="images/trash-icon.svg" onclick="'+del+'" style="width:24px;cursor:pointer;"/></div>'+
                '<div class="col-xs-6 tar" style="padding-right:30px;"><img src="images/share-icon.svg" onclick="'+share+'" style="width:30px;cursor:pointer;"/></div>'+
                '<div class="col-xs-12"><hr style="border:2px solid #dcdcdc;width:130%;margin-left:-20%;"/></div>'+
            '</div>';

        $(".loadingData").hide();
        $("#misPromocionesResponse").append(htmlPromocion);
    }
}

// END_CUSTOM_CODE_misPromocionesView