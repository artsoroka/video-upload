var express      = require('express'); 
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.get('/', function(req,res){
    res.send('welocome to video file upload service '); 
}); 

app.get('/upload', function(req,res){
    res.send('upload file form'); 
}); 

app.post('/upload', function(req,res){
    res.send('video file upload endpoint'); 
}); 

app.get('/file/:name', function(req,res){
    res.send('get file data: ' + req.params.name); 
}); 

app.listen(config.port, function(){
    console.log('Application running on a port %d', config.port); 
});