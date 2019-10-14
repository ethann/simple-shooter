// needs jQ

function Canvas(canvasElement) {
	this.self = canvasElement;
	this.context;
	this.defaultStyle;
	
	this.init = function() {
		this.context = this.self.getContext('2d');
		this.defaultStyle = {
			opacity: 1,
			image: null,
			
			// source
			sx: 0,
			sy: 0,
			swidth: null,
			sheight: null,
			
			// target
			x: 0,
			y: 0,
			width: null,
			height: null,
			
			// text
			color: '#000000',
			fontSize: '12px',
			fontWeight: 'normal',
			fontFamily: 'sans-serif',
			textAlign: 'left',
			textBaseline: 'top',
			
			shadowColor: "black",
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			shadowBlur: 0,
			
			strokeStyle: '#000000',
			strokeWidth: 0,
			strokeOnly: 0,
			
			// shapes
			radius: 0
		};
		
		this.objectList = {};
	};
	
	this.objectsClear = function() {
		this.objectList = {};
	};
	
	this.objectsAdd = function(object) {
		if(this.objectList == undefined)
			this.objectList = {};
			
		if(this.objectList[object.z] == undefined)
			this.objectList[object.z] = [];
		
		this.objectList[object.z].push(object);
		return this;
	};
	
	this.objectsDraw = function() {
		var keys = Object.keys(this.objectList);
		for(var i =0, len=keys.length; i<len; i++) 
			keys[i] = parseInt(keys[i]);
		
		keys.sort(function(a,b){return a-b;});
		
		for(var k in keys) {
			var key = keys[k];
			
			for(var i=0, len=this.objectList[key].length; i<len; i++) {
				switch(this.objectList[key][i].type) {
					case 'image':
						this.image(this.objectList[key][i].style);
						break;
						
					case 'text':
						this.text(this.objectList[key][i].text, this.objectList[key][i].style);
						break;
						
					case 'circle':
						this.circle(this.objectList[key][i].style);
						break;
						
					case 'rectangle':
						this.rectangle(this.objectList[key][i].style);
						break;
						
					default:
						// TODO: output error/ unknown type
				}
			}
		}
	};
	
	
	
	
	this.correct = function(style) {
		if(style.swidth == null) style.swidth = style.width;
		if(style.sheight == null) style.sheight = style.height;
	};
	
	this.clear = function() {
		this.context.clearRect(0, 0, this.self.width, this.self.height);
		
		return this;
	}
	
	this.image = function(ownStyle) {
		var style = $.extend({}, this.defaultStyle, ownStyle);
		if(style.image == null || style.width == null || style.height == null) 
			return;
			
		this.correct(style);
		
		this.context.globalAlpha = style.opacity;
		this.context.shadowColor = style.shadowColor;
		this.context.shadowOffsetX = style.shadowOffsetX;
		this.context.shadowOffsetY = style.shadowOffsetY;
		this.context.shadowBlur = style.shadowBlur;
		
		this.context.drawImage(style.image, 
			style.sx, style.sy, style.swidth, style.sheight, 
			style.x, style.y, style.width, style.height);
		
		return this;
	};
	
	this.text = function(text, ownStyle) {
		var style = $.extend({}, this.defaultStyle, ownStyle);
		
		// if it's a number then convert it to string
		if(typeof text === 'number')
			text = text.toString();
		
		// if it's another type than string or it's null or empty string then return
		if(text == null || typeof text !== 'string' || text.length <= 0 || style.fontSize <= 0) 
			return this;
			
		this.context.globalAlpha = style.opacity;
		this.context.textAlign = style.textAlign;
		this.context.textBaseline = style.textBaseline;
		this.context.fillStyle = style.color;
		this.context.shadowColor = style.shadowColor;
		this.context.shadowOffsetX = style.shadowOffsetX;
		this.context.shadowOffsetY = style.shadowOffsetY;
		this.context.shadowBlur = style.shadowBlur;
		this.context.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
		
		if(style.strokeOnly == 0) {
			this.context.fillText(text, style.x, style.y);
		}
		
		if(style.strokeWidth > 0) {
			this.context.strokeStyle = style.strokeStyle;
			this.context.lineWidth = style.strokeWidth;
			this.context.strokeText(text, style.x, style.y);
		}
		
		
		return this;
	};
	
	this.textWidth = function(text, ownStyle) {
		var style = $.extend({}, this.defaultStyle, ownStyle);
		
		// if it's a number then convert it to string
		if(typeof text == 'number')
			text = text.toString();
		
		// if it's another type than string or it's null or empty string then return
		if(text == null || typeof text != 'string' || text.length <= 0 || style.fontSize <= 0) 
			return {width: 0, height: 0};
			
		this.context.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
		var metrics = this.context.measureText(text);
		
		return metrics.width;
	};
	
	this.circle = function(ownStyle) {
		var style = $.extend({}, this.defaultStyle, ownStyle);
		
		if(style.radius <= 0) 
			return this;
	
		this.context.beginPath();
		this.context.globalAlpha = style.opacity;
		this.context.arc(style.x, style.y, style.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = style.color;
		this.context.fill();
		
		return this;
	};
	
	this.rectangle = function(ownStyle) {
		var style = $.extend({}, this.defaultStyle, ownStyle);
		
		if(style.width <= 0 || style.height <= 0)
			return this;
	
		this.context.beginPath();
		this.context.globalAlpha = style.opacity;
		this.context.rect(style.x, style.y, style.width, style.height);
		this.context.fillStyle = style.color;
		this.context.fill();
		
		return this;
	};
};