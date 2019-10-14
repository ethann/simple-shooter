// new Orb('red', 134, 80)
function Orb(_type, _x, _y) {
					
	this.id = Game.newObjectId++;
	this.type = _type;
	
	this.frames = {done: 0};
	this.actualRow = 0;
	
	this.position = {x: _x, y: _y, z: _y};
	this.posYDelta = 0; // max 15
	this.dir = -0.25; // 1 - down, -1 up
	this.background = {};
	this.background.position = {x: 0, y: 0};
	
	this.animation = 15;
	this.destroyed = false;
	
	this.ownIterate = 0;
	this.timeForFrame = Math.ceil(Game.FPS.max/15); // 4%
	this.action = 0; // 0 - wait, 1 - get pos info, 2 - fly away :D
	this.speed = {x:0, y:0};
	this.flyingTime;
	//this.particles = 0;
	//this.particles_max = 10;
		
		
		
		
		
	this.isDestroyed = function() { return this.destroyed; };
	
	this.destroy = function() { this.destroyed = true; };
		
	this.destroyAnimate = function() {
		this.destroyed = true;
		
		//TODO
	};
	
	this.nextFrame = function() {
		// prepare values
		this.background.position.x = this.type.background_start.x + (this.type.frameSize.width * (this.frames.done % this.type.frameSize.cols));
		this.background.position.y = this.type.background_start.y + (this.type.frameSize.height * this.actualRow);
		
		
		
		this.frames.done++;
		
		// check if next rows is needed
		if(this.frames.done % this.type.frameSize.cols == 0)
			this.actualRow++;
		
		// if end then start from begin
		if(this.actualRow >= this.type.frameSize.rows || this.frames.done >= this.type.frames) {
			this.frames.done = 0;
			this.actualRow = 0;
		}
	};
	
	this.caught = function() {
		this.action++;
	};
	
	this.levitate = function() {
		this.posYDelta += this.dir;
		if(Math.abs(this.posYDelta / 10) == 1) {
			if(this.dir == -0.25)
				this.dir = 0.25;
			else
				this.dir = -0.25;
		}
		this.position.y += this.dir;
	};
	
	this.gotoStats = function () {
		if(this.action == 1) {
			var speed = 5; // 2px per frame
			var dx = Math.abs(this.position.x - 15);
			var dy = Math.abs(this.position.y - 9);
			var max = Math.max(dx, dy);
			this.flyingTime = Math.floor(max/speed);
			this.position.z = 1019;
			
			this.speed.x = (this.position.x - 15)/(this.flyingTime);
			this.speed.y = (this.position.y - 9)/(this.flyingTime);
			//this.speed.hx = this.speed.x/2;
			//this.speed.hy = this.speed.y/2;
			this.action++;
		}
		
		if(this.flyingTime-- > 0) {
			// particles
			//if(this.particles < this.particles_max)
			//	this.particles++;
				
			this.position.x -= this.speed.x;
			this.position.y -= this.speed.y;
			
			if(this.flyingTime == 0) {
				this.destroyAnimate();
				if(this.type.color == 'blue') {
					Game.addOrbs(1);
				}
				else if(this.type.color == 'red') {
					Game.addOrbs(10);
				}
				else if(this.type.color == 'green') {
					Game.addLifes(1);
				}	
			}
		}
	};
	
	this.checkCollision = function(mouseX, mouseY) {
		if(this.action > 0)
			return false;
			
		return (mouseX >= this.position.x && mouseX <= this.position.x + this.type.size.width && 
				mouseY >= this.position.y && mouseY <= this.position.y + this.type.size.height);
	};
	
	
	this.update = function() {
		if(this.isDestroyed())
			return;
			
		// do animation of orb creation
		if(this.animation > 0) {
			if(this.animation == 15)
				Game.addAnimation(this.type.color + '_swift', this.position.x-10, this.position.y-10, this.position.z);
			
			this.animation--;
		}
		
		// do orb animation
		if(this.animation <= 0) {
			if(this.action == 0)
				this.levitate();
			else
				this.gotoStats();
				
			
			if(this.ownIterate % this.timeForFrame == 0)
				this.nextFrame();
		}
		
		this.ownIterate++;
	};
	
	this.draw = function() {
		if(this.animation <= 0) {
			/*if(this.particles > 0) {
				for(var i=0; i<this.particles; i++) {
					var q = this.particles - i;
					
					Game.gCanvas.circle({
						color: '#4889f2', 
						radius: Math.ceil(4/q),
						opacity: 0.8/q,
						x: this.position.x + 16 + this.speed.hx*q,
						y: this.position.y + 16 + this.speed.hy*q,
					});
				}
			}*/
			
			Game.gCanvas.image({
				image: Game.images[this.type.image],
				x: this.position.x, y: this.position.y,
				width: this.type.size.width, height: this.type.size.height,
				swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
				sx: this.background.position.x, sy: this.background.position.y
			});
		}
	};
	
	this.addToDraw = function() {
		if(this.animation <= 0) {
			Game.gCanvas.objectsAdd({
				z: this.position.z,
				type: 'image',
				style: {
					image: Game.images[this.type.image],
					x: this.position.x, y: this.position.y,
					width: this.type.frameSize.width, height: this.type.frameSize.height,
					swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
					sx: this.background.position.x, sy: this.background.position.y
				}
			});
		}
	};
}