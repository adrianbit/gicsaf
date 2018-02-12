'use strict';

var selectedPlaza = "";
var emailNewsletter = "";
var currentApp = app;
var defaultApp;

app.home = kendo.observable({
    onShow: function() { loadCentros("selectPopUp1"); },
    afterShow: function() { initFirebase(); }
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function initFirebase(){
    if (defaultApp==undefined){
        var config = {
            apiKey: "AIzaSyCl2CEfXNXuTJ7BXAdjfy1ZILftxkEq-uU",
            authDomain: "gicsa-apps.firebaseapp.com",
            databaseURL: "https://gicsa-apps.firebaseio.com",
            projectId: "gicsa-apps",
            storageBucket: "gicsa-apps.appspot.com",
            messagingSenderId: "382334266552"
        };
        defaultApp = firebase.initializeApp(config);
    }
}

function popUp1(){
    selectedPlaza = $("#selectPopUp1").val();
    if (selectedPlaza!=""){
        var cookieNewsletter = getCookie(("initial"+selectedPlaza));
        if (cookieNewsletter!=""){
            goToView(selectedPlaza);
        } else {
            $("#popUp1").hide();
            $("#popUp2").show("");
        }
    }
}

function popUp2(){
    $("#validacionHome").hide();
    emailNewsletter = $("#emailNewsletter").val();
    selectedPlaza = $("#selectPopUp1").val();
    if (emailNewsletter!="" && validateEmail(emailNewsletter)){

        var urlService = SERVER + "/CustomServices/Subscribers/SubscribersService/SubscribeUserEmail/email="+emailNewsletter;
        $.ajax({
            url: urlService
        }).done(function(xhr) {
            //alert(xhr.SubscribeUserEmailResult);
            setCookie("initial",selectedPlaza,30);
            setCookie(("initial"+selectedPlaza),selectedPlaza,30);
            goToView(selectedPlaza);
        });
    } else {
        $("#validacionHome").show();
    }
}

function popup3(){
    goToView(selectedPlaza);
    setCookie("initial",selectedPlaza,30)
}

function goToView(selectedPlaza){
    setCookie("initial",selectedPlaza,30)
    app.mobileApp.navigate("components/menuView/view.html");
}

// END_CUSTOM_CODE_home