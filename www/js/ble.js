var scanBLE = function () {

    evothings.eddystone.startScan(success, error)
    alert("scanning")
    function success() { alert("success") }

    function error() { alert("error") }

}