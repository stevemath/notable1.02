var scanBLE = function () {

    evothings.eddystone.startScan(success, error)
    alert("scanning")
    function success(beacon) {
        alert("success");
        alert(JSON.stringify(beacon)
    }

    function error() { alert("error") }

}