var scanBLE = function () {

   // evothings.eddystone.startScan(success, error)


    alert("scanning")

    ble.startScanWithOptions([], { reportDuplicates: true }, function (device) {
         alert(JSON.stringify(device));

        //  var bIdx = -1;
        //var topRSSI = -10000;
        //$.map(beacons, function (elem, index) {
        //    if (elem.id == device.id.toString()) {
        //        if (elem.avgRSSI > topRSSI) {
        //            bIdx = index;
        //            topRSSI = elem.avgRssi;
        //        }
        //        return true;
        //    }
        //});

        
        //if (bIdx >= 0) {
        //    // alert("match found");
           
        //    beacons[bIdx].samples = beacons[bIdx].samples + 1;
        //    beacons[bIdx].rssi.push(parseInt(device.rssi));
        //    if (beacons[bIdx].rssi.length > maxSampling) {
        //        beacons[bIdx].rssi.shift();
        //    }
           
        //    var sum = beacons[bIdx].rssi.reduce((a, b) => a + b, 0);
        //    beacons[bIdx].totalRSSI = sum;

        //    beacons[bIdx].avgRSSI = beacons[bIdx].totalRSSI / beacons[bIdx].rssi.length;
        //    $("#BTLog").prepend(sum + " ... " + beacons[bIdx].avgRSSI + "<br><br>");

        //    var d = calcDistance(4, beacons[bIdx].avgRSSI);
        //    $("#BTLog").prepend("***" + d + " m " + " " + device.rssi + "<br><br>");
        //} else {
            
        //}

        //if (device.id == beacons[bIdx].id && beacons[bIdx].avgRSSI > -55 && beacons[bIdx].samples >= maxSampling) {
        //    beacons[bIdx].rssi = [];
        //    $("#BTLog").prepend(JSON.stringify(device) + "<br><br>");
        //    var id = device.id;
        //    app.home.connectTo(id, bIdx);
        //    alert("beacon found");
        //    beacons[bIdx].samples = 0;
        //    beacons[bIdx].totalRSSI = 0;
        //    ble.stopScan(function () {
        //        isScanning = false;

        //    });
        //    connected = true;
        //}


    }, function (e) {
        alert(JSON.stringify(e));
    });
    //function success(beacon) {
    //    alert("success");
    //    alert(JSON.stringify(beacon));
    //}

    //function error() { alert("error") }

}