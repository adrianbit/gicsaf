'use strict';

app.menuView = kendo.observable({
    onShow: function() { },
    afterShow: function() {

        if (CENTROS_APP=="") { app.mobileApp.navigate('components/home/view.html'); return; } else { $("#selectedPlazaHome").html(CENTROS_APP); }

        var selectedPlazaCookie = getCookie("initial");

        if (selectedPlazaCookie==""){
            app.mobileApp.navigate('components/home/view.html');
        }

        toogleNewsletter(selectedPlazaCookie);

        initDataCentro(selectedPlazaCookie);

        $("#selectedPlazaHome").val(selectedPlazaCookie);

        $("#selectedPlazaHome").change(function() {

            var valThis = $("#selectedPlazaHome").val();
            if (getCookie(("initial"+valThis))!=""){
                //changeColor(valThis);
                //logoPlaza(valThis, "logoCentroComercial");
                //initSocialIcons(valThis);
                initDataCentro(valThis);
                setCookie("initial",valThis,30);
                toogleNewsletter(valThis);
            } else {
                app.mobileApp.navigate('components/home/view.html');
                $("#selectPopUp1").val(valThis);
                $("#selectPopUp1").change();
            }
        });
    }
});
app.localization.registerView('menuView');

// START_CUSTOM_CODE_menuView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function initDataCentro(idCentro){

    /** idCentro = filterId(idCentro);

    $.ajax({
        url: SERVERTEMP + "/api/appconfig/appcentros("+idCentro+")",
        contentType: "application/json; charset=utf-8",
        dataType: "json", 
        idCentro: idCentro,
    }).done(function(xhr) {
        changeColor(xhr.Id);
        logoCentro(xhr.Id);
        initSocial(xhr);
    });*/

    var dataJson;
    for (var name in centrosAppArray) {
        //alert(name + " - " + idCentro + " : " + (name == idCentro));
        if (name == idCentro)
        dataJson = JSON.parse(centrosAppArray[name]);
    }
    changeColor(idCentro);
    logoCentro(dataJson.Id);
    initSocial(dataJson);
}

function toogleNewsletter(selectedPlazaCookie){
    if (getCookie(("initial"+selectedPlazaCookie))!=""){
        $("#thankYou").show();
        $("#suscribeteHome").hide();
    } else {
        $("#thankYou").hide();
        $("#suscribeteHome").show();
    }
}

function newsletterHome(){

    var emailNewsletterHome = $("#emailNewsletterHome").val();
    if (emailNewsletterHome!="" && validateEmail(emailNewsletterHome)){
        var urlService = SERVER + "/CustomServices/Subscribers/SubscribersService/SubscribeUserEmail/email="+emailNewsletterHome;
        $.ajax({
            url: urlService
        }).done(function(xhr) {
            if (xhr.SubscribeUserEmailResult){
                $("#thankYou").show();
                $("#suscribeteHome").hide();
            }
        });
    } else {
        $("#validacionMenu").show();
    }
}

// END_CUSTOM_CODE_menuView