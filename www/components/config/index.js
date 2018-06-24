'use strict';

app.config = kendo.observable({
    connected: false,
    isScanning: false,
     maxSampling : 10,
         beacons : [],
    onShow: function () {
        console.log("home");
        console.log(app['home']);
        console.log(this);
        kendo.bind(this.element[0], app['config'].strings['config'])

        var self = this;
        
        
        
       
        var beacon = { id: "FB:40:29:8D:AB:59", avgRSSI: -1000, totalRSSI: 0, rssi: [], samples: 0 };
        app.config.beacons.push(beacon);

        beacon = { id: "EF:8A:07:B0:0E:3A", avgRSSI: -1000, totalRSSI: 0, rssi: [], samples: 0 };
        app.config.beacons.push(beacon);
        alert(JSON.stringify(app.config.beacons));
        alert("check bluetooth");
       
        scanBLE.startScan();

    },
    afterShow: function() {}
});
app.localization.registerView('config');



// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home