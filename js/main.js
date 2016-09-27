// Variables for wayfinding
var MAPS = [
			{'path': 'planta.svg', 'id': 'floor1'}
		];
var START_ROOM = 'Entrance';
var DEFAULT_MAP = 'floor1';
var lastRoomSelected;

//Setup options for wayfinding
$(document).ready(function () {
	'use strict';
	$('#myMaps').wayfinding({
		'maps': MAPS,
		'path': {
			width: 3,
			color: 'red',
			radius: 8,
			speed: 2
		},
		'startpoint': function () {
			return START_ROOM;
		},
		'defaultMap': DEFAULT_MAP
	});

	//Make the floor buttons clickable
	$('#controls').on('submit', function (e) {
		e.preventDefault();

		var first = $(this).find('#beginSelect'),
			second = $(this).find('#endSelect'),
			map = $('#myMaps'),
			bt = $('#findButton'),
			modal = $(this).parent();

		modal.addClass('hide');
		bt.removeClass('hide');

		setTimeout(function(){
			map.wayfinding('startpoint', first.val());
			map.wayfinding('routeTo', second.val());
		},500);
	});

	$('#findButton').on('click', function(){
		var modal = $('#modalSelect'),
			bt = $('#findButton');

		bt.addClass('hide');
		modal.removeClass('hide');
	})

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
	},100)
}