var express      = require('express'); 
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 
var videoFiles   = require('./models/videoFiles'); 
var routes = require('./routes'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/uploads')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.use('/auth', routes.auth); 
app.use('/upload', routes.upload); 

app.get('/', function(req,res){
    videoFiles.find({}, function(err, files){
        
        if(err) return res.status(500).send('db error: ' + err); 
        
        res.render('mainpage', {
            files: files, 
            userFiles: files.filter(function(e){
                return e.user == req.sessionID; 
            })
        });      
    }); 
}); 
 

app.get('/file/:name', function(req,res){
    res.send('get file data: ' + req.params.name); 
}); 

app.listen(config.port, function(){
    console.log('Application running on a port %d', config.port); 
});