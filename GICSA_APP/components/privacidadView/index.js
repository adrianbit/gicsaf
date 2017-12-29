'use strict';

app.privacidadView = kendo.observable({
    onShow: function() {},
    afterShow: function() {
        var gradient = "linear-gradient(to right, #f6a426 0%, #ff8a00 100%)";
        $(".insideHeader").css("background-image",gradient);
        $(".insideGrid").css("background-image",gradient);
        $(".km-content").css("background-image",gradient);
    }
});
app.localization.registerView('privacidadView');

// START_CUSTOM_CODE_privacidadView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_privacidadView