var config = {
    databaseURL: "https://bdo2.azurewebsites.net/tables/",
    suffix: "?zumo-api-version=2.0.0",

}


bdoData = {
    //CCA11F9C-D9C5-4594-B3E4-998B3F8BEAA8
    //D64FBDC5-CC52-45F9-95F9-F50E5DFB1DA2

    dsTransModel: {
        id: 'id',
        fields: {
            
            uid: { type: "string" },
            transDate: { type: "date" },
            amount: {type:"number"}
        }
    },
    dsTransAgg: [{ field: "amount", aggregate: "sum" }, { field: "amount", aggregate: "count" }],
    dsTransSort: { field: "transDate", dir: "desc" },
    createDS: function getTblDataSource(tbl, authToken, uid, model, agg,sort) {
    console.log("get ds");

    var dataSource = new kendo.data.DataSource({
        // autoSync: true, // recommended
        sync: function (e) {
            console.log("sync complete");
            console.log(e)
        },
        schema: {
            aggregates: "aggregates",
            model: model,
            
        },
        serverAggregates: false,
        aggregate: agg,
        sort: sort,
        transport: {

            read: {
                //parse: function () {


                //},
                url: function (options) {
                     console.log(options)
                    return config.databaseURL + tbl + config.suffix + "&$filter=(uid+eq+'" + uid +"')"
                },
                dataType: "json",
                contentType: "application/json",
                beforeSend: function (req) {
                    //req.setRequestHeader('Authorization', "Bearer " + authToken);
                    req.setRequestHeader('X-ZUMO-AUTH', authToken);
                },

            },
            update: {
                url: function (options) {

                    return config.databaseURL + tbl + config.suffix + "&id=" + options.id
                },
                dataType: "json",
                type: "PATCH",
                contentType: "application/json",
                success: function (options) { console.log(options) },
                beforeSend: function (req) {
                    //req.setRequestHeader('Authorization', "Bearer " + authToken);
                    req.setRequestHeader('X-ZUMO-AUTH', authToken);
                },


            },
            destroy: {
                url: function (options) {
                    console.log(options)
                    return config.databaseURL + tbl + "/" + options.id + config.suffix
                },
                dataType: "json",
                type: "DELETE",
                contentType: "application/json",
                beforeSend: function (req) {
                   // req.setRequestHeader('Authorization', authToken);
                    req.setRequestHeader('X-ZUMO-AUTH', authToken);
                },
            },
            create: {
                url: function (options) {
                    console.log(options)
                    return config.databaseURL + tbl + config.suffix
                },
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                beforeSend: function (req) {
                    //req.setRequestHeader('Authorization', authToken);
                    req.setRequestHeader('X-ZUMO-AUTH', authToken);
                },
            },
            parameterMap: function (data) {

               // console.log(JSON.stringify(data));
                delete data['deleted'];
                delete data['createdAt'];
                delete data['updatedAt'];

                var finalData = $.extend(data, { uid: localStorage.uid})
                 return JSON.stringify(finalData);
              //  return data;
            }
        },
        requestEnd: function (e) {
            var response = e.response;
            var type = e.type;
            console.log(response);
            if (type == "create") {

                events.publish("createCompleted", {tbl:tbl});
            }
        },
        requestStart: function (e) {
            console.log(e);
        },
        pageSize: 12,

    });

    dataSource.fetch(function () {
        console.log("ds fetched");
        console.log(this.data());
        events.publish("dsDataReady", {tbl:tbl,data:this.data()})
       // setupGridUsers();
    });

    return dataSource;
}



}

