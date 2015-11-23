var express    = require('express'); 
var app        = express(); 
var server     = require('http').Server(app);
var io 		   = require('socket.io')(server);
var random     = require('./lib/random'); 
var uploadFile = require('./lib/uploadHandler'); 
var transcode  = require('./lib/transcodeHandler'); 
var reporter   = require('./lib/reporter')(io);  
var config     = require('../config'); 

app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/public')); 

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.get('/', function(req,res){
	res.render('mainpage', {
		channel: 'main'//random() 
	}); 
}); 

app.post('/upload', function(req,res){
    uploadFile(req)
    	.then(transcode(reporter))
    	.then(function(data){
    		res.json({done:data}); 
    	})
    	.catch(function(err){
    		res.status(500).json({
    			err: err
    		})
    	}); 
}); 

io.on('connection', function(socket){
	var channel = socket.handshake.query.channelId || 'main'; 
	socket.join(channel); 

	socket.on('disconnect', function(){
		socket.leave(channel); 
	}); 


/*
var notify = require('reporter')(socket, 'main'); 

setInterval(function(){
	io.to('main').emit('progress', {
		hello: 'world'
	});  
}, 4000); 
*/

}); 



module.exports = server; 