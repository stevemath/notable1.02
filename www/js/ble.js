//document.addEventListener('deviceready', onDeviceReady.bind(this), false);

//function onDeviceReady() {
//    alert("device ready")
//    window.cordova = true;
//    if (window.cordova) {
//        alert("cordova detected");
//       // scanBLE.startScan();
//    } else {
//        alert("cordova NOT detected")
//    }
//}
var scanBLE = {
    checkBLE: function () {
       
        alert("enable ble")
        ble.enable(function () {
            alert("bluetooth enabled");
            scanBLE.checkBLE();
        }, function () {
            alert("bluetooth NOT enabled");
        });
    },
    startScan: function () {
       // $("#BTLog").html("");
       
        alert("Start Scanning?");
        connected = false;
       
        setInterval(function () {

            if (isScanning == false) {
                // alert("start scanning");
                isScanning = true;
                ble.startScanWithOptions([], { reportDuplicates: true }, function (device) {
                    // alert(JSON.stringify(device));

                    //$("#BTLog").append(JSON.stringify("1 " + device.id.toString()) + "<br><br>");
                    //$("#BTLog").append(JSON.stringify("2 " + beacons[0].id.toString()) + "<br><br>");
                    var bIdx = -1;
                    var topRSSI = -10000;
                    $.map(beacons, function (elem, index) {
                        if (elem.id == device.id.toString()) {
                            if (elem.avgRSSI > topRSSI) {
                                bIdx = index;
                                topRSSI = elem.avgRssi;
                            }
                            return true;
                        }
                    });

                    //device.id.toString() == beacons[0].id.toString()  

                    if (bIdx >= 0) {
                        // alert("match found");
                        // $("#BTLog").prepend( beacons[0].avgRSSI + "<br><br>");
                        // $("#BTLog").prepend( beacons[0].samples + "<br><br>");
                        // $("#BTLog").prepend( beacons[0].totalRSSI + "<br><br>");

                        beacons[bIdx].samples = beacons[bIdx].samples + 1;
                        beacons[bIdx].rssi.push(parseInt(device.rssi));
                        if (beacons[bIdx].rssi.length > maxSampling) {
                            beacons[bIdx].rssi.shift();
                        }
                        //$("#BTLog").prepend(beacons[bIdx].rssi.join(",") + "<br><br>");

                        var sum = beacons[bIdx].rssi.reduce((a, b) => a + b, 0);
                        beacons[bIdx].totalRSSI = sum;

                        beacons[bIdx].avgRSSI = beacons[bIdx].totalRSSI / beacons[bIdx].rssi.length;
                        $("#BTLog").prepend(sum + " ... " + beacons[bIdx].avgRSSI + "<br><br>");

                        var d = calcDistance(4, beacons[bIdx].avgRSSI);
                        //alert(d);
                        $("#BTLog").prepend("***" + d + " m " + " " + device.rssi + "<br><br>");
                    } else {
                        // $("#BTLog").prepend( d + " m <br><br>");
                    }

                    if (device.id == beacons[bIdx].id && beacons[bIdx].avgRSSI > -55 && beacons[bIdx].samples >= maxSampling) {
                        beacons[bIdx].rssi = [];
                        $("#BTLog").prepend(JSON.stringify(device) + "<br><br>");
                        var id = device.id;
                        app.home.connectTo(id, bIdx);
                        alert("beacon found");
                        beacons[bIdx].samples = 0;
                        beacons[bIdx].totalRSSI = 0;
                        ble.stopScan(function () {
                            isScanning = false;

                        });
                        connected = true;
                    }


                }, function (e) {
                    alert(JSON.stringify(e));
                });

            }
        }, 20000);

    },
    stopScan: function () {

        $("#BTLog").html("");
        ble.stopScan(function () {
            isScanning = false;

        });
        connected = false;
    }




}

function calcDistance(txPower, rssi) {
    txPower = txPower - 58;
    if (rssi == 0) {
        return -1.0; // if we cannot determine distance, return -1.
    }

    var ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio, 10);
    }
    else {
        var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
        return accuracy;
    }
}

function getRange(txCalibratedPower, rssi) {
    var ratio_db = txCalibratedPower - rssi;
    var ratio_linear = Math.pow(10, ratio_db / 10);

    var r = Math.sqrt(ratio_linear);
    return r;
}

function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}