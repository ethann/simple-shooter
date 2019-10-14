function Crosshair(_name, _size, _image, _bgpos, _center) {
	this.name = _name;
	this.size = {width: _size[0], height: _size[1]};
	this.background = {x: _bgpos[0], y: _bgpos[1]};
	this.pointer = {x: _center[0], y: _center[1]};
	this.image = _image;
	
	this.addToDraw = function(_x, _y) {
		if(this.image !== null && this.image != "undefined") {
			Game.gCanvas.objectsAdd({
				z: 10000,
				type: 'image',
				style: {
					image: Game.images[this.image],
					x: _x - this.pointer.x, y: _y - this.pointer.y,
					width: this.size.width, height: this.size.height,
					//swidth: this.type.frameSize.width, sheight: this.type.frameSize.height,
					sx: this.background.x, sy: this.background.y
				}
			});
		}
	};
}