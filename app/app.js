var express      = require('express'); 
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 
var ffmpeg       = require('ffmpeg'); 
var Datastore    = require('nedb'); 
var videoFiles   = new Datastore({
    filename: __dirname + '/db/videofiles.db',
    autoload: true
}); 

var routes = require('./routes'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/uploads')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.use('/auth', routes.auth); 

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

app.post('/upload', function(req,res){
    var formidable   = require('formidable'); 
    var form = new formidable.IncomingForm();
    form.encoding  = 'utf-8';
    form.uploadDir = './uploads'; 
    form.keepExtensions = true;
    
    form.parse(req, function(err, fields, files) {
      if( ! files.upload.size ) return res.status(400).send('file is empty'); 
      
      try {
            new ffmpeg(files.upload.path, function (err, video) {
                if (!err) {
                    console.log('The video is ready to be processed');
                    
                    var entry = {
                        user: req.sessionID, 
                        file: files.upload,
                        meta: video.metadata
                    }; 
                    
                    videoFiles.insert(entry, function(err, newDoc){
                        if( err ) res.status(500).send('could not save new entry to db'); 
                        res.redirect('/'); 
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