var Reporter = function(io){
	this.socket = io; 
}

Reporter.prototype.setChannel = function(channel){
	this.channel = channel; 
};

Reporter.prototype.notify = function(topic, message){
	this.socket
		.to(this.channel)
		.emit(topic, message); 
}

module.exports = function(io){
	return new Reporter(io); 
} 