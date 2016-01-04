var SerialPort = require("serialport").SerialPort
//var serialPort = new SerialPort("/dev/ttyACM0", {
var serialPort = new SerialPort("/dev/tty.usbmodem1421", {
	  baudrate: 115200
});

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data){ handleData(data); } );
	serialPort.write("ls\n", function(err, results) {
		console.log('err ' + err);
		console.log('results ' + results);
	});
});

var oldData = 0;
var handleData = function( newData ){
	newData = parseInt(newData,16);
	if(Number.isNaN(Number(newData)) ){
		return;
	}

	var delta = newData - oldData;
	//console.log( newData );
	
	if(delta > 0 && newData > 250){
		console.log('hit ' + new Date());
	}

	oldData = newData;
}
