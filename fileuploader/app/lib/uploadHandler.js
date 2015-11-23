var formidable = require('formidable'); 
var Promise    = require('bluebird'); 
var config     = require('../../config'); 

module.exports = function(request){
    return new Promise(function(resolve, reject){

        var form = new formidable.IncomingForm();
            form.encoding       = 'utf-8';
            form.uploadDir      = config.upload_dir; 
            form.keepExtensions = true;
            form.multiples      = true; 

        form.parse(request, function(err, fields, files) {
            if( err ) {
                console.log('file upload error', err); 
                return reject('error while uploading a file');    
            }

            resolve({
                form: fields, 
                files: files
            }); 

        }); 

    }); 
}