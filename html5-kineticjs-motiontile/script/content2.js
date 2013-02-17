var mathUtilsObject = function() {
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

var shapeObject = function() {
	var that = {};
	
	var id;
	var r;
	var g;
	var b;
	var mathUtilsRef = mathUtilsObject();
	var kShapeRef = null;
	var clicked = false;
	var isRemoved = false;
	
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
	
	that.getShapeId = function() {
		return id;
	};
	
	that.setKShape = function(kShape) {
		kShapeRef = kShape;
	};
	
	that.getKShape = function() {
		return kShapeRef;
	};
	
	that.getClicked = function() {
		return clicked;
	};
	
	that.setClicked = function(value) {
		clicked = value;
	};
	
	that.getIsRemoved = function() {
		return isRemoved;
	};
	
	that.setIsRemoved = function(value) {
		isRemoved = value;
	};
	
	that.getR = function() {
		return r;
	};
	
	that.getG = function() {
		return g;
	};
	
	that.getB = function() {
		return b;
	};
	
	return that;
};

var overlayTileObject = function(x, y) {
	var that = {};
	
	var _x;
	var _y;
	var id;
	
	var mathUtilsRef = mathUtilsObject();
	
	var constructor = function() {
		_x = x;
		_y = y;
		id = mathUtilsRef.guid();
	};	
	
	constructor();
	
	that.getOverlayId = function() {
		return id;
	};
	
	that.getX = function() {
		return _x;
	};
	
	that.getY = function() {
		return _y;
	};
	
	return that;
};

var engineRuleObject = function(shapeCollection, overlayCollection, tile, overlayTile, shapeLayer, overlayLayer) {
	var that = {};
	
	var tileRef;
	var overlayTileRef;
	var shapeCollectionRef;
	var overlayCollectionRef;
	var shapeLayerRef;
	var overlayLayerRef;
	var overlayKShapeClicked;
	var overlayKShapeClickedCollection = new Array();
	
	var clickedShapeCollection = new Array();
	
	var constructor = function() {
		tileRef = tile;
		overlayTileRef = overlayTile;
		shapeCollectionRef = shapeCollection;
		overlayCollectionRef = overlayCollection;
		shapeLayerRef = shapeLayer;
		overlayLayerRef = overlayLayer;
	};	
	
	constructor();
		
	var getOverlayById = function(value) {
		for(var i=0; i<overlayCollectionRef.length; i++) {
			if (overlayCollectionRef[i].getOverlayId() === value) {
				return overlayCollectionRef[i];
			};
		};
	};
	
	var correspondingShapeToOverlay = function() {
		var overlay = getOverlayById(overlayKShapeClicked.getId());
		return tile[overlay.getX()][overlay.getY()];
	};
	
	var countClickedShape = function() {
		var count = 0;
		for(var i=0; i<shapeCollection.length; i++) {
			if (shapeCollection[i].getClicked()) {
				count++;
			};
		};
		
		return count;
	};
	
	var resetClickedShape = function() {
		for(var i=0; i<shapeCollection.length; i++) {
			shapeCollection[i].setClicked(false);
		};
	};
	
	var process = function() {
		if (overlayKShapeClickedCollection.length === 2) {
			for(var i=0; i<overlayKShapeClickedCollection.length; i++) {
				overlayKShapeClickedCollection[i].show();
			};
			overlayKShapeClickedCollection = new Array();
		}
		
		overlayKShapeClickedCollection.push(overlayKShapeClicked);
		overlayKShapeClicked.hide();
		
		var shape = correspondingShapeToOverlay();
		shape.setClicked(true);
		clickedShapeCollection.push(shape);
		var countClicked = countClickedShape();
		
		if (clickedShapeCollection.length === 2) {
			var firstOccurence = clickedShapeCollection[0];
			var secondOccurence = clickedShapeCollection[1];
			
			if ((firstOccurence.getRgb() === secondOccurence.getRgb()) &&
					(firstOccurence.getShapeId() !== secondOccurence.getShapeId())) { 
				firstOccurence.setIsRemoved(true);
				secondOccurence.setIsRemoved(true);
				
				shapeLayerRef.get("#" + firstOccurence.getShapeId())[0].remove();
				shapeLayerRef.get("#" + secondOccurence.getShapeId())[0].remove();
				
				for(var i=0; i<overlayKShapeClickedCollection.length; i++) {
					overlayKShapeClickedCollection[i].remove();
				};
				overlayKShapeClickedCollection = new Array();
			};
		};
		
		if (countClicked === 2) {		
			clickedShapeCollection = new Array();
			resetClickedShape();
		};
		
		overlayLayerRef.draw();
		shapeLayerRef.draw();
	};
	
	that.execute = function(overlayClicked) {
		overlayKShapeClicked = overlayClicked;
		
		process();
	};
	
	return that;
};

var mainBoardObject = function() {
	var that = {};
	var mathUtilsRef = mathUtilsObject();
	var engineRuleRef;
	
	var width = 10;
	var height = 5;
	var tileWidth = 100;
	
	var tile;
	var overlayTile;
	var shapeCollection;
	var overlayCollection;
	
	var mainStage;
	var shapeLayer;
	var overlayLayer;
	
	var newShape = function() {
		var newShapeRef = shapeObject();
		var r = mathUtilsRef.randomNumber(0, 255);
		var g = mathUtilsRef.randomNumber(0, 255);
		var b = mathUtilsRef.randomNumber(0, 255);
		
		newShapeRef.setRgb(r, g, b);
		
		return newShapeRef;
	};
	
	var cloneShape = function(shape) {
		var newShapeRef = shapeObject();
		newShapeRef.setRgb(shape.getR(), shape.getG(), shape.getB());
		return newShapeRef;
	};
	
	var initializeShape = function() {
		shapeCollection = new Array();
		tile = new Array(width);
		for(var i=0; i<width; i++) {
			tile[i] = new Array(height);
		};
		
		for(var i=0; i<(width*height)/2; i++) {
			var shapeRef = newShape();
			var shapeRefCloned = cloneShape(shapeRef);
			shapeCollection.push(shapeRef);
			shapeCollection.push(shapeRefCloned);
		};
		
		var shapeCollectionCloned = shapeCollection.slice(0);
		
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var shapeRef = shapeCollectionCloned.pop();
				tile[i][j] = shapeRef;
			};
		};
	};
	
	var initializeOverlay = function() {
		overlayCollection = new Array();
		overlayTile = new Array(width);
		for(var i=0; i<width; i++) {
			overlayTile[i] = new Array(height);
		};
		
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var overlayObjectRef = overlayTileObject(i, j);
				overlayCollection.push(overlayObjectRef);
				overlayTile[i][j] = overlayObjectRef;
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
		shapeLayer = new Kinetic.Layer();
		mainStage.add(shapeLayer);
	};
	
	var inititializeOverlayLayer = function() {
		overlayLayer = new Kinetic.Layer();
		mainStage.add(overlayLayer);
	};
	
	var initializeEngineRule = function() {
		engineRuleRef = engineRuleObject(shapeCollection, overlayCollection, tile, overlayTile, shapeLayer, overlayLayer);
	};
	
	var motionTile = function() {
		for (var i=0; i<width; i++) {
			tile[i].unshift(tile[i].pop());
		};
	};
	
	var attachOnClickOnOverlay = function(rect) {
		rect.on("mousedown", function() {
			engineRuleRef.execute(this);
		});
	};
	
	var displayOverlay = function() {		
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var overlay = overlayTile[i][j];
				
				var rect = new Kinetic.Rect({
					x: tileWidth*i,
					y: tileWidth*j,
					width: tileWidth,
					height: tileWidth,
					fill: 'rgb(255,255,255)',
					stroke: 'black',
					strokeWidth: 4,
					id: overlay.getOverlayId()
				});
				
				attachOnClickOnOverlay(rect);
				overlayLayer.add(rect);
			};
		};
		
		overlayLayer.draw();
	};
	
	var displayShape = function() {		
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var shape = tile[i][j];
				
				if (shape.getIsRemoved()) {
					continue;
				};
				
				var kShape = shape.getKShape();
				
				if (kShape === null) {
					var rect = new Kinetic.Rect({
						x: tileWidth*i,
						y: tileWidth*j,
						width: tileWidth,
						height: tileWidth,
						fill: shape.getRgb(),
						stroke: 'black',
						strokeWidth: 0,
						id: shape.getShapeId()
					});
					
					shape.setKShape(rect);
					shapeLayer.add(rect);
					continue;
				};
				
				kShape.transitionTo({
				  x: tileWidth*i,
				  y: tileWidth*j,
				  duration: 0.000000000001,
				});
			};
		};
		
		shapeLayer.draw();
	};
	
	var display = function() {
		displayShape();
	};
	
	var constructor = function() {
		initializeShape();
		initializeOverlay();
		
		initializeStage();
		initializeShapeLayer();
		inititializeOverlayLayer();
		
		initializeEngineRule();
		
		displayOverlay();
	};
	
	constructor();
	
	that.display = display;
	that.motionTile = motionTile;
	
	return that;
};
