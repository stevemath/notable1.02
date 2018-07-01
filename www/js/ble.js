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

// 10:bb:40:75:56:ea
// 88:c6:26:2e:2f:85
// 3b:6d:1a:ae:fa:31


// ibks
// 39:bb:26:bb:7b:02 2
// c6:50:bc:ae:b2:b6 

var scanBLE = {
    connected: false,
    isScanning: false,
    maxSampling: 50,
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
       // var d = calcDistance(-70, -64)
       // alert(d)
        var beacon = { id: "FB:40:29:8D:AB:59", avgRSSI: -1000, tx:-58, totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        var beacon = { id: "39:BB:26:BB:7B:02", avgRSSI: -1000, tx: -58,totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        var beacon = { id: "C6:50:BC:AE:B2:B6", avgRSSI: -1000, tx: -58,totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        var beacon = { id: "C0:0A:9C:AD:EC:05", avgRSSI: -1000, tx: -70,totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        var beacon = { id: "F7:53:A3:80:C9:BE", avgRSSI: -1000, tx: -58,totalRSSI: 0, rssi: [], samples: 0 };
        self.beacons.push(beacon);

        //beacon = { id: "EF:8A:07:B0:0E:3A", avgRSSI: -1000, totalRSSI: 0, rssi: [], samples: 0 };
        //self.beacons.push(beacon);
       // alert(JSON.stringify(app.config.beacons));
    },
    startScan: function () {
        var self = this;

        $("#BTLog").html("");
        ble.stopScan(function () {
            self.isScanning = false;

        });
      
       // alert("Start Scanning?");
        connected = false;
       
        setInterval(function () {

            if (self.isScanning == false) {
                // alert("start scanning");
                self.isScanning = true;
                ble.startScanWithOptions([], { reportDuplicates: true }, function (device) {
                    // alert(JSON.stringify(device));

                  //  $("#BTLog").append(JSON.stringify("1 " + device.id.toString()) + "<br><br>");
                   // $("#BTLog").append(JSON.stringify(JSON.stringify(device)) + "<br><br>")
                   // $("#BTLog").append(JSON.stringify("2 " + beacons[0].id.toString()) + "<br><br>");
                    var bIdx = -1;
                    var topRSSI = -10000;
                    
                    $.map(self.beacons, function (elem, index) {
                       // alert(elem.id + " " + device.id.toString())
                        if (elem.id == device.id.toString()) {
                            
                          //  alert("beacon match: " + elem.id)
                            if (elem.avgRSSI > topRSSI) {
                                bIdx = index;
                                topRSSI = elem.avgRssi;
                            }
        //                        ble.connect(elem.id, function(data){ 
        //                            $("#BTLog").append("Services: <br/>" + JSON.stringify(data) + "<br><br>");

        //                           // $("#BTLog").append("Services: <br/>" + JSON.stringify(data) + "<br><br>");
        //}, function(data){
        //    alert("Failed to connect");
        //    $("#BTLog").append("FAILURE: " + JSON.stringify(data) + "<br><br><br><br>");
        //  });
        //                    }
        //                    return true;
                     

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
                        $("#BTLog").prepend(beacons[bIdx].rssi.join(",") + "<br><br>");

                        var sum = self.beacons[bIdx].rssi.reduce((a, b) => a + b, 0);
                        self.beacons[bIdx].totalRSSI = sum;

                        self.beacons[bIdx].avgRSSI = self.beacons[bIdx].totalRSSI / self.beacons[bIdx].rssi.length;
                       // $("#BTLog").prepend(sum + " ... " + self.beacons[bIdx].avgRSSI + "<br><br>");

                        var avgRssi = self.beacons[bIdx].avgRSSI
                        var tx = self.beacons[bIdx].tx;
                        var d = calcDistance(tx, avgRssi);
                        //alert(d);
                        $("#BTLog").prepend(device.id.toString() + ": " + d + " m " + " " + avgRssi + "<br><br>");
                    } else {
                        // $("#BTLog").prepend( d + " m <br><br>");
                    }


                            // reset device once it is too far away?
                    if (device.id == self.beacons[bIdx].id && self.beacons[bIdx].avgRSSI > -55 && self.beacons[bIdx].samples >= maxSampling) {
                        self.beacons[bIdx].rssi = [];
                        $("#BTLog").prepend(JSON.stringify(device) + "<br><br>");
                        var id = device.id;
                      // self.connectTo(id, bIdx);
                        alert("beacon calibrated");
                        self.beacons[bIdx].samples = 0;
                        self.beacons[bIdx].totalRSSI = 0;
                        ble.stopScan(function () {
                            self.isScanning = false;

                        });
                        connected = true;
                    }
  }
                    });

                }, function (e) {
                    alert(JSON.stringify(e));
                });

            }
        }, 500);

    },
    calibrate: function (id) { },
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
   // txPower = txPower - 58;
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

function asHexString(i) {
    var hex;

    hex = i.toString(16);

    // zero padding
    if (hex.length === 1) {
        hex = "0" + hex;
    }

    return "0x" + hex;
}

function parseAdvertisingData(buffer) {
    var length, type, data, i = 0, advertisementData = {};
    var bytes = new Uint8Array(buffer);

    while (length !== 0) {

        length = bytes[i] & 0xFF;
        i++;

        // decode type constants from https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
        type = bytes[i] & 0xFF;
        i++;

        data = bytes.slice(i, i + length - 1).buffer; // length includes type byte, but not length byte
        i += length - 2;  // move to end of data
        i++;

        advertisementData[asHexString(type)] = data;
    }

    return advertisementData;
}
