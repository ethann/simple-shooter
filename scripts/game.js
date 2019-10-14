/** GAME **/
Game = {};
Game.LoadTypes = function() {
	Game.TYPES = {};
	Game.TYPES.animation = {
		'explosion': {
			image: 'animations/explosion', 
			frames: 49,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 128, height: 128, cols: 7, rows: 7}
		},

		'blood': {
			image: 'animations/blood', 
			frames: 6,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 33, height: 32, cols: 6, rows: 1}
		},
		
		'boom': {
			image: 'animations/boom', 
			frames: 18,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 80, height: 60, cols: 6, rows: 3}
		},
		
		'blue_swift': {
			image: 'animations/blue_swift', 
			frames: 9,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 50, height: 36, cols: 9, rows: 1}
		},
		
		'red_swift': {
			image: 'animations/red_swift', 
			frames: 9,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 50, height: 36, cols: 9, rows: 1}
		},
		
		'green_swift': {
			image: 'animations/green_swift', 
			frames: 9,
			framePerSecond: 25,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 50, height: 36, cols: 9, rows: 1}
		},
		
		'blue_orb': {
			image: 'objects/blue_orb', 
			frames: 8, 
			framePerSecond: 15,
			background_start: {x: 0, y: 0}, 
			frameSize: {width: 32, height: 32, cols: 4, rows: 2}
		}
	};
	
	Game.TYPES.enemy = {
		'police_1': {
			class: 'Policeman',
			health: 80,
			size: {width: 32, height: 32},
		
			image: 'objects/policeman',
			background_start: {x: 1, y: 1}, 
			frames: 4,
			frameSize: {width: 32, height: 32, cols: 4, rows: 1}
		},
		'police_2': {
			class: 'Policeman',
			health: 100,
			size: {width: 32, height: 32},
		
			image: 'objects/policeman',
			background_start: {x: 133, y: 1}, 
			frames: 4,
			frameSize: {width: 32, height: 32, cols: 4, rows: 1}
		},
		'police_3': {
			class: 'Policeman',
			health: 80,
			size: {width: 32, height: 32},
		
			image: 'objects/policeman',
			background_start: {x: 265, y: 1}, 
			frames: 4,
			frameSize: {width: 32, height: 32, cols: 4, rows: 1}
		},
		'police_fbi': {
			class: 'Policeman',
			health: 300,
			size: {width: 32, height: 32},
		
			image: 'objects/policeman',
			background_start: {x: 396, y: 1}, 
			frames: 4,
			frameSize: {width: 32, height: 32, cols: 4, rows: 1}
		}
	};
	
	Game.TYPES.orb = {
		'blue': {
			color: 'blue',
			size: {width: 32, height: 32},
		
			image: 'objects/blue_orb',
			background_start: {x: 0, y: 0}, 
			frames: 8,
			frameSize: {width: 32, height: 32, cols: 4, rows: 2}
		},
		'red': {
			color: 'red',
			size: {width: 32, height: 32},
		
			image: 'objects/red_orb',
			background_start: {x: 0, y: 0}, 
			frames: 8,
			frameSize: {width: 32, height: 32, cols: 4, rows: 2}
		},
		'green': {
			color: 'green',
			size: {width: 32, height: 32},
		
			image: 'objects/green_orb',
			background_start: {x: 0, y: 0}, 
			frames: 8,
			frameSize: {width: 32, height: 32, cols: 4, rows: 2}
		}
	};	
	
	Game.TYPES.level = {
		'street': {
			background: 'interface/bg_street',
			target: 'interface/target_street'
		},
		'desert': {
			background: 'interface/bg_desert',
			target: 'interface/target_desert'
		}
	};	
	
	Game.LEVELS = { 
		'street': {
			theme: Game.TYPES.level.street,
			enemies: [
				{type: 'police_1', chance: 0.075}, // 7.5%
				{type: 'police_2', chance: 1}, // 100%
				{type: 'police_3', chance: 0.8} // 80%
			]
		},
		'desert': {
			theme: Game.TYPES.level.desert,
			enemies: [
				{type: 'police_1', chance: 0.075}, // 7.5%
				{type: 'police_2', chance: 1}, // 100%
				{type: 'police_3', chance: 0.8} // 80%
			]
		}
	};	
	
	Game.Crosshairs = [];
	Game.defaultCrosshair = new Crosshair("Aim", [32, 32], 'interface/crosshair', [14, 0], [16, 16])
	Game.Crosshairs.push(Game.defaultCrosshair);
	Game.Crosshairs.push(new Crosshair("AimHover", [32, 32], 'interface/crosshair', [14, 33], [16, 16]));
	
	Game.Weapons = [];
	Game.Weapons.push(new Weapon("Stone", 10, ['interface/weapons', 0, 0], Game.getCrosshair("Aim"), Game.getCrosshair("AimHover"), null));
};

Game.Reset = function() {
	Game.isGameOver = false;
	Game.gameTimer = null; // setTimeout return

	Game.lastSpawn = 50; // eq. 1-2s / depends on fps.max
	Game.newObjectId = 0;

	Game.enemies = [];
	Game.animations = [];
	Game.orbs = [];
	Game.target = false;
	
	Game.startCountdown = Game.FPS.max*3;
	Game.startCountdownOpacity = 0.8;
	Game.startCountdownOpacityDelta = Game.startCountdownOpacity/Game.startCountdown;

	Game.STATS = {points: 0, orbs: 0, lifes: 100};	
	
	Game.GameOverStyle.done = 0;
	Game.GameOverStyle.DONEtime = 0;
	Game.GameOverStyle.BGtime = Game.FPS.max*2;
	Game.GameOverStyle.BGopacity = 0;
	Game.GameOverStyle.TEXTtime = Game.FPS.max;
	Game.GameOverStyle.TEXTopacity = 0;
};

Game.Init = function() {
	Game.width = 600;
	Game.height = 160;
	Game.loaded = false;

	// images
	Game.images = [];
	Game.imagesCount;
	Game.imagesLoaded = 0;
	
	// fps
	Game.FPS = {};//, lastFrame: new Date().getTime(), enabled: false};
	Game.FPS.max = 50;
	Game.FPS.timeForFrame = 1000/Game.FPS.max;

	
	
	// game over
	Game.GameOverStyle = {};
	Game.GameOverStyle.done = 0;
	Game.GameOverStyle.DONEtime = 0;
	Game.GameOverStyle.BGtime = Game.FPS.max*2;
	Game.GameOverStyle.BGopacity = 0;
	Game.GameOverStyle.BGopacityDelta = 0.6/Game.GameOverStyle.BGtime;
	Game.GameOverStyle.TEXTstart = Game.FPS.max;
	Game.GameOverStyle.TEXTtime = Game.FPS.max;
	Game.GameOverStyle.TEXTopacity = 0;
	Game.GameOverStyle.TEXTopacityDelta = 1.0/Game.GameOverStyle.TEXTtime;
	

	// handle delay issue
	Game.time = 0;
	Game.handleDelay = 0;
	
	// display load information
	Game.loadingStep = 0;
	Game.loadingInterval = setInterval(Game.showLoading, 500);
	
	// set canvas handle
	Game.$Canvas = $('canvas#GameArea');
	Game.gCanvas = new Canvas(Game.$Canvas[0]);
	Game.gCanvas.init();
	
	// set interface events
	Game.selectedTab = 0;
	Game.$Interface = $('div.Site > div.Interface');
	Game.$Interface.find('dl.top-menu > dd').disableSelection();
	Game.$Interface.find('dl.top-menu').delegate('dd', 'click', Game.chooseMenuTab);
	
	// mouse
	Game.mouse = {x: 0, y: 0};
	
	// others
	Game.directions = ['up', 'right', 'down', 'left'];
	Game.damage = 80;
	Game.LevelType = null;
	Game.started = false;
	Game.weapon = null;
	
	
	Game.LoadTypes();
	Game.loadImages();
};

Game.showLoading = function() {
	var dots = 'Loading';
	for(var i=0; i<Game.loadingStep%4; i++)
		dots += '.';
	Game.loadingStep++;
	
	Game.gCanvas.clear();
	Game.gCanvas.rectangle({
		x: 0, y: 0,
		color: '#fff',
		width: Game.width, height: Game.height,
		opacity: 0.8
	})
	.text(dots, {
		x: 180, y: 20,
		color: '#000',
		fontSize: '70px',
		fontWeight: 'normal',
		fontFamily: 'Geo',
		textAlign: 'left',
		textBaseline: 'top',
		opacity: 1
	});
};

Game.loadImages = function() {
	var image_names = [
		'animations/blood', 'animations/boom', 'animations/explosion', 'animations/karolcia', 'animations/blue_swift',
			'animations/green_swift', 'animations/red_swift',
		'interface/bg_street', 'interface/target_street', 
		'interface/bg_desert', 'interface/target_desert', 
		'interface/money', 'interface/heart', 'interface/crosshair',
		'objects/blue_orb', 'objects/red_orb', 'objects/green_orb', 'objects/policeman',
		'others/bush'
	];
	Game.imagesCount = image_names.length;
	
	for(var i=0; i<image_names.length; i++) {
		Game.images[image_names[i]] = new Image();
		Game.images[image_names[i]].onload = Game.imageLoaded;
		Game.images[image_names[i]].src = 'img/game/' + image_names[i] + '.png';
	}
};

Game.imageLoaded = function() {
	Game.imagesLoaded++;
	if(Game.imagesLoaded >= Game.imagesCount)
		Game.gameLoaded();
};

Game.gameLoaded = function() {
	clearInterval(Game.loadingInterval);
	Game.loaded = true;
	
	Game.gCanvas.clear();
	Game.gCanvas.rectangle({
		x: 0, y: 0,
		color: '#fff',
		width: Game.width, height: Game.height,
		opacity: 0.3
	})
	.text('Logo', {
		x: 300, y: 20,
		color: '#000',
		fontSize: '70px',
		fontWeight: 'normal',
		fontFamily: 'Geo',
		textAlign: 'center',
		textBaseline: 'top',
		opacity: 1
	});
	
	Game.$Interface.removeClass('disabled');
	Game.weapon = Game.getWeapon('Stone');
};



Game.chooseMenuTab = function() {
	var $this = $(this);
	var $tabs = Game.$Interface.children('div');
	var $siblings = $this.siblings().add($this);
	var index = $siblings.index($this);

	if(index == Game.selectedTab)
		return;

	//deselect
	$siblings.eq(Game.selectedTab).removeClass('choosen');
	$tabs.eq(Game.selectedTab).hide();

	//select new
	$this.addClass('choosen');
	$tabs.eq(index).show();

	Game.selectedTab = index;
};





/******************\
	MOUSE EVENTS
\******************/
	
Game.mouseDown = function(event) {
	if(Game.isGameOver)
		return;
		
	var offCanvas = Game.$Canvas.offset();
	var mouseX = (event.clientX - offCanvas.left);
	var mouseY = (event.clientY - offCanvas.top);
	var target = null;
	
	for(var i = Game.enemies.length-1; i>=0; i--) {
		if(Game.enemies[i].checkCollision(mouseX, mouseY)) {
			if(target != null && target.position.z < Game.enemies[i].position.z)
				target = Game.enemies[i];
			else
				target = Game.enemies[i];
		}
	}
	
	if(target != null)
		target.shoot(mouseX, mouseY);
};

Game.mouseMove = function(event) {
	if(Game.isGameOver)
		return;
		
	var offCanvas = Game.$Canvas.offset();
	var mouseX = (event.clientX - offCanvas.left);
	var mouseY = (event.clientY - offCanvas.top);
	var oldTarget = Game.target;
	var newTarget = false;
	Game.mouse.x = mouseX;
	Game.mouse.y = mouseY;
	
	for(var i = Game.orbs.length-1; i>=0; i--) {
		if(Game.orbs[i].checkCollision(mouseX, mouseY)) {
			Game.orbs[i].caught();
		}
	}
	
	for(var i = Game.enemies.length-1; i>=0; i--) {
		if(Game.enemies[i].checkCollision(mouseX, mouseY)) {
			newTarget = true;
			break;
		}
	}
	
	// update cursor
	if(oldTarget != newTarget)
		Game.target = newTarget;
};




/*********************\
	STATS FUNCTIONS
\*********************/

Game.getCrosshair = function(name) {
	for(var i=0, len=Game.Crosshairs.length; i<len; i++) {
		if(Game.Crosshairs[i].name == name)
			return Game.Crosshairs[i];
	}
	
	return null;
};

Game.getWeapon = function(name) {
	for(var i=0, len=Game.Weapons.length; i<len; i++) {
		if(Game.Weapons[i].name == name)
			return Game.Weapons[i];
	}
	
	return null;
};

Game.addOrbs = function(orbs) { Game.STATS.orbs += parseInt(orbs); };
Game.addPoints = function(points) { Game.STATS.points += parseFloat(points);};
Game.addLifes = function(lifes) {
	Game.STATS.lifes = Math.max(0, Game.STATS.lifes + parseInt(lifes));
	
	if(Game.STATS.lifes <= 0) 
		Game.onGameOver(); 
};
Game.drawStats = function() {
	//Game.STATS.points.toFixed(1)
	//Game.STATS.lifes
	//Game.STATS.orbs
	
	Game.gCanvas.objectsAdd({
		type: 'text',
		z: 1001,
		text: Game.STATS.points.toFixed(1), 
		style: {
			x: 280, 
			y: 121,
			fontSize: '1em',
			fontFamily: 'Geo',
			textAlign: 'left',
			textBaseline: 'top'
		}
	}).objectsAdd({
		type: 'text',
		z: 1001,
		text: Game.STATS.lifes, 
		style: {
			x: 280, 
			y: 137,
			fontSize: '1em',
			fontFamily: 'Geo',
			textAlign: 'left',
			textBaseline: 'top'
		}
	}).objectsAdd({
		type: 'text',
		z: 1001,
		text: Game.STATS.orbs, 
		style: {
			x: 42, 
			y: 17,
			color: '#ffffff',
			fontSize: '1em',
			fontFamily: 'Geo',
			textAlign: 'left',
			textBaseline: 'top'
		}
	});
};



/*******************\
	FIND FUNCTION
\*******************/
// ex. find('policeman', 2)
Game.find = function(what, id) {
	var arrayOfItems = null;
	var found = null;
	
	switch(what) {
		case 'enemy':
			arrayOfItems = Game.enemies;
			break;
			
		case 'animation':
			arrayOfItems = Game.animations;
			break;
			
		case 'orb':
			arrayOfItems = Game.orbs;
			break;
	}
	
	if(arrayOfItems == null)
		return null;
		
	for(var i=0; i<arrayOfItems.length; i++) {
		var item = arrayOfItems[i];
		if(item.id == id) {
			found = item;
			break;
		}
	}
	return found;
};



/*Game.updateFPS = function() {
	var date = new Date().getTime();
	//Game.$.fps.text(Game.lastSpawn);
	Game.$.fps.text(Math.round(1000 / (date - Game.FPS.lastFrame)));
	Game.FPS.lastFrame = date;
};*/


/********************\
	SPAWN FUNCTIONS
\********************/
Game.spawnEnemy = function() {
	if(--Game.lastSpawn <= 0) { // per 5 s
		// get random enemy
		var keys = Object.keys(Game.TYPES.enemy);
		var type = Game.TYPES.enemy[keys[Math.floor(keys.length * Math.random())]];
		
		var speed = random(1, 8);
		var starts_from = Game.directions[random(1, 2)*2 - 1]; // 1 or 3
			
		var object = null;
		if(typeof window[type['class']] == 'function') {
			object = new window[type['class']](speed, type, starts_from);
			Game.enemies.push(object);
		}
		else {
			// do error, invaild type
		}
			
		//Game.lastSpawn = new Date().getTime();
		Game.lastSpawn = Game.FPS.max*2;
	}
};

Game.spawnOrb = function(type, x, y) {
	Game.orbs.push(new Orb(Game.TYPES.orb[type], x, y));
	Game.orbs.sort(function(a, b) {
		return a.position.z - b.position.z;
	});
};




/*************************\
	ANIMATIONS FUNCTIONS
\*************************/
Game.addAnimation = function(_type, x, y, z) {
	var type = Game.TYPES.animation[_type];
	if(type == undefined || type == null)
		return;
		// inform in console
	
		
	Game.animations.push(
		new Animation(type, false, x, y, z)
	);
};

Game.addInfinityAnimation = function(_type, x, y, z) {
	var type = Game.TYPES.animation[_type];
	if(type == undefined || type == null)
		return;
		// inform in console
	
		
	Game.animations.push(
		new Animation(type, true, x, y, z)
	);
};

Game.addAnimatedText = function(text, style, x, y, z) {
	style.startX = x;
	style.startY = y;
	style.z = z;
	Game.animations.push(
		new AnimatedText(text, style)
	);
};





/********************\
	OBJECTS HANDLE
\********************/
Game.enemyLoop = function() {
	var start_from = 0;
	do {
		var starts_with = start_from;
		start_from = -1;
		
		for(var i = starts_with; i < Game.enemies.length; i++) {
			var enemy = Game.enemies[i];
			enemy.update();
			
			if(enemy.isDestroyed()) {
				Game.enemies.splice(i, 1);
				start_from = i;
				break;
			}
			
			enemy.addToDraw();
		}
		
	} while(start_from != -1);
};


Game.animationLoop = function() {
	var start_from = 0;
	do {
		var starts_with = start_from;
		start_from = -1;
		
		for(var i = starts_with; i < Game.animations.length; i++) {
			var animation = Game.animations[i];
			animation.update();
			
			if(animation.isDestroyed()) {
				Game.animations.splice(i, 1);
				start_from = i;
				break;
			}
			
			// draw bg for animate texts
			animation.addToDraw();
		}
	} while(start_from != -1);
};


Game.orbLoop = function() {
	var start_from = 0;
	do {
		var starts_with = start_from;
		start_from = -1;
		
		for(var i = starts_with; i < Game.orbs.length; i++) {
			var orb = Game.orbs[i];
			orb.update();
			
			if(orb.isDestroyed()) {
				Game.orbs.splice(i, 1);
				start_from = i;
				break;
			}
			
			orb.addToDraw();
		}
	} while(start_from != -1);
};







Game.drawCountDown = function() {
	Game.gCanvas.objectsAdd({
		type: 'rectangle',
		z: 5000,
		style: {
			x: 0, y: 0,
			color: '#fff',
			width: Game.width, height: Game.height,
			opacity: Game.startCountdownOpacity
		}
	});
	
	Game.startCountdownOpacity -= Game.startCountdownOpacityDelta;
	
	if(Game.startCountdown % Game.FPS.max == 0) {
		Game.addAnimatedText(Game.startCountdown/Game.FPS.max, {
			color: '#000',
			fontSize: '70px',
			fontWeight: 'normal',
			fontFamily: 'Geo',
			textAlign: 'center',
			textBaseline: 'top',
			
			animationTime: Game.FPS.max,
			
			fadeInTime: 5,
			fadeOutTime: Game.FPS.max-20,
			
			startMoveTime: 0,
			endMoveTime: Game.FPS.max,
			endX: 300,
			endY: 0
		}, 300, 20, 5001);
	}
	
	
	Game.startCountdown--;
	if(Game.startCountdown == 0) {
		Game.addAnimatedText('Start!', {
			color: '#000',
			fontSize: '70px',
			fontWeight: 'normal',
			fontFamily: 'Geo',
			textAlign: 'center',
			textBaseline: 'top',
			
			animationTime: Game.FPS.max,
			
			fadeInTime: 5,
			fadeOutTime: Game.FPS.max-20,
			
			startMoveTime: 0,
			endMoveTime: Game.FPS.max,
			endX: 300,
			endY: 0
		}, 300, 20, 5001);
	}
};

/***************\
 *  GAME OVER  *
\***************/

Game.onGameOver = function() {
	Game.isGameOver = true;
	Game.target = false;
	$('div.GameBox').undelegate(Game.gCanvas.self, 'mousedown');
	
	// enable move events
	$('div.GameBox').undelegate(Game.gCanvas.self, 'mousemove');
	
	Game.$Canvas.css('cursor', 'default');
	clearTimeout(Game.gameTimer);
	
	Game.started = false;
};

Game.drawGameOver = function() {
	// if done
	if(Game.GameOverStyle.done) {
		Game.gCanvas.objectsAdd({
			type: 'rectangle',
			z: 5000,
			style: {
				x: 0, y: 0,
				color: '#000000',
				width: Game.width, height: Game.height,
				opacity: Game.GameOverStyle.BGopacity
			}
		})
		.objectsAdd({
			type: 'text',
			text: 'GAME OVER',
			z: 5000,
			style: {
				x: Game.width/2, y: 20,
				color: '#ffffff',
				fontSize: '70px',
				fontWeight: 'normal',
				fontFamily: 'Geo',
				textAlign: 'center',
				textBaseline: 'top',
				opacity: Game.GameOverStyle.TEXTopacity
			}
		});
		
		return;
	}
	
	
	// else
	var action = 0;
	
	if(Game.GameOverStyle.BGtime > 0) {
		Game.GameOverStyle.BGopacity = Math.min(1, Game.GameOverStyle.BGopacity + Game.GameOverStyle.BGopacityDelta);
		Game.GameOverStyle.BGtime--;
		action++;
	}
	
	if(Game.GameOverStyle.DONEtime >= Game.GameOverStyle.TEXTstart && Game.GameOverStyle.TEXTtime > 0) {
		Game.GameOverStyle.TEXTopacity = Math.min(1, Game.GameOverStyle.TEXTopacity + Game.GameOverStyle.TEXTopacityDelta);
		Game.GameOverStyle.TEXTtime--;
		action++;
	}
	
	if(action == 0 && Game.GameOverStyle.DONEtime > Game.FPS.max) {
		Game.GameOverStyle.done = 1;
	}
	
	Game.gCanvas.objectsAdd({
		type: 'rectangle',
		z: 5000,
		style: {
			x: 0, y: 0,
			color: '#000000',
			width: Game.width, height: Game.height,
			opacity: Game.GameOverStyle.BGopacity
		}
	})
	.objectsAdd({
		type: 'text',
		text: 'GAME OVER',
		z: 5000,
		style: {
			x: Game.width/2, y: 20,
			color: '#ffffff',
			fontSize: '70px',
			fontWeight: 'normal',
			fontFamily: 'Geo',
			textAlign: 'center',
			textBaseline: 'top',
			opacity: Game.GameOverStyle.TEXTopacity
		}
	});
	
	// font size 70px Geo #FFFFFF
		
	Game.GameOverStyle.DONEtime++;
};


Game.drawStaticIcons = function() {
	Game.gCanvas.objectsAdd({
		type: 'image',
		z: 0,
		style: {
			image: Game.images[Game.LevelType.theme.background],
			x: 0, y: 0,
			width: Game.width, height: Game.height
		}
	}).
	objectsAdd({
		type: 'image',
		z: 1000,
		style: {
			image: Game.images[Game.LevelType.theme.target],
			x: (Game.width-120)/2, 
			y: 43,
			width: 120, height: 114
		}
	}).
	objectsAdd({
		type: 'image',
		z: 1001,
		style: {
			image: Game.images['interface/money'],
			x: 261, y: 121,
			width: 16, height: 16
		}
	}).
	objectsAdd({
		type: 'image',
		z: 1001,
		style: {
			image: Game.images['interface/heart'],
			x: 260, y: 136,
			width: 16, height: 16
		}
	});
};


Game.drawCursor = function() {
	var cursor = null;
	
	if(Game.weapon !== null && (cursor = Game.weapon.getCrosshair()) !== null)
		cursor.addToDraw(Game.mouse.x, Game.mouse.y);
	else
		Game.defaultCrosshair.addToDraw(Game.mouse.x, Game.mouse.y);
};




/**************************\
	GAME STATE FUNCTIONS
\**************************/



Game.Start = function(type) {
	// ingame
	if(Game.started == true)
		return;
	
	Game.Reset();
	
	if(Game.LEVELS[type] == "undefined") {
		// notify that level does not exists
		return;
	}

	Game.started = true;
	Game.LevelType = Game.LEVELS[type];
	
	// enable click events
	$('div.GameBox').delegate(Game.gCanvas.self, 'mousedown', Game.mouseDown);
	
	// enable move events
	$('div.GameBox').delegate(Game.gCanvas.self, 'mousemove', Game.mouseMove);
	
	Game.addInfinityAnimation('blue_orb', 15, 9, 1019);
	
	Game.time = new Date().getTime();
	Game.handleDelay = 0;
	Game.$Canvas.css('cursor', 'none');
	
	Game.Proceed();
};

Game.Logic = function() {
	// clear draw targets
	Game.gCanvas.objectsClear();
	
	// handle objects
	Game.enemyLoop(); // policemans
	Game.animationLoop(); // animations
	Game.orbLoop(); // orbs
	
	
	// create new policeman
	if(!Game.isGameOver && Game.startCountdown <= 0)
		Game.spawnEnemy();
};

Game.addUsualObjectsToDraw = function() {
	// draw bg & build & icons
	Game.drawStaticIcons();
	Game.drawStats();
	Game.drawCursor();
	
	if(Game.startCountdown > 0)
		Game.drawCountDown();
		
	if(Game.isGameOver)
		Game.drawGameOver();
};

Game.Draw = function() {
	// add env objects to draw;
	Game.addUsualObjectsToDraw();
	
	Game.gCanvas.objectsDraw();
};

Game.Proceed = function() {
	//if(Game.FPS.enabled)
	//	Game.updateFPS();
		
	Game.Logic();
		
	Game.handleDelay += ((new Date().getTime() - Game.time) - Game.FPS.timeForFrame);
	Game.handleDelay =  Math.min(Game.handleDelay, 1000*5);
	
	Game.time = new Date().getTime();
	while (Game.handleDelay > 0) {
		Game.Logic();
		Game.handleDelay -= Game.FPS.timeForFrame;
	}
	
	Game.Draw();
	
	
	Game.gameTimer = setTimeout(Game.Proceed, Game.FPS.timeForFrame);
};

$(function() {
	Game.Init();
});
