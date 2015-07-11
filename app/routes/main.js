var videoFiles = require('../models/videoFiles'); 
var router     = require('express').Router(); 

router.get('/', function(req,res){
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

module.exports = router; 