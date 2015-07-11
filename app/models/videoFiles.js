var config     = require('../config'); 
var Datastore  = require('nedb'); 
var videoFiles = new Datastore({
    filename: config.db_path + '/videoFiles.db', 
    autoload: true
});

module.exports = videoFiles; 