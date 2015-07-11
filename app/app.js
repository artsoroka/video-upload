var express      = require('express'); 
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 
var videoFiles   = require('./models/videoFiles'); 
var routes       = require('./routes'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/uploads')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.use('/auth', routes.auth); 
app.use('/upload', routes.upload); 

app.use('/', routes.main); 

app.get('/file/:name', function(req,res){
    res.send('get file data: ' + req.params.name); 
}); 

app.use('*', function(req,res){
    
    res.status('404').send('no valid route found on the server'); 
    
}); 


app.listen(config.port, function(){
    console.log('Application running on a port %d', config.port); 
});