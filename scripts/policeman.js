// _speed: fastest - 8, slowest - 1
function Policeman(_speed, _type, _starts_from) {
	_speed = Math.max(Math.min(parseInt(_speed), 8), 1);
	
	this.health = _type.health;
	this.type = _type;
	
	this.id = Game.newObjectId++;
	this.ownIterate = 0;
	this.position = {};
	
	this.background = {};
	this.background.position = {x: 0, y: 0};
	
	// move animation
	// top right down left
	this.frames = {all: this.type.frames, done: 0};
	this.spriteUpdateTime = Math.ceil(Game.FPS.max / (_speed*2));
	
	this.movement = {};
	this.movement.done = 0;
	this.movement.boost = (1 + ((_speed>=4? random(1, 3): 1) / 3)); // min: 1, 1.333, 1.667, 2 :max
	this.movement.speed = 0.4 * _speed * this.movement.boost; // min: 0.4 * 1 * 1 = 0.4,  max: 0.4 * 8 * 2 = 6,4
	
	this.direction = {};
	this.direction.num = (_starts_from == 'left' ? 1: 3); // 0 - up, 1 - right, 2 - down, 3 - left
	this.direction.str = Game.directions[this.direction.num];
	
	this.state = {
		destroyed: false,
		dead: false,
		gotThing: false,
		middleTimer: Game.FPS.max
	};
	
	this.action = {
		type: 0, // 0 = go, 1 = take, 2 - back, 3 - animationDead
		function: null,
		timeLeft: 0
	};
	
	this.opacity = 1; 
	this.deltaOpacity = 0; 
	
	this.fullPath = (Game.width - 120) + this.type.size.width*6;
	this.halfPath = this.fullPath/2;
	
	this.position.x = this.direction.num == 1? -this.type.size.width: (Game.width + this.type.size.width);
	this.position.y = random(53, Game.height - this.type.size.height - 10); // 3-76 // minus 10 to make them not walking on building boards
	this.position.z = this.position.y;
	
	this.startRow = this.direction.num * this.type.frameSize.rows;
	this.actualRow = this.startRow;
	
		
		
		
	this.isDestroyed = function() { return this.state.destroyed; };
	this.isDead = function() { return this.state.dead; };
		
	this.destroy = function() { this.state.destroyed = true; };
		
	this.deadAnimate = function() {
		if(this.action.timeLeft-- >= 0) {
			// do action
			this.opacity = Math.max(this.opacity - this.deltaOpacity, 0);
		}
		else {
			// end action
			this.destroy();
		}
	};
		
		
	
	this.setDirection = function(newDir) {
		if(typeof newDir == 'string') {
			if(this.direction.str == newDir || Game.directions.indexOf(newDir) == -1)
				return;
				
		
			this.direction.num = Game.directions.indexOf(newDir);
			this.direction.str = newDir;
		}
		else if(typeof newDir == 'number') {		
			if(this.direction.num == newDir || Game.directions[newDir] == undefined) 
				return;
			
			if(Game.directions[newDir] == undefined)
				return;
				
			this.direction.num = newDir;
			this.direction.str = Game.directions[newDir];
		}
		
		//start move from the begin
		this.startRow = this.direction.num * this.type.frameSize.rows;
		this.resetAnimation();
	};
	
	this.resetAnimation = function() {
		this.actualRow = this.startRow;
		this.frames.done = 0;
	}
	
	this.nextFrame = function() {
		// prepare values
		this.background.position.x = this.type.background_start.x + (this.type.frameSize.width * (this.frames.done % this.type.frameSize.cols)) + this.frames.done;
		this.background.position.y = this.type.background_start.y + (this.type.frameSize.height * this.actualRow) + this.actualRow;
		
		
		this.frames.done++;
		
		// check if next row is necessery for next frame
		if(this.frames.done % this.type.frameSize.cols == 0)
			this.actualRow++;
		
		// if end then start from begin
		if(this.actualRow >= this.startRow + this.type.frameSize.rows || this.frames.done >= this.type.frames) {
			this.resetAnimation();
		}
	};
	
	
	this.move = function(updateSprite) {
		// update position
		if(this.direction.num == 1)
			this.position.x += this.movement.speed;
		else // left
			this.position.x -= this.movement.speed;
			
			
		this.movement.done += this.movement.speed;
			
		
		
		// update Sprite
		if(updateSprite)
			this.nextFrame();
	};
	
	
	this.gotMiddle = function() {
		// check if got middle
		var got = (this.movement.done >= this.halfPath);
			
		if(got) {
			this.movement.done = this.halfPath;
			this.action.type++;
			this.state.gotThing = true;
			// if left then right and vice versa
			this.setDirection(this.direction.num == 1?3: 1);
			
			// todo: add bush
		}
	};
	
	
	this.waitInTheMiddle = function() {
		if(--this.state.middleTimer <= 0)
			this.action.type++;
	};
	
	
	this.flew = function() {
		if(this.movement.done >= this.fullPath) {
			this.destroy();
			Game.addLifes(-1);
		}
	};
	
	
	this.shoot = function(x, y) {
		//take damage
		var damage = 0;
		if(Game.weapon !== null) {
			var tmp = Game.weapon.getDamage() * 0.1;
			damage = Game.weapon.getDamage() + Math.random() * tmp;
		}
			
		this.health -= damage;
		
		if(this.health <= 0) {
			this.state.dead = true;
		
			this.action.type = 3;
			this.action.timeLeft = Math.ceil(Game.FPS.max/2);
			this.action.function = this.deadAnimate;
			this.deltaOpacity = this.opacity / this.action.timeLeft;
		}
		
		//add animation
		Game.addAnimation('blood', x - 16, y - 16, this.position.z);
		
		// add animated text
		var textpos = {
			x: this.position.x + this.type.size.width/2,
			y: this.position.y - 10
		};
		
		Game.addAnimatedText("-" + damage.toFixed(1), {
			backgroundColor: 'none', 
			
			color: '#bb0000', 
			fontFamily: 'Geo', 
			fontSize: '14px', 
			fontWeight: 'bold',
			
			animationTime: 90,
			endX: textpos.x, endY: textpos.y-20,
			startMoveTime: 0,
			endMoveTime: 90,
			shadowColor: '#ffffff',
			shadowBlur: 3
		}, textpos.x, textpos.y, 1021);
		
		
		// check if already dead
		if(this.isDead())
			this.onDead(x, y);
	};
	
	this.onDead = function(event) {
		// restore life if policeman had one
		var points = this.getPoints();
		
		// add point
		Game.addPoints(points);
		
		// create orb
		if((this.movement.speed / 16) > Math.random()) { // max 40% chance
			var orb_pos = {x: this.position.x, y: this.position.y+(this.type.size.height/2)};
			// 5% chance to spawn red orb
			// 5% chance to spawn green orb
			var rand = Math.random();
			if(rand < .05)
				Game.spawnOrb('red', orb_pos.x, orb_pos.y);
			else if(rand > .95)
				Game.spawnOrb('green', orb_pos.x, orb_pos.y);
			else
				Game.spawnOrb('blue', orb_pos.x, orb_pos.y);
			
		}
		

		// add text
		var textpos = {
			x: this.position.x + this.type.size.width/2,
			y: this.position.y - 20
		};
		
		Game.addAnimatedText("+" + points.toFixed(1), {
			backgroundColor: 'none', 
			
			color: '#ffffff', 
			fontFamily: 'Geo', 
			fontSize: '14px', 
			fontWeight: 'bold',
			
			animationTime: 90,
			endX: textpos.x, endY: textpos.y-30,
			startMoveTime: 0,
			endMoveTime: 90,
			shadowBlur: 3
		}, textpos.x, textpos.y, 1021);
		
		/*
		Game.addAnimatedText("+" + points.toFixed(1), {
			fontFamily: 'Geo', 
			backgroundColor: 'rgba(0,0,0,0.3)', 
			color: '#ffffff', 
			fontSize: '14px', 
			paddingLeft:15, paddingRight:15
		}, this.position.x + this.type.size.width/2, this.position.y - 10);
		*/
	};
	
	
	this.getPoints = function() {
		var top_boost = this.gotThing? 12.5: 10.0;
		var points = ((this.movement.done/this.fullPath)*2.5  + this.movement.speed) * top_boost;
		
		return points;
	};
	

	this.checkCollision = function(mouseX, mouseY) {
		// return false if action is other than go to mid and go back
		if(this.action.type != 0 && this.action.type != 2)
			return false;
	
		// return false if click on building.
		// w 112
		var buildingLeftSide = (Game.width-112)/2;
		if(mouseX >= buildingLeftSide && mouseX <= buildingLeftSide+112)
			return false;
	
		return (mouseX >= this.position.x && mouseX <= this.position.x + this.type.size.width && 
				mouseY >= this.position.y && mouseY <= this.position.y + this.type.size.height);
	};
	
	
	this.update = function() {
		if(this.isDestroyed())
			return;
			
		switch(this.action.type) {
			case 0:
				// do move
				this.move(this.ownIterate % this.spriteUpdateTime == 0);
				this.gotMiddle();
				break;
				
			case 1:
				// do move
				this.waitInTheMiddle();
				break;
			
			case 2:
				// do move
				this.move(this.ownIterate % this.spriteUpdateTime == 0);
				this.flew();
				break;
			
			default:
				if(this.action.function != null) {
					this.action.function.apply(this, null);
				}
				break;
			
		}
		
		this.ownIterate++;
	};
	
	this.draw = function() {
		Game.gCanvas.image({
			image: Game.images[this.type.image],
			x: this.position.x, y: this.position.y,
			width: this.type.size.width, height: this.type.size.height,
			swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
			sx: this.background.position.x, sy: this.background.position.y,
			opacity: this.opacity
		});
	};
	
	this.addToDraw = function() {
		Game.gCanvas.objectsAdd({
			z: this.position.z,
			type: 'image',
			style: {
				image: Game.images[this.type.image],
				x: this.position.x, y: this.position.y,
				width: this.type.size.width, height: this.type.size.height,
				swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
				sx: this.background.position.x, sy: this.background.position.y,
				opacity: this.opacity
			}
		});
	};
}