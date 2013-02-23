var mathUtils = function() {
	var that = {};
	
	var string4Random = function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};
	
	that.guid = function() {
		return string4Random() + string4Random() + '-' + string4Random() + '-' + string4Random() + '-' +
			string4Random() + '-' + string4Random() + string4Random() + string4Random();
	};
	
	that.randomNumber = function(from, to) {
		return Math.floor(Math.random()*(to-from+1)+from);
	};
	
	return that;
};

var shape = function() {
	var that = {};
	
	var id;
	var r;
	var g;
	var b;
	var isDisplayed = false;
	var mathUtilsRef = mathUtils();
	var kShapeRef = null;
	
	var constructor = function() {
		id = mathUtilsRef.guid();
	};	
	
	constructor();
	
	that.setRgb = function(rValue, gValue, bValue) {
		r = rValue;
		g = gValue;
		b = bValue;
	};
	
	that.getRgb = function() {
		return "rgb(" + r + "," + g + "," + b + ")";
	};
	
	that.setKShape = function(kShape) {
		kShapeRef = kShape;
	};
	
	that.getKShape = function() {
		return kShapeRef;
	};
	
	that.getIsDisplayed = function() {
		return isDisplayed;
	};
	
	return that;
};

var mainBoard = function() {
	var that = {};
	var mathUtilsRef = mathUtils();
	
	var width = 10;
	var height = 5;
	var tileWidth = 100;
	
	var tile;
	var shapeCollection;
	
	var mainStage;
	var shapeLayer;
	
	var newShape = function() {
		var newShapeRef = shape();
		var r = mathUtilsRef.randomNumber(0, 255);
		var g = mathUtilsRef.randomNumber(0, 255);
		var b = mathUtilsRef.randomNumber(0, 255);
		
		newShapeRef.setRgb(r, g, b);
		
		return newShapeRef;
	};
	
	var initializeShapeCollection = function() {
		shapeCollection = new Array();
		
		for (var i=0; i<width*height; i++) {
			shapeCollection.push(newShape());
		};
	};
		
	var initialize = function() {
		tile = new Array(width);
		for(var i=0; i<width; i++) {
			tile[i] = new Array(height);
		};
		
		var shapeCollectionClone = shapeCollection.slice(0);
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				tile[i][j] = shapeCollectionClone.pop();
			};
		};
	};
	
	var initializeStage = function() {
		mainStage = new Kinetic.Stage({
			container: 'container',
			width: 800,
			height: 600
		});
	};
	
	var initializeShapeLayer = function() {
		mainLayer = new Kinetic.Layer();
		mainStage.add(mainLayer);
	};
	
	var motionTile = function() {
		for (var i=0; i<width; i++) {
			tile[i].unshift(tile[i].pop());
		};
	};
	
	var display = function() {
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var shape = tile[i][j];
				var kShape = shape.getKShape();
				
				if (kShape === null) {
					var rect = new Kinetic.Rect({
						x: tileWidth*i,
						y: tileWidth*j,
						width: tileWidth,
						height: tileWidth,
						fill: shape.getRgb(),
						stroke: 'black',
						strokeWidth: 2
					});
					
					shape.setKShape(rect);
					mainLayer.add(rect);
					continue;
				};
				
				kShape.transitionTo({
				  x: tileWidth*i,
				  y: tileWidth*j,
				  duration: 0.000000000001,
				});				
			};
		};
		
		mainLayer.draw();
	};
	
	var constructor = function() {
		initializeShapeCollection();
		initialize();
		
		initializeStage();
		initializeShapeLayer();
	};
	
	constructor();
	
	that.display = display;
	that.motionTile = motionTile;
	
	return that;
};
