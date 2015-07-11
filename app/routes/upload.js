var config     = require('../config'); 
var router     = require('express').Router(); 
var formidable = require('formidable'); 
var ffmpeg     = require('ffmpeg'); 
var videoFiles = require('../models/videoFiles'); 

router.post('/', function(req,res){
    var form = new formidable.IncomingForm();
    form.encoding  = 'utf-8';
    form.uploadDir = config.file_upload_dir; 
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

module.exports = router; 