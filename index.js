var _ = require('lodash');
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyACM0", {
//var serialPort = new SerialPort("/dev/tty.usbmodem1421", {
	  baudrate: 115200
});
var midi = require('midi');
var output = new midi.output();

for(var i=0; i < output.getPortCount(); i++){
	if( output.getPortName(i) == 'mio 20:0' ){
		output.openPort(i);
		console.log('here');
	}
}

serialPort.on("open", function () {
	console.log('open');
	
	serialPort.write("ls\n", function(err, results) {
		if(err){
			console.log('err ' + err);
		}
		console.log('results ' + results);
	});
	

	serialPort.on('data', function(data){ 
		handleData(data);
		//_.debounce( handleData(data), 35 );
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
		noteEvent();
	}

	oldData = newData;
}

var noteEvent = function(){
	output.sendMessage([144,38,100]);
	console.log('note on');

	setTimeout(function(){
		output.sendMessage([128,38,0]);
		console.log('note off');
	}, 35)
}
