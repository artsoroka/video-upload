var config     = require('../config'); 
var router     = require('express').Router(); 
var formidable = require('formidable'); 
var ffmpeg     = require('ffmpeg'); 
var videoFiles = require('../models/videoFiles'); 

var getValidFiles = function(files, callback){
     
    var numberOfFiles = files.upload.length || 1; 
    var emptyFiles    = []; 
    var validFiles    = []; 
        
    console.log('I have files: ', numberOfFiles);  

    if( ! files || ! files.upload )
        return callback('no files passed to the controller'); 
            
    if( ! files.upload.length )
        files.upload = [files.upload]; 
        
        
    files.upload.map(function(file){
        console.log('processing file %s with size %d', file.name, file.size);
            
    if( ! file.size )
        return emptyFiles.push(file);
        
        validFiles.push(file); 
            
    }); 
        
    
    if( emptyFiles.length ) return callback('empty file present');     
    
    callback(null, validFiles); 
        
};

router.post('/', function(req,res){
    var form = new formidable.IncomingForm();
    form.encoding  = 'utf-8';
    form.uploadDir = config.file_upload_dir; 
    form.keepExtensions = true;
    form.multiples = true; 
    
    form.parse(req, function(err, fields, files) {
    
        if( err ) return res.status(500).send('form parse error'); 
        
        getValidFiles(files, function(err, files){
            if(err) return res.status(500).json({ err: err }); 
        
            files.map(function(file){
                
                try {
                    new ffmpeg(file.path, function (err, video) {
                        if (!err) {
                            console.log('The video is ready to be processed');
                            
                            var entry = {
                                user: req.sessionID, 
                                file: file, 
                                meta: video.metadata
                            }; 
                            
                            videoFiles.insert(entry, function(err, newDoc){
                                if( err ) console.log('could not save new entry to db'); 
                                 
                            }); 
                            
                        } else {
                            console.log('Error: ' + err);
                        }
                    });
                } catch (e) {
                    console.log(e.code);
                    console.log(e.msg);
                    return console.log('error reading a file '); 
                }
                
                
            });     
        
            res.redirect('/');
            
        }); 
    });
}); 

module.exports = router; 