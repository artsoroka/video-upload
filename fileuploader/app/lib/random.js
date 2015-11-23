var random = require('random-string'); 
var params = {
	length: 33, 
	numeric: true, 
	letters: true, 
	special: false
}; 

module.exports = function(){
	return random(params);	
}
