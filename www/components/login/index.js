'use strict';

app.login = kendo.observable({
    onShow: function () {
        console.log("login");
        if (localStorage.authToken != "") { }

    },
    username: "",
    password:"",
    afterShow: function () { },
    signIn: function (e) {
        var self = app.login;
        console.log("sign in");
        console.log("user: " + app.login.username)
       
        if (app.login.username != "" && app.login.password != "") {

            self.authenticate(app.login.username, app.login.password);

        } else {

            alert("enter your user name and password")

        }


       
       
    },
    authenticate: function (username,password) {
        var self = this;
        app.mobileApp.pane.loader.show();
        var objUser = { "uid": app.login.username, "pass": app.login.password };
        var data = JSON.stringify(objUser);
        console.log("authenticating");
        app.login.username = "";
        app.login.password = "";


 $.ajax({
            url: "https://bdoauth.azurewebsites.net/api/HttpTriggerJS1?code=gTLGarZBaQ9Rn1taYa9cHFDlXDdg7gNI2CoukDiuRBq4lanwh3fQdQ==",
            method: "POST",
            dataType: "json",
            data: data,
            success: function (data) {
                console.log(data)

                if (data.token ) {
                    var jwt = util.parseJWT(data.token)
                    console.log(jwt.uid)
                   // alert("user authenticated");
                    localStorage.uid = jwt.uid;
                    localStorage.authToken = data.token;
                    self.getData(data.token,jwt.uid)
                
                } else {
                    alert("password or user name is incorrect");
                }
                // Calculate the expiration by adding the exp value (in seconds) to the 
                // base date of 1/1/1970.
                //var minTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                //var expire = minTime.AddSeconds(exp);



                //$.ajax({
                //    url: "https://bdo2.azurewebsites.net/tables/users?zumo-api-version=2.0.0",
                //    method: "GET",
                //    success: function (data) { console.log(data) },
                //    error: function (err) { console.log(err) },
                //    beforeSend: function (xhr) {
                //        //xhr.setRequestHeader("Authorization", "Bearer " + results.mobileServiceAuthenticationToken);
                //        xhr.setRequestHeader('X-ZUMO-AUTH', data.token); //  
                //    },
                //})


            },
            error: function (err) { console.log(err) },
           
        })


    },
    getData: function (token,uid) {
        app.mobileApp.pane.loader.hide();

       
        app.dsTrans = bdoData.createDS("transactions", token, uid, bdoData.dsTransModel, bdoData.dsTransAgg, bdoData.dsTransSort)     
        app.mobileApp.navigate("components/transactions/view.html"); 
       
    }
});
app.localization.registerView('login');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home