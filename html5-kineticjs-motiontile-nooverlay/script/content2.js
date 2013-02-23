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

var shapeObject = function(x, y) {
	var that = {};
	
	var id;
	var r;
	var g;
	var b;
	var mathUtilsRef = mathUtilsObject();
	var kShapeRef = null;
	var clicked = false;
	var isRemoved = false;
	var _x;
	var _y;
	
	var constructor = function() {
		id = mathUtilsRef.guid();
	};	
	
	constructor();
	
	that.setRgb = function(rValue, gValue, bValue) {
		r = rValue;
		g = gValue;
		b = bValue;
		_x = x;
		_y = y;
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
	
	that.getX = function() {
		return _x;
	};
	
	that.getY = function() {
		return _y;
	};
	
	that.setX = function(value) {
		_x = value;
	};
	
	that.setY = function(value) {
		_y = value;
	};
	
	return that;
};

var engineRuleObject = function(shapeCollection, tile, shapeLayer) {
	var that = {};
	
	var tileRef;
	var shapeCollectionRef;
	var shapeLayerRef;
	var shapeKShapeClicked;	
	var clickedShapeCollection = new Array();
	
	var constructor = function() {
		tileRef = tile;
		shapeCollectionRef = shapeCollection;
		shapeLayerRef = shapeLayer;
	};	
	
	constructor();
			
	var countClickedShape = function() {
		var count = 0;
		for(var i=0; i<shapeCollection.length; i++) {
			if (shapeCollection[i].getClicked()) {
				count++;
			};
		};
		
		return count;
	};
	
	var correspondingShape = function(value) {
		for(var i=0; i<shapeCollectionRef.length; i++) {
			if (shapeCollectionRef[i].getShapeId() === value) {
				return shapeCollectionRef[i];
			};
		};
	};
	
	var resetClickedShape = function() {
		for(var i=0; i<shapeCollection.length; i++) {
			shapeCollection[i].setClicked(false);
		};
	};
	
	var process = function() {		
		var shape = correspondingShape(shapeKShapeClicked.getId());
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
			};
		};
		
		if (countClicked === 2) {		
			clickedShapeCollection = new Array();
			resetClickedShape();
		};
		
		shapeLayerRef.draw();
	};
	
	that.execute = function(shapeClicked) {
		shapeKShapeClicked = shapeClicked;
		
		process();
	};
	
	return that;
};

var mainBoardObject = function() {
	var that = {};
	var mathUtilsRef = mathUtilsObject();
	var engineRuleRef;
	
	var width = 6;
	var height = 5;
	var tileWidth = 100;
	
	var tile;
	var shapeCollection;
	
	var mainStage;
	var shapeLayer;
	
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
		
		shapeCollection.sort(function() {
			return 0.5 - Math.random();
		});
		
		var shapeCollectionCloned = shapeCollection.slice(0);
		
		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
				var shapeRef = shapeCollectionCloned.pop();
				shapeRef.setX(i);
				shapeRef.setY(j);
				tile[i][j] = shapeRef;
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
	
	var initializeEngineRule = function() {
		engineRuleRef = engineRuleObject(shapeCollection, tile, shapeLayer);
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
					attachOnClickOnOverlay(rect);
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
		initializeStage();
		initializeShapeLayer();		
		initializeEngineRule();
	};
	
	constructor();
	
	that.display = display;
	that.motionTile = motionTile;
	
	return that;
};
