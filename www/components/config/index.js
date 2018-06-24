'use strict';

app.config = kendo.observable({
 
    onShow: function () {
        console.log("home");
       // console.log(app['home']);
        console.log(this);
        kendo.bind(this.element[0], app['config'].strings['config'])

        var self = this;
        
        
        
       
       
       // scanBLE.startScan();
       

    },
    afterShow: function() {}
});
app.localization.registerView('config');



// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home