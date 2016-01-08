var _ = require('lodash');
var midi = require('midi');
var output = new midi.output();
var input = new midi.input();
var input2 = new midi.input();

for(var i=0; i < input2.getPortCount(); i++){
	console.log(input2.getPortName(i));
	//if( input2.getPortName(i) == 'mio 20:0' ){
	//	input2.openPort(i);
	//}
	if( input2.getPortName(i) == 'LPK25 24:0' ){
		input2.openPort(i);
	}
}

for(var i=0; i < input.getPortCount(); i++){
	console.log(input.getPortName(i));
	if( input.getPortName(i) == 'mio 20:0' ){
		input.openPort(i);
	}
	//if( input.getPortName(i) == 'LPK25 24:0' ){
	//	input.openPort(i);
	//}
}

for(var i=0; i < output.getPortCount(); i++){
	if( output.getPortName(i) == 'mio 20:0' ){
		output.openPort(i);
	}
}

var noteOn = [144, 38, 100];
var noteOff = [144, 38, 0];
input2.on('message', function(deltaTime, message) {
	console.log(message);
	if(message[0]==144){
		noteOn = [message[0], message[1], 127];
		noteOff = [message[0], message[1], 0];
	}
});

input.on('message', function(deltaTime, message) {
	if(message[0]==144 && message[2]>0){
		noteEvent();
		//console.log(message);
	}
});


var noteEvent = function(){
	output.sendMessage(noteOn);
	//output.sendMessage([144,38,100]);
	console.log('note on');

	setTimeout(function(){
		output.sendMessage(noteOff);
		//output.sendMessage([128,38,0]);
		console.log('note off');
	}, 35)
}
