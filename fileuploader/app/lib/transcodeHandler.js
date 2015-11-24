var converter = require('./converter'); 
var Promise   = require('bluebird'); 
var config    = require('../../config'); 

module.exports = function(reporter){
	return function(formData){
		
		var channel = formData.form.channelId; 
		reporter.setChannel(channel); 
		
		return new Promise(function(resolve, reject){
			converter({
			    file        : formData.files.file.path,  
			    audioCodec  : 'aac', 
			    videoCodec  : 'libx264', 
			    outputFormat: 'mp4',
			    outputFile  : config.video_dir + '/' + formData.files.file.name,  
			    reporter    : reporter
			});

		}); 

	}
}