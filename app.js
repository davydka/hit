var nanoTimer = require('./nanotimer');
var midi = require('midi');
var output = new midi.output();
var input = new midi.input();
var input2 = new midi.input();



var songs = [

	/* TRUE NOTE */
	[
		'true-note'
	],

	/*0 Otters*/
	[
		[],
		[57, 64, 69, 76],
		[57, 62, 69, 74],
		[57, 64, 69, 76, 81, 88],
		[57, 62, 69, 74, 81, 86],
		[57, 64, 69, 76, 81, 88, 93, 100],
		[57, 62, 69, 74, 81, 86, 93, 98],
	],

	/*1 Left Handed Stanger*/
	[
		[],
		[62, 67, 74, 79], // D G
		[62, 69, 74, 81], // D A
		[62, 71, 74, 83], // D B
		
		[50, 54, 62, 66], // D F#
		[47, 50, 59, 62], // B D
		[45, 50, 57, 62], // A D

		[47, 50, 52, 54, 
		59, 62, 64, 66,
		71, 74, 76, 78,
		83, 86, 88, 90], //B D E F# *4
	],

	/*2 Drag Race*/
	[
		[],
		[69, 78, 81, 90], //A F#
		[69, 74, 81, 86], //A D
		[73, 76, 85, 88], //C# E
		[69, 76, 81, 88], //A E
		[64, 76, 76, 88], //E E
		
		[64, 71, 76, 83], //E B
		[71, 76, 83, 88], //B E

		[81, 76, 93, 88], //A E
		[81, 78, 93, 90], //A F#
		[81, 76, 93, 88], //A E
		[81, 73, 93, 85], //A C#
	],
];

var selectedSong = 0;
var partStep = 0;
var selectedPart = 1;
var pgminTimestap = process.hrtime();
var part = songs[selectedSong][selectedPart];
var trueNote = 50;
var timer = new nanoTimer();

//INPUT 1 - KICK
for(var i=0; i < input.getPortCount(); i++){
	console.log(input.getPortName(i));
	if( input.getPortName(i) == 'mio 20:0' ){
		input.openPort(i);
	}
}

// INPUT 2 - FOOTPEDAL
for(var i=0; i < input2.getPortCount(); i++){
	//console.log(input2.getPortName(i));
	if( input2.getPortName(i) == '12Step 24:0' ){
		input2.openPort(i);
	}
}

// OUTPUT - MIO out
for(var i=0; i < output.getPortCount(); i++){
	if( output.getPortName(i) == 'mio 20:0' ){
		output.openPort(i);
	}
}

//footpedal
input2.on('message', function(deltaTime, message) {
	//console.log(message);
	if(message[0]==144 && message[2] > 0){
		//console.log('12 step');
		//console.log(message);
		trueNote = message[1];
		//setPart(message[1] - 48);
	}
});

//kick
input.on('message', function(deltaTime, message) {
	//console.log(message);
	if(message[0]==144 && message[2]>0){
		//console.log('kick');
		playNote();
	}
});

var setPart = function(selectedPart){
	var oldPart = selectedPart;
	//selectedPart = selectedPart;
	if(selectedPart >= songs[selectedSong].length){
		selectedPart = songs[selectedSong].length-1
	}
	part = songs[selectedSong][selectedPart]

	if(partStep >= part.length){
		partStep = 0;
	}

	if(selectedPart == oldPart){
		partStep = 0;
	}
}

var playNote = function(){
	if(typeof part == 'undefined'){
		//console.log('true');
		noteEvent(trueNote);
		return;
	}
	
	if(part.length){
		noteEvent(part[partStep]);
		console.log(part[partStep]);

		partStep++;
		if(partStep >= part.length){
			partStep = 0;
		}
	}
}


var noteEvent = function(note){
	output.sendMessage([144,note,100]);

	timer.setTimeout(noteOff, [note], '15m');
}

var noteOff = function(note){
	output.sendMessage([128,note,0]);
	output.sendMessage([144,note,0]);
}
