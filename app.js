var express      = require('express'); 
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 
var ffmpeg      = require('ffmpeg'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.get('/', function(req,res){
    res.render('mainpage');  
}); 

app.post('/upload', function(req,res){
    var formidable   = require('formidable'); 
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = './uploads'; 
    form.keepExtensions = false;
    
    form.parse(req, function(err, fields, files) {
      if( ! files.upload.size ) return res.status(400).send('file is empty'); 
      
      try {
            new ffmpeg(files.upload.path, function (err, video) {
                if (!err) {
                    console.log('The video is ready to be processed');
                    res.send({
                        user: req.sessionID, 
                        file: files.upload,
                        meta: video.metadata
                    }); 
                } else {
                    console.log('Error: ' + err);
                }
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
            return res.send('error reading a file '); 
        }
      
    });
    
    
}); 

app.get('/file/:name', function(req,res){
    res.send('get file data: ' + req.params.name); 
}); 

app.listen(config.port, function(){
    console.log('Application running on a port %d', config.port); 
});