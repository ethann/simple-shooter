function Weapon(_name, _damage, _image, _crosshair, _crosshair_hover, _shoot_animation) {
	this.name = _name;
	this.damage = _damage;
	this.image = _image[0];
	this.background = {x: _image[1], y: _image[2]};
	this.crosshair = _crosshair;
	this.crosshairHover = _crosshair_hover;
	this.shootAnimation = _shoot_animation;
	
	this.getCrosshair = function() {
		if(Game.target)
			return this.crosshairHover;
		else
			return this.crosshair;
	}
	
	this.getDamage = function() {
		return this.damage;
	}
	
	
};