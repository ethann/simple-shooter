/** TOOLS **/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);


function convertColor(color) {
	if(/rgb(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*)/i.test(color)) { // rgb(34, 456, 34)
		
	}
	
}


function countDigits(number) {
	var digits = 1;
	while((number /= 10) >= 1)
		digits++;
	
	
	return digits;
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

