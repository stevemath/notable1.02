'use strict';

app.config = kendo.observable({
 
    onShow: function () {
        console.log("home");
       // console.log(app['home']);
        console.log(this);
        kendo.bind(this.element[0], app['config'].strings['config'])

        var self = this;
        
        scanBLE.init();
        
       
        $("#btnScanBT").on("click", function () {
            scanBLE.startScan();
        });


        $("#btnStopScanBT").on("click", function () {
            $("#BTLog").html("");
            ble.stopScan(function () {
                scanBLE.isScanning = false;

            });
            scanBLE.connected = false;
        });
       

    },
    afterShow: function() {}
});
app.localization.registerView('config');



// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home