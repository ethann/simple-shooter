// new AnimatedText(_text, _style)
function AnimatedText(_text, _style) {
					
	this.id = Game.newObjectId++;
	this.ownIterate = 0;
	this.destroyed = false;
	this.text = _text;
	
	this.defaultStyle = {
		opacity: 1,
		backgroundColor: 'none',
		color: '#ffffff',
		fontSize: '12px',
		fontWeight: 'normal',
		fontFamily: 'sans-serif',
		
		strokeColor: '#000000',
		strokeWidth: 0,
		strokeOnly: 0,
		
		shadowColor: "black",
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowBlur: 0,
		
		animationTime: 90,
		fadeInTime: 10,
		fadeOutTime: 30,
		
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		startMoveTime: 0,
		endMoveTime: 0,
		
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 2,
		paddingBottom: 2
	};
	this.style = $.extend({}, this.defaultStyle, _style);
	
	this.framesDone = 0;
	this.position = {x: this.style.startX, y: this.style.startY, z: this.style.z};
	
	this.fadeOutStart = this.style.animationTime - this.style.fadeOutTime;
	this.opacity = this.style.opacity;
	if(this.style.fadeInTime > 0)
		this.opacity = 0;
		
	this.opacityInDelta = this.style.opacity / this.style.fadeInTime;
	this.opacityOutDelta = this.style.opacity / this.style.fadeOutTime;
	
	this.doMove = (this.style.endMoveTime > 0 && this.style.endMoveTime != this.style.startMoveTime)
	this.moveTime = this.style.endMoveTime + this.style.startMoveTime;
	this.speed = {
		x: (this.style.endX - this.style.startX)/this.moveTime,
		y: (this.style.endY - this.style.startY)/this.moveTime
	};

	this.textWidth = Game.gCanvas.textWidth(this.text, {
		fontSize: this.style.fontSize,
		fontFamily: this.style.fontFamily,
		fontWeight: this.style.fontWeight
	});
	this.textWidthHalf = this.textWidth/2;
	this.fontSize = parseInt(this.style.fontSize);
		
		
		
		
	if(typeof this.text === 'number')
		this.text = this.text.toString();
		
	if(typeof this.text !== 'string' || this.text == "")
		this.destroy();
		
		
	//fncs
	this.isDestroyed = function() { return this.destroyed; };
	this.destroy = function() { this.destroyed = true; };
	
	this.doAnimation = function() {
		if(this.framesDone < this.style.fadeInTime) {
			this.opacity = Math.min(this.style.opacity, this.opacity + this.opacityInDelta);
		}
		else if(this.framesDone >= this.fadeOutStart) {
			this.opacity = Math.max(0, this.opacity - this.opacityOutDelta);
		}
		
		if(this.doMove &&
			this.framesDone >= this.style.startMoveTime && 
			this.framesDone < this.style.endMoveTime) 
		{
			this.position.x += this.speed.x;
			this.position.y += this.speed.y;
		}
		//console.log(this.framesDone, '. ', this.opacity, this.position);
		
		this.framesDone++;
		// done?
		if(this.framesDone >= this.style.animationTime)
			this.destroy();
	};
	
	
	this.update = function() {
		if(this.isDestroyed())
			return;
		
		this.doAnimation();
		
		this.ownIterate++;
	};
	
	this.draw = function() {
		if(this.style.backgroundColor != 'none') {
			Game.gCanvas.rectangle({
				color: this.style.backgroundColor,
				x: this.position.x - this.textWidthHalf - this.style.paddingLeft, 
				y: this.position.y - 1 - this.style.paddingTop,
				opacity: this.opacity,
				width: this.textWidth + this.style.paddingLeft + this.style.paddingRight, height: this.fontSize + 2 + this.style.paddingTop + this.style.paddingBottom
			});
		}
		
		Game.gCanvas.text(this.text, {
			opacity: this.opacity,
			x: this.position.x, 
			y: this.position.y,
			
			strokeStyle: this.style.strokeColor,
			strokeWidth: this.style.strokeWidth,
			strokeOnly: this.style.strokeOnly,
			fontSize: this.style.fontSize,
			fontFamily: this.style.fontFamily,
			fontWeight: this.style.fontWeight,
			color: this.style.color,
			textAlign: 'center',
			textBaseline: 'top',
		
			shadowColor: this.style.shadowColor,
			shadowOffsetX: this.style.shadowOffsetX,
			shadowOffsetY: this.style.shadowOffsetY,
			shadowBlur: this.style.shadowBlur
		});
	};
	
	this.addToDraw = function() {
		if(this.style.backgroundColor != 'none') {
			Game.gCanvas.objectsAdd({
				z: this.position.z,
				type: 'rectangle',
				style: {
					color: this.style.backgroundColor,
					x: this.position.x - this.textWidthHalf - this.style.paddingLeft, 
					y: this.position.y - 1 - this.style.paddingTop,
					opacity: this.opacity,
					width: this.textWidth + this.style.paddingLeft + this.style.paddingRight, height: this.fontSize + 2 + this.style.paddingTop + this.style.paddingBottom
				}
			});
		}
		
		Game.gCanvas.objectsAdd({
			z: this.position.z,
			type: 'text',
			text: this.text,
			style: {
				opacity: this.opacity,
				x: this.position.x, 
				y: this.position.y,

				strokeStyle: this.style.strokeColor,
				strokeWidth: this.style.strokeWidth,
				strokeOnly: this.style.strokeOnly,
				fontSize: this.style.fontSize,
				fontFamily: this.style.fontFamily,
				fontWeight: this.style.fontWeight,
				color: this.style.color,
				textAlign: 'center',
				textBaseline: 'top',

				shadowColor: this.style.shadowColor,
				shadowOffsetX: this.style.shadowOffsetX,
				shadowOffsetY: this.style.shadowOffsetY,
				shadowBlur: this.style.shadowBlur
			}
		});
	};
}