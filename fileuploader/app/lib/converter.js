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
                    settings.reporter.notify('progress','Processing: ' + progress.percent + '% done');
                })
                .on('end', function() {
                    settings.reporter.notify('progress','Transcoding succeeded !');
                    resolve('Finished transcoding');  
                })
                .on('error', function(err,stdout,stderr) {
                    settings.reporter.notify('progress','an error happened: ' + err.message);
                    settings.reporter.notify('progress','ffmpeg stdout: ' + stdout);
                    settings.reporter.notify('progress','ffmpeg stderr: ' + stderr);
                    reject(err.message); 
                })
                .on('start', function() {
                    settings.reporter.notify('progress','started  transcoding ');
                });
                
        }); 
    }; 
}; 

module.exports = function(settings){
    return new Promise(function(resolve, reject){
        checkFile(settings.file)
            .then(transcode(settings))
            .then(function(status){
                resolve('done transcoding'); 
            })
            .catch(function(err){
                reject(err); 
            });
    }) 
};