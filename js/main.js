// Variables for wayfinding
var MAPS = [
			{'path': 'planta.svg', 'id': 'floor1'}
		];
var START_ROOM = 'Entrance';
var DEFAULT_MAP = 'floor1';
var lastRoomSelected;

// Variables for zoom
var MAX_ZOOM_IN = 16.0,
	MAX_ZOOM_OUT = 1.0,
	zoomScaleStep = 2,
	zoomTranslationMap = d3.map(),
	translationStep = 100,
	zoomable_layer, zoom,
	zoomObjects = [];

zoomTranslationMap.set(1, 0.0);
zoomTranslationMap.set(2, 1.0);
zoomTranslationMap.set(4, 3.0);
zoomTranslationMap.set(8, 2.33);
zoomTranslationMap.set(16, 2.14);

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

	$('#findButton').on('click', function() {
		var modal = $('#modalSelect'),
			bt = $('#findButton');

		bt.addClass('hide');
		modal.removeClass('hide');
	});

	$('#Rooms a').on('click', function(e) {
		e.preventDefault();
	});

	setZoomEnvironment();
});

//Create the zoom beaviour and wait for map creation and then set zoom behaviour on it
function setZoomEnvironment(){
	//Create the zoom behavior to set for the draw
	zoom = d3.behavior.zoom().scaleExtent([MAX_ZOOM_OUT, MAX_ZOOM_IN]).on('zoom', zoomed);
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
			$.map(MAPS, function(value) {
				setZoomBehaviourForMap(value.id);
			});
		}
	},100)
}

function setZoomBehaviourForMap(mapId){
	//Create specific variables for map zooming
	var mapObj = d3.select('#' + mapId + " svg").call(zoom),
		zoomMap = mapObj.select("g"),
		svgWidth = mapObj.attr('width').replace('px', ''),
		svgHeight = mapObj.attr('height').replace('px', ''),
		centerX = d3.round(-(svgWidth / 2)),
		centerY = d3.round(-(svgHeight / 2));
	
	zoomObjects[mapId] = {
		zoomMap: zoomMap, 
		svgWidth:  svgWidth,
		svgHeight: svgHeight,
		centerX: centerX,
		centerY: centerY
	};
				
	//Set the zoom behavior on the floor		
	// zoomMap.call(zoom);
}
		
//Function called on the zoom event. It translate the draw on the zoommed point and scale with a certain factor
function zoomed() {
	var id = d3.select(this.parentNode).attr("id");
	var zoomObj = zoomObjects[id];
	zoomObj.centerX = d3.round(d3.event.translate[0]);
	zoomObj.centerY = d3.round(d3.event.translate[1]);
	//alert("Richiesto livello di zoom " + d3.event.scale + " e traslazione in " + centerX + ", " + centerY);
	zoomObj.zoomMap.attr("transform", "translate(" + zoomObj.centerX + ", " + zoomObj.centerY + ")scale(" + d3.event.scale + ")");
}
