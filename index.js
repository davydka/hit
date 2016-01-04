var firmata = require("firmata");
var board = new firmata.Board ('/dev/ttyACM0', function (err) {
	if(err){
		console.log(err);
		return;
	}

	console.log(board);
	console.log('connected to arduino');

	board.pinMode(13, board.MODES.OUTPUT);
	board.digitalWrite(13, board.MODES.HIGH);

	var isOn = true;

	setInterval(function () {
		if(isOn) {
			board.digitalWrite(13, board.LOW);
			isOn = false;
		}else{
			board.digitalWrite(13, board.HIGH);
			isOn = true;
		}    
	}, 500);
});
