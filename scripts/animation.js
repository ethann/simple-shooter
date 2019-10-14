// new Animation('blood', 6, 33, 32, 134, 80)
function Animation(	_type, _infinity, _x, _y, _z) {
					
	this.id = Game.newObjectId++;
	this.type = _type;
	this.done = false;
	this.infinity = _infinity;
	
	this.frames = {done: 0};
	this.actualRow = 0;
	
	this.position = {x: _x, y: _y, z:_z};
	this.background = {};
	this.background.position = {x: 0, y: 0};
	
	this.ownIterate = 0;
	this.timeForFrame = Math.ceil(Game.FPS.max/this.type.framePerSecond); // 4%
	this.destroyed = false;
	
	
		
		
	//fncs
	this.isDestroyed = function() { return this.destroyed; };
	
	this.destroy = function() { this.destroyed = true; };
	
	this.resetAnimation = function() {
		this.actualRow = 0;
		this.frames.done = 0;
	};
	
	this.nextFrame = function() {
		// prepare values
		this.background.position.x = this.type.background_start.x + (this.type.frameSize.width * (this.frames.done % this.type.frameSize.cols));
		this.background.position.y = this.type.background_start.y + (this.type.frameSize.height * this.actualRow);
		
		
		
		this.frames.done++;
		
		//check if animation is done
		if(!this.done && this.frames.done >= this.type.frames)
			this.done = true;
			
		
		// check if next row is necessery for next frame
		if(this.frames.done % this.type.frameSize.cols == 0)
			this.actualRow++;
		
		
		// if end then start from begin
		if(this.actualRow >= this.type.frameSize.rows || this.frames.done >= this.type.frames)
			this.resetAnimation();
		
	};
	
	
	this.update = function() {
		if(this.isDestroyed())
			return;
		
		if(this.ownIterate % this.timeForFrame == 0) {
			if(this.done && !this.infinity) {
				this.destroy();
				return;
			}
			
			this.nextFrame();
		}
		
		this.ownIterate++;
	};
	
	this.draw = function() {
		Game.gCanvas.image({
			image: Game.images[this.type.image],
			x: this.position.x, y: this.position.y,
			width: this.type.frameSize.width, height: this.type.frameSize.height,
			swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
			sx: this.background.position.x, sy: this.background.position.y
		});
	};
	
	this.addToDraw = function() {
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
	};
}