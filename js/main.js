// Variables for wayfinding
var MAPS = [
			{'path': 'planta.svg', 'id': 'floor1'},
			{'path': 'floor1.svg', 'id': 'floor2'}
			],
	START_ROOM = 'Entrance',
	DEFAULT_MAP = 'floor1',
	lastRoomSelected;

$(document).ready(function () {
	'use strict';
	
	$('#myMaps').wayfinding({
		'maps': MAPS,
		'path': {
			width: 3,
			color: 'cyan',
			radius: 8,
			speed: 8
		},
		'startpoint': function () {
			return START_ROOM;
		},
		'defaultMap': DEFAULT_MAP
	});

	//Make the floor buttons clickable
	$('#controls #beginSelect').change(function () {
		$('#myMaps').wayfinding('startpoint', $(this).val());
		if ($('#controls #endSelect').val() !== '') {
			$('#myMaps').wayfinding('routeTo', $('#controls #endSelect').val());
		}
	});
	$('#controls #endSelect').change(function () {
		$('#myMaps').wayfinding('routeTo', $(this).val());
	});

	setZoomEnvironment();
});

//Create the zoom beaviour and wait for map creation and then set zoom behaviour on it
function setZoomEnvironment(){
	waitMapsCreation();
}

function waitMapsCreation(){

	var checkMapsCreationFunction = setInterval(function() {

		var allMapsCreated = true;
		$.map(MAPS, function(value) {
			if($('#' + value.id).length == 0){
				allMapsCreated = false;
			}
		});
		if(allMapsCreated){
			//Cancel the timer
			clearInterval(checkMapsCreationFunction);
		}
	}, 100);
}