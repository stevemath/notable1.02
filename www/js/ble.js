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
    connected: false,
    isScanning: false,
    maxSampling: 10,
    beacons: [],
    checkBLE: function () {
       
        alert("enable ble")
        ble.enable(function () {
            alert("bluetooth enabled");
           // scanBLE.startScan();
        }, function () {
            alert("bluetooth NOT enabled");
        });
    },
    init: function () {
        var self = this;

        var beacon = { id: "FB:40:29:8D:AB:59", avgRSSI: -1000, totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        beacon = { id: "EF:8A:07:B0:0E:3A", avgRSSI: -1000, totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);
        alert(JSON.stringify(app.config.beacons));
    },
    startScan: function () {
        $("#BTLog").html("");
        var self = this;
        alert("Start Scanning?");
        connected = false;
       
        setInterval(function () {

            if (self.isScanning == false) {
                // alert("start scanning");
                self.isScanning = true;
                ble.startScanWithOptions([], { reportDuplicates: true }, function (device) {
                    // alert(JSON.stringify(device));

                    $("#BTLog").append(JSON.stringify("1 " + device.id.toString()) + "<br><br>");
                    $("#BTLog").append(JSON.stringify("2 " + beacons[0].id.toString()) + "<br><br>");
                    var bIdx = -1;
                    var topRSSI = -10000;
                    $.map(self.beacons, function (elem, index) {
                        if (elem.id == device.id.toString()) {
                            alert("beacon match")
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

                        self.beacons[bIdx].samples = self.beacons[bIdx].samples + 1;
                        self.beacons[bIdx].rssi.push(parseInt(device.rssi));
                        if (self.beacons[bIdx].rssi.length > self.maxSampling) {
                            self.beacons[bIdx].rssi.shift();
                        }
                        //$("#BTLog").prepend(beacons[bIdx].rssi.join(",") + "<br><br>");

                        var sum = self.beacons[bIdx].rssi.reduce((a, b) => a + b, 0);
                        self.beacons[bIdx].totalRSSI = sum;

                        self.beacons[bIdx].avgRSSI = self.beacons[bIdx].totalRSSI / self.beacons[bIdx].rssi.length;
                        $("#BTLog").prepend(sum + " ... " + self.beacons[bIdx].avgRSSI + "<br><br>");

                        var d = calcDistance(4, self.beacons[bIdx].avgRSSI);
                        //alert(d);
                        $("#BTLog").prepend("***" + d + " m " + " " + device.rssi + "<br><br>");
                    } else {
                        // $("#BTLog").prepend( d + " m <br><br>");
                    }

                    if (device.id == self.beacons[bIdx].id && self.beacons[bIdx].avgRSSI > -55 && self.beacons[bIdx].samples >= maxSampling) {
                        self.beacons[bIdx].rssi = [];
                        $("#BTLog").prepend(JSON.stringify(device) + "<br><br>");
                        var id = device.id;
                       self.connectTo(id, bIdx);
                        alert("beacon found");
                        self.beacons[bIdx].samples = 0;
                        self.beacons[bIdx].totalRSSI = 0;
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
        var self = this;
        $("#BTLog").html("");
        ble.stopScan(function () {
            self.isScanning = false;

        });
        self.connected = false;
    },

      connectTo: function (devId, idx) {


        $("#BTLog").prepend("Connecting to: " + devId + "<br><br>");
        ble.stopScan(function () { $("#BTLog").prepend("SCAN TERMINATED<br/>") });
        alert("start content: " + idx + "-" + devId);
        //ble.connect(devId, function(data){ 
        // $("#BTLog").append("Services: <br/>" + JSON.stringify(data) + "<br><br>");




        //}, function(data){
        //    alert("Failed to connect");
        //    $("#BTLog").append("FAILURE: " + JSON.stringify(data) + "<br><br><br><br>");
        //  });




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