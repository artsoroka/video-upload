var converter = require('./converter'); 
var Promise   = require('bluebird'); 

module.exports = function(reporter){
	return function(formData){
		
		var channel = formData.form.channelId; 
		reporter.setChannel(channel); 
		
		return new Promise(function(resolve, reject){
			resolve('ok good'); 
			setTimeout(function(){
				reporter.notify('progress', 'worker is doing some stuff'); 
			}, 5000); 

		}); 

	}
}