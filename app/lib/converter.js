var fs     = require('fs'); 
var ffmpeg = require('fluent-ffmpeg'); 
var Promise = require('bluebird'); 

var checkFile = function(filePath){
    return new Promise(function(resolve, reject){
        fs.exists(filePath, function(exists){
            if( ! exists ) return reject('file does not exist');
            
            return resolve(true); 
        });     
    }); 
}; 

var transcode = function(settings){
    return function(){
        return new Promise(function(resolve, reject){
            ffmpeg(settings.file)
                .audioCodec(settings.audioCodec)
                .videoCodec(settings.videoCodec)
                .format(settings.outputFormat)
                .save(settings.outputFile)
                .on('progress', function(progress) {
                    settings.reporter.log('Processing: ' + progress.percent + '% done');
                })
                .on('end', function() {
                    settings.reporter.log('Transcoding succeeded !');
                    resolve('Finished transcoding');  
                })
                .on('error', function(err,stdout,stderr) {
                    settings.reporter.log('an error happened: ' + err.message);
                    settings.reporter.log('ffmpeg stdout: ' + stdout);
                    settings.reporter.log('ffmpeg stderr: ' + stderr);
                    reject(err.message); 
                })
                .on('start', function() {
                    settings.reporter.log('file starting');
                });
                
        }); 
    }; 
}; 

module.exports = function(settings){
    checkFile(settings.file)
        .then(transcode(settings))
        .then(function(status){
            console.log('STATUS: ', status); 
        })
        .catch(function(err){
            console.log('ERR: ', err); 
        }); 
}; 