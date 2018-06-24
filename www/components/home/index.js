'use strict';

app.home = kendo.observable({
    onShow: function () {
        console.log("home");
        console.log(app['home']);
        console.log(this);
        kendo.bind(this.element[0], app['home'].strings['home'])
    },
    afterShow: function() {}
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home