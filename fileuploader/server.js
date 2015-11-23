var app    = require('./app'); 
var config = require('./config'); 
 
var server = app.listen(config.port, function(){
	console.log('App is listening on port ', server.address().port)
}); 