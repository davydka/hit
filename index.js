var SerialPort = require("serialport").SerialPort
//var serialPort = new SerialPort("/dev/ttyACM0", {
var serialPort = new SerialPort("/dev/tty.usbmodem1421", {
	  baudrate: 115200
});

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data) {
		data = parseInt(data,16);
		if(Number.isNaN(Number(data)) ){
			return;
		}
		console.log( data );
		//console.log('data received: ' + data);
	});
	serialPort.write("ls\n", function(err, results) {
		console.log('err ' + err);
		console.log('results ' + results);
	});
});

